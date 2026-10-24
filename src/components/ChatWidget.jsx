import { lazy, Suspense, useState, useRef, useEffect, useCallback } from "react";
import { X, Terminal, Copy, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { streamCerebras } from "../services/cerebras";
import { resolveAction, detectOffTopic, detectLanguage } from "../services/intentRouter";
import { sanitizeAssistantResponse } from "../services/responseSanitizer";
import { ACTION_TO_ELEMENT } from "../data/sectionRegistry";
import { PROJECT_META } from "../data/projectMeta";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { PROJECT_DETAILS_DATA } from "../data/projectDetailsData";
import { exponentialEaseOut } from "../utils/easing";

const ReactMarkdown = lazy(() => import("react-markdown"));

// ─── Terminal Commands ─────────────────────────────────────────────
const COMMANDS = {
  help: {
    desc: "Show available commands",
    run: () =>
      [
        "  AVAILABLE COMMANDS",
        "  ──────────────────────────────",
        "  help       Show this help menu",
        "  ls         List all projects",
        "  cat <id>   View project details",
        "  neofetch   System info",
        "  whoami     Current user",
        "  date       Current date & time",
        "  history    Command history",
        "  clear      Clear terminal",
        "  ──────────────────────────────",
        "",
        "  Or just ask me anything about Zickrian!",
      ].join("\n"),
  },
  ls: {
    desc: "List all projects",
    run: () => {
      const lines = PROJECT_META.map(
        (p, i) => `  ${String(i + 1).padStart(2, " ")}  ${p.slug.padEnd(24, " ")} ${p.category}`,
      );
      return [
        "📁 Projects:",
        "  #   SLUG                     CATEGORY",
        "  ──  ───────────────────────── ──────────────────────",
        ...lines,
        "",
        `  Total: ${PROJECT_META.length} projects`,
        "  Use 'cat <slug>' for details.",
      ].join("\n");
    },
  },
  neofetch: {
    desc: "System info",
    run: () => {
      const p = PORTFOLIO_DATA.profile;
      const techs = PORTFOLIO_DATA.techStack.map((t) => t.name);
      const techRows = [];
      for (let i = 0; i < techs.length; i += 5) {
        techRows.push(techs.slice(i, i + 5).join(", "));
      }
      return [
        "        ╭──────────────────────╮",
        "  ⣿⣿    │  zickrian@portfolio   │",
        "  ⣿⣿    ╰──────────────────────╯",
        "  ⣿⣿    ─────────────────────────",
        `  ⣿⣿    Name     : ${p.name}`,
        `  ⣿⣿    Role     : ${p.role}`,
        `  ⣿⣿    Location : ${p.location}`,
        `  ⣿⣿    Email    : ${p.email}`,
        `  ⣿⣿    GitHub   : ${p.socials.github}`,
        `  ⣿⣿    LinkedIn : ${p.socials.linkedin}`,
        "  ⣿⣿    ─────────────────────────",
        "  ⣿⣿    Stack:",
        ...techRows.map((row) => `  ⣿⣿      ${row}`),
        `  ⣿⣿    Projects : ${PROJECT_META.length}`,
      ].join("\n");
    },
  },
  date: {
    desc: "Current date & time",
    run: () => new Date().toString(),
  },
  whoami: {
    desc: "Current user",
    run: () => "guest@portfolio-visitor",
  },
};

// ─── Cat command (requires slug parameter) ───────────────────────
const handleCat = (args) => {
  if (!args) {
    return "Usage: cat <project-slug>\nUse 'ls' to see available slugs.";
  }
  const slug = args.toLowerCase().trim();
  const project = PROJECT_META.find(
    (p) => p.slug.toLowerCase() === slug || p.title.toLowerCase().includes(slug),
  );
  if (!project) {
    const slugList = PROJECT_META.map((p) => `  - ${p.slug}`).join("\n");
    return `Project '${args}' not found.\n\nAvailable projects:\n${slugList}`;
  }
  const detail = getProjectDetail(project.slug);
  if (!detail) {
    return `${project.title}\nCategory: ${project.category}\n\nDetailed info not available. Use the chat to ask about this project!`;
  }
  return [
    `📦 ${detail.title}`,
    `   Category : ${detail.category}`,
    `   Tagline  : ${detail.tagline}`,
    `   Year     : ${detail.year || "N/A"}`,
    `   Stack    : ${detail.stack.join(", ")}`,
    "",
    "   Features:",
    ...detail.features.map((f) => `     • ${f}`),
    "",
    "   Links:",
    `     🌐 Live: ${detail.links.live || "N/A"}`,
    `     📂 Repo: ${detail.links.repo || "N/A"}`,
  ].join("\n");
};

// ─── Project detail lookup (pure data, no require) ──────────────
const getProjectDetail = (slug) => {
  return PROJECT_DETAILS_DATA[slug] || null;
};

// ─── Error display helpers ───────────────────────────────────────
const ERROR_ICONS = {
  network: "🔌",
  rate_limit: "⏳",
  server: "🔧",
  auth: "🔒",
  unknown: "⚠️",
};

// ─── Typewriter animation ────────────────────────────────────────
// Extracted as a reusable utility for cleaner code in the main handler.

/**
 * Animate text appearing character by character.
 * @param {string} text - Full text to typewrite
 * @param {Function} setMessages - React state setter for messages
 * @param {Function} onTick - Callback after each character (e.g., scroll)
 * @param {number} [speed=10] - Milliseconds per character
 * @returns {Promise<void>}
 */
function typewriteMessage(text, setMessages, onTick, speed = 10) {
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        const current = text.slice(0, i + 1);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: "bot", text: current };
          return updated;
        });
        onTick();
        i++;
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    };
    tick();
  });
}

// ─── Main Component ──────────────────────────────────────────────
const ChatWidget = ({ isOpen: controlledIsOpen, onOpenChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = onOpenChange ?? setInternalIsOpen;
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "System Online. I'm Zickrian's AI Assistant. Type `help` for commands, or ask me anything!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Command history
  const [commandHistory, setCommandHistory] = useState([]);
  const historyIndexRef = useRef(-1);
  const savedInputRef = useRef("");

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRafRef = useRef(null);

  // ─── Scroll to bottom ────────────────────────────────────────
  const forceScrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = requestAnimationFrame(() => {
      forceScrollToBottom();
      scrollRafRef.current = null;
    });

    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [messages, isTyping, isStreaming, forceScrollToBottom]);

  // ─── Focus input when terminal opens ─────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ─── Keyboard shortcut: Ctrl+K to toggle ─────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!onOpenChange && (e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onOpenChange, setIsOpen]);

  // ─── Copy to clipboard ───────────────────────────────────────
  const handleCopy = useCallback((text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }, []);

  // ─── Execute navigation action (silent - never shown in chat) ─
  const executeAction = useCallback(
    (action, params) => {
      if (!action) return;

      // Open a specific project detail modal
      if (action === "open_project" && params?.project_name) {
        const project = PROJECT_META.find(
          (p) =>
            p.title.toLowerCase().includes(params.project_name.toLowerCase()) ||
            p.slug.toLowerCase().includes(params.project_name.toLowerCase()),
        );
        if (project) {
          navigate(`/projects/${project.slug}`, { state: { backgroundLocation: location } });
        }
        return;
      }

      // Scroll to top (hero)
      if (action === "scroll_to_hero") {
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(0, {
            duration: 1.5,
            easing: exponentialEaseOut,
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      // Scroll to a named section (driven by sectionRegistry.js)
      const targetId = ACTION_TO_ELEMENT[action];
      if (!targetId) return;

      // Retry mechanism for lazy-loaded sections
      const scrollToElement = (retries = 3) => {
        const element = document.getElementById(targetId);
        if (element) {
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(element, {
              offset: -20,
              duration: 1.5,
              easing: exponentialEaseOut,
            });
          } else {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else if (retries > 0) {
          setTimeout(() => scrollToElement(retries - 1), 300);
        }
      };

      setTimeout(() => scrollToElement(), 300);
    },
    [navigate, location],
  );

  // ─── Handle terminal commands (local, no API call) ───────────
  const handleLocalCommand = (input) => {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    if (lower === "clear") {
      setMessages([]);
      return true;
    }

    if (lower === "history") {
      if (commandHistory.length === 0) {
        setMessages((prev) => [
          ...prev,
          { type: "user", text: trimmed },
          { type: "bot", text: "No command history yet.", isTerminal: true },
        ]);
      } else {
        const histText = commandHistory
          .map((cmd, i) => `  ${String(i + 1).padStart(3, " ")}  ${cmd}`)
          .join("\n");
        setMessages((prev) => [
          ...prev,
          { type: "user", text: trimmed },
          { type: "bot", text: histText, isTerminal: true },
        ]);
      }
      return true;
    }

    if (lower.startsWith("cat ") || lower === "cat") {
      const args = trimmed.slice(4).trim();
      const result = handleCat(args || null);
      setMessages((prev) => [
        ...prev,
        { type: "user", text: trimmed },
        { type: "bot", text: result, isTerminal: true },
      ]);
      return true;
    }

    if (COMMANDS[lower]) {
      const result = COMMANDS[lower].run();
      setMessages((prev) => [
        ...prev,
        { type: "user", text: trimmed },
        { type: "bot", text: result, isTerminal: true },
      ]);
      return true;
    }

    return false;
  };

  // ─── Send message (main handler) ─────────────────────────────
  // Flow: Pre-filter -> Resolve action -> LLM call -> Typewrite -> Execute action
  const handleSendMessage = useCallback(
    async (e, directMsg) => {
      if (e) e.preventDefault();
      const userMsg = (directMsg || inputValue).trim();
      if (!userMsg) return;

      // Save to command history
      setCommandHistory((prev) => [...prev, userMsg]);
      historyIndexRef.current = -1;
      savedInputRef.current = "";
      setInputValue("");

      // Step 0: Check for local terminal commands
      if (handleLocalCommand(userMsg)) return;

      // Add user message to chat
      setMessages((prev) => [...prev, { type: "user", text: userMsg }]);

      // Step 1: Pre-filter off-topic messages (no API call needed)
      const lang = detectLanguage(userMsg);
      const offTopicMessage = detectOffTopic(userMsg, lang);
      if (offTopicMessage) {
        setMessages((prev) => [...prev, { type: "bot", text: offTopicMessage }]);
        return;
      }

      // Step 2: Resolve navigation action from user intent (deterministic, no LLM)
      const { action, params } = resolveAction(userMsg);

      // Step 3: Call LLM for a natural language response
      setIsTyping(true);

      try {
        // Build conversation context - limit to last 6 non-terminal messages
        const apiMessages = messages
          .filter((m) => m.text && !m.isTerminal)
          .slice(-6)
          .map((m) => ({
            role: m.type === "bot" ? "assistant" : "user",
            content: m.text,
          }));
        apiMessages.push({ role: "user", content: userMsg });

        // Stream and collect the full response
        let fullText = "";
        for await (const chunk of streamCerebras(apiMessages)) {
          fullText += chunk;
        }

        // Step 4: Typewrite the response (clean text, no action metadata)
        setIsTyping(false);
        setIsStreaming(true);
        setMessages((prev) => [...prev, { type: "bot", text: "" }]);

        const safeText =
          sanitizeAssistantResponse(fullText.trim()) ||
          (lang === "en"
            ? "I can help with my portfolio projects, skills, and experience. Ask me anything there."
            : "Aku bisa bantu jawab soal portofolio, project, skill, dan pengalaman aku.");

        await typewriteMessage(safeText, setMessages, forceScrollToBottom);

        setIsStreaming(false);

        // Step 5: Execute navigation action silently after response is displayed
        if (action) {
          executeAction(action, params);
        }
      } catch (error) {
        setIsTyping(false);
        setIsStreaming(false);

        const icon = ERROR_ICONS[error?.type] || "⚠️";
        const errMsg = error?.message || "Something went wrong. Please try again.";

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: `${icon} ${errMsg}`,
            isError: true,
          },
        ]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [inputValue, messages, executeAction, forceScrollToBottom],
  );

  // ─── Keyboard: Arrow Up/Down for command history ─────────────
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndexRef.current === -1) {
        savedInputRef.current = inputValue;
      }
      const newIdx = Math.min(historyIndexRef.current + 1, commandHistory.length - 1);
      historyIndexRef.current = newIdx;
      setInputValue(commandHistory[commandHistory.length - 1 - newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndexRef.current <= 0) {
        historyIndexRef.current = -1;
        setInputValue(savedInputRef.current);
        return;
      }
      const newIdx = historyIndexRef.current - 1;
      historyIndexRef.current = newIdx;
      setInputValue(commandHistory[commandHistory.length - 1 - newIdx]);
    }
  };

  // ─── Quick action buttons ────────────────────────────────────
  const quickAction = (text) => {
    handleSendMessage(null, text);
  };

  // ─── RENDER ──────────────────────────────────────────────────
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end pointer-events-auto font-mono text-sm">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 md:mb-4 w-[min(95vw,480px)] bg-[#0c0c0c] border border-neutral-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 rounded-md">
          {/* Terminal Header */}
          <div className="bg-[#1a1a1a] px-3 py-2 flex justify-between items-center border-b border-neutral-800 select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="ml-2 text-neutral-400 text-xs">zickrian_bot - -bash</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-600 text-[10px] hidden md:inline">Ctrl+K</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
                aria-label="Close terminal"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            className="h-[52vh] md:h-[380px] overflow-y-auto p-3.5 md:p-4 flex flex-col gap-3 font-mono text-[13px] leading-relaxed relative scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Initial login line */}
            <div className="mb-2 text-neutral-500">
              Last login: {new Date().toDateString()} on ttys001
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col gap-1 break-words group/msg">
                {msg.type === "user" ? (
                  <div className="flex gap-2 text-lime-400">
                    <span className="shrink-0 select-none">{">"}</span>
                    <span>{msg.text}</span>
                  </div>
                ) : (
                  <div
                    className={`flex gap-2 relative ${msg.isError ? "text-red-400" : "text-neutral-300"}`}
                  >
                    <span
                      className={`shrink-0 select-none ${msg.isError ? "text-red-400" : "text-cyan-400"}`}
                    >
                      ●
                    </span>
                    <div className="flex-1 min-w-0">
                      {msg.isTerminal ? (
                        <pre className="whitespace-pre-wrap text-[12px] text-neutral-300 font-mono leading-relaxed">
                          {msg.text}
                        </pre>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-li:my-0 prose-code:bg-neutral-800 prose-code:px-1 prose-code:rounded prose-code:text-yellow-300 prose-a:text-blue-400 hover:prose-a:text-blue-300">
                          <Suspense fallback={<span>{msg.text}</span>}>
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => (
                                  <p className="mb-1 last:mb-0" {...props} />
                                ),
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </Suspense>
                        </div>
                      )}
                    </div>
                    {/* Copy button */}
                    {msg.text && !msg.isError && (
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="absolute right-0 top-0 opacity-0 group-hover/msg:opacity-100 transition-opacity text-neutral-600 hover:text-neutral-300 p-1"
                        aria-label="Copy message"
                      >
                        {copiedIdx === idx ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 text-neutral-500">
                <span className="shrink-0 text-cyan-400 select-none">●</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options */}
          <div className="px-3 py-2 border-t border-neutral-800 bg-[#0c0c0c] flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => quickAction("Tell me about your tech stack")}
              className="text-[10px] text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded hover:border-lime-400 hover:text-lime-400 transition-colors whitespace-nowrap"
              aria-label="Ask about tech stack"
            >
              ./stack
            </button>
            <button
              onClick={() => quickAction("Show me your projects")}
              className="text-[10px] text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded hover:border-lime-400 hover:text-lime-400 transition-colors whitespace-nowrap"
              aria-label="Ask about projects"
            >
              ./projects
            </button>
            <button
              onClick={() => quickAction("Tell me about your experience")}
              className="text-[10px] text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded hover:border-lime-400 hover:text-lime-400 transition-colors whitespace-nowrap"
              aria-label="Ask about experience"
            >
              ./experience
            </button>
            <button
              onClick={() => quickAction("How can I contact you?")}
              className="text-[10px] text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded hover:border-lime-400 hover:text-lime-400 transition-colors whitespace-nowrap"
              aria-label="Ask about contact"
            >
              ./contact
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-neutral-800 bg-[#0c0c0c] p-2 flex gap-2 items-center"
          >
            <span className="text-lime-400 pl-2 select-none">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              className="flex-1 bg-transparent border-none outline-none text-lime-400 text-base font-mono caret-lime-400"
              disabled={isTyping || isStreaming}
              autoFocus
              aria-label="Terminal input"
            />
            <button type="submit" className="hidden">
              Send
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-11 h-11 md:w-14 md:h-14 bg-black border border-neutral-800 text-lime-400 shadow-lg hover:bg-neutral-900 transition-all rounded-full"
        aria-label={isOpen ? "Close terminal" : "Open terminal (Ctrl+K)"}
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <Terminal size={20} className="group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
