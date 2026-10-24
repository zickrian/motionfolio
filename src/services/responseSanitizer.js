const ACTION_METADATA_PATTERNS = [
  /^\s*```(?:json)?\s*$/i,
  /^\s*```\s*$/,
  /^\s*"?action"?\s*:/i,
  /^\s*"?params"?\s*:/i,
  /^\s*"?target"?\s*:/i,
  /^\s*\{\s*$/,
  /^\s*}\s*$/,
];

const NAVIGATION_NARRATION_PATTERNS = [
  /\b(i\s*(will|'ll)\s*(open|navigate|scroll|take you|bring you))/i,
  /\b(let me\s*(open|navigate|scroll|take you|bring you))/i,
  /\b(saya|aku)\s+(akan\s+)?(buka|scroll|arahkan|pindahkan)/i,
  /\b(saya|aku)\s+(sudah|udah)\s+(buka|scroll|arahkan|pindahkan)/i,
  /\b(saya|aku)\s+(bawa|nganter|antar)\s+kamu\s+ke\b/i,
  /\b(lihat|cek)\s+di\s+(bagian|section)\b/i,
  /\b(silakan|silahkan)\s+(lihat|cek)\s+(bagian|section)\b/i,
  /\b(navigate|scroll)\s+to\b/i,
  /\b(ke\s+section|ke\s+bagian|halaman\s+ini)\b/i,
  /\b(opening|navigating|scrolling)\b/i,
];

function shouldDropLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;

  if (ACTION_METADATA_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  return NAVIGATION_NARRATION_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function sanitizeAssistantResponse(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  const cleaned = rawText
    .split("\n")
    .filter((line) => !shouldDropLine(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned;
}
