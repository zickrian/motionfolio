import { generateSystemPrompt, buildScopedContext } from "./aiContext";

// ─────────────────────────────────────────────────────────────────
// ⚠️  SECURITY WARNING — DEMO-ONLY (NOT PRODUCTION-SAFE) ⚠️
// ─────────────────────────────────────────────────────────────────
// This module calls the Cerebras API DIRECTLY FROM THE BROWSER using a key read
// from `import.meta.env`. Vite inlines every `VITE_*` / `REACT_APP_*` variable into
// the CLIENT BUNDLE at build time, so this key is shipped to every visitor and is
// publicly readable via DevTools or the bundled JS.
//
// This is fine for LOCAL DEVELOPMENT and quick DEMOS, but it is NOT SAFE for
// production with a private/billable key — anyone can extract and abuse it.
//
// For production, route requests through a server-side / serverless proxy that
// holds the key as a SERVER SECRET, and have the frontend call your own endpoint
// (e.g. POST /api/chat) instead of the provider directly. See docs/ai-terminal.md
// and SECURITY.md for a recommended architecture and a proxy example.
// ─────────────────────────────────────────────────────────────────
const API_KEY = (
  import.meta.env.VITE_CEREBRAS_API_KEY ||
  import.meta.env.REACT_APP_CEREBRAS_API_KEY ||
  ""
).trim();

const CEREBRAS_CHAT_COMPLETIONS_URL = "https://api.cerebras.ai/v1/chat/completions";

// Error classification for granular UI feedback
const classifyError = (error) => {
  const msg = error?.message?.toLowerCase() || "";
  const status = error?.status || error?.statusCode || 0;

  if (
    (typeof navigator !== "undefined" && !navigator.onLine) ||
    msg.includes("network") ||
    msg.includes("fetch") ||
    msg.includes("failed to fetch") ||
    msg.includes("econnrefused")
  ) {
    return { type: "network", message: "Connection lost. Check your internet and try again." };
  }
  if (status === 429 || msg.includes("rate limit") || msg.includes("too many")) {
    return { type: "rate_limit", message: "Too many requests. Please wait a moment." };
  }
  if (status >= 500 || msg.includes("server") || msg.includes("internal")) {
    return { type: "server", message: "Server is temporarily unavailable. Try again shortly." };
  }
  if (status === 401 || status === 403 || msg.includes("auth") || msg.includes("api key")) {
    return { type: "auth", message: "Authentication error. Contact the site owner." };
  }
  return { type: "unknown", message: "Something went wrong. Please try again." };
};

async function* parseOpenAICompatibleStream(response) {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const dataLines = event
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      for (const data of dataLines) {
        if (!data || data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch (error) {
          // Ignore partial/non-JSON SSE control frames.
        }
      }
    }
  }

  const trailing = buffer.trim();
  if (trailing.startsWith("data:")) {
    const data = trailing.slice(5).trim();
    if (data && data !== "[DONE]") {
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch (error) {
        // Ignore trailing parser errors.
      }
    }
  }
}

/**
 * Stream chat completions from Cerebras.
 * Yields text chunks as they arrive.
 * @param {Array} messages - Chat messages (already limited by caller)
 * @returns {AsyncGenerator<string>} - Yields text content chunks
 */
export async function* streamCerebras(messages) {
  if (!API_KEY) {
    const error = new Error("Missing API key");
    error.status = 401;
    throw classifyError(error);
  }

  const systemPrompt = generateSystemPrompt();
  const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const scopedContext = buildScopedContext(latestUserMessage);

  const conversation = [
    { role: "system", content: systemPrompt },
    ...(scopedContext ? [{ role: "system", content: scopedContext }] : []),
    ...messages,
  ];

  try {
    const response = await fetch(CEREBRAS_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversation,
        model: "gpt-oss-120b",
        max_tokens: 1024,
        temperature: 0.35,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = new Error(`Cerebras API error: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    for await (const content of parseOpenAICompatibleStream(response)) {
      yield content;
    }
  } catch (error) {
    const classified = classifyError(error);
    throw classified;
  }
}
