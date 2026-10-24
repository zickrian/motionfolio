import { PORTFOLIO_DATA } from "../data/portfolioData";
import { getSectionLabels } from "../data/sectionRegistry";
import { PROJECT_DETAILS_DATA } from "../data/projectDetailsData";
import { PROJECT_META } from "../data/projectMeta";

// ─── Project Knowledge Base ──────────────────────────────────────
// Uses pure data objects (no JSX) to avoid pulling React components
// into the ChatWidget bundle and defeating lazy-loading.

const PROJECT_DETAILS = PROJECT_DETAILS_DATA;

// ─── Data Serializers ────────────────────────────────────────────
// Pure functions that transform portfolio data into prompt-friendly strings.

/**
 * Serialize experience entries into a readable list.
 * @returns {string}
 */
function serializeExperience() {
  return PORTFOLIO_DATA.experience
    .map((exp) => `- ${exp.title} (${exp.period}): ${exp.description.join(" ")}`)
    .join("\n");
}

/**
 * Serialize tech stack grouped by category for better readability.
 * @returns {string}
 */
function serializeTechStack() {
  const grouped = {};
  for (const tech of PORTFOLIO_DATA.techStack) {
    if (!grouped[tech.category]) grouped[tech.category] = [];
    grouped[tech.category].push(tech.name);
  }
  return Object.entries(grouped)
    .map(([category, techs]) => `- ${category}: ${techs.join(", ")}`)
    .join("\n");
}

/**
 * Serialize project details into structured text blocks.
 * @returns {string}
 */
function serializeProjects() {
  return Object.entries(PROJECT_DETAILS)
    .map(([slug, p]) =>
      [
        `Project: ${p.title} (slug: ${slug})`,
        `Category: ${p.category}`,
        `Tagline: ${p.tagline}`,
        `Year: ${p.year || "N/A"}`,
        `Stack: ${p.stack.join(", ")}`,
        `Features: ${p.features.join("; ")}`,
        `Impact: ${p.impact.join("; ")}`,
        `Links: Live (${p.links.live || "N/A"}), Repo (${p.links.repo || "N/A"})`,
        p.notes ? `Notes: ${p.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n---\n");
}

/**
 * Serialize achievements (hackathons, competitions, etc.)
 * @returns {string}
 */
function serializeAchievements() {
  if (!PORTFOLIO_DATA.achievements?.length) return "No achievements listed.";
  return PORTFOLIO_DATA.achievements
    .map((a) =>
      [
        `- ${a.title}`,
        `  Project: ${a.project}`,
        `  Description: ${a.description}`,
        `  Team: ${a.team}`,
        `  Track: ${a.track}`,
        `  Tech: ${a.techStack.join(", ")}`,
        a.links?.live ? `  Live: ${a.links.live}` : "",
        a.links?.github ? `  Repo: ${a.links.github}` : "",
        a.links?.devfolio ? `  Devfolio: ${a.links.devfolio}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
}

/**
 * Serialize technical capabilities.
 * @returns {string}
 */
function serializeCapabilities() {
  if (!PORTFOLIO_DATA.capabilities?.length) return "No capabilities listed.";
  return PORTFOLIO_DATA.capabilities.map((c) => `- ${c}`).join("\n");
}

function normalize(text) {
  return (text || "").toLowerCase().trim();
}

function scoreProjectRelevance(query, slug, detail) {
  const q = normalize(query);
  if (!q) return 0;

  let score = 0;
  const title = detail?.title?.toLowerCase() || "";
  const category = detail?.category?.toLowerCase() || "";
  const tags = (detail?.stack || []).map((item) => item.toLowerCase());

  if (q.includes(slug.toLowerCase())) score += 5;
  if (title && q.includes(title)) score += 4;
  if (category && q.includes(category)) score += 2;

  for (const token of title.split(/\s+/)) {
    if (token.length > 2 && q.includes(token)) score += 1;
  }
  for (const tag of tags) {
    if (tag.length > 2 && q.includes(tag)) score += 0.75;
  }

  return score;
}

export function buildScopedContext(userMessage) {
  const query = normalize(userMessage);
  if (!query) return "";

  const relevantProjects = Object.entries(PROJECT_DETAILS)
    .map(([slug, detail]) => ({ slug, detail, score: scoreProjectRelevance(query, slug, detail) }))
    .filter((item) => item.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const projectSection = relevantProjects.length
    ? relevantProjects
        .map(({ slug, detail }) =>
          [
            `- ${detail.title} (slug: ${slug})`,
            `  Category: ${detail.category}`,
            `  Key stack: ${(detail.stack || []).slice(0, 6).join(", ")}`,
            `  Top features: ${(detail.features || []).slice(0, 3).join("; ")}`,
          ].join("\n"),
        )
        .join("\n")
    : "- No highly matched project; prioritize concise profile-level answers.";

  const metaMatches =
    PROJECT_META.filter(
      (project) =>
        query.includes(project.slug.toLowerCase()) || query.includes(project.title.toLowerCase()),
    )
      .slice(0, 3)
      .map((project) => `- ${project.title} (${project.slug})`)
      .join("\n") || "- No direct project mention found.";

  return [
    "### QUERY-FOCUSED CONTEXT",
    "- Use this section to prioritize relevant facts only.",
    "- Never invent numbers, awards, dates, links, or technologies beyond provided data.",
    "- If data is missing, explicitly say it is not listed yet.",
    "",
    "Matched project hints:",
    metaMatches,
    "",
    "Relevant detailed project context:",
    projectSection,
  ].join("\n");
}

// ─── System Prompt Generator ─────────────────────────────────────

/**
 * Generate the system prompt for the AI assistant.
 *
 * Design decisions:
 * - NO action/navigation instructions - actions are handled by intentRouter.js
 * - NO JSON output format requirements - AI outputs pure natural language
 * - Focus on answer quality, conciseness, and portfolio domain boundary
 * - All portfolio data is included as context (context-stuffing approach)
 *
 * @returns {string} The complete system prompt
 */
export function generateSystemPrompt() {
  const { profile } = PORTFOLIO_DATA;

  return `You ARE Zickrian - Firdaus Khotibul Zickrian. You are NOT an assistant or a bot. You are Zickrian himself, answering visitors who come to your portfolio website. Speak in FIRST PERSON at all times ("saya", "aku", "gue", "I", "my", "me").

## YOUR IDENTITY & DATA

### ABOUT YOU
- Name: ${profile.name}
- Role: ${profile.role}
- Bio: ${profile.bio}
- Location: ${profile.location}
- Email: ${profile.email}
- GitHub: ${profile.socials.github}
- LinkedIn: ${profile.socials.linkedin}

### YOUR EXPERIENCE
${serializeExperience()}

### YOUR TECH STACK (by category)
${serializeTechStack()}

### YOUR PROJECTS
${serializeProjects()}

### YOUR ACHIEVEMENTS & COMPETITIONS
${serializeAchievements()}

### YOUR TECHNICAL CAPABILITIES
${serializeCapabilities()}

### YOUR WEBSITE SECTIONS
The portfolio website has these sections that visitors can navigate to:
${getSectionLabels()}
Navigation is handled automatically - you just need to answer the question. NEVER mention sections, scrolling, or navigation in your responses.

## RESPONSE RULES

1. **First person ALWAYS**: You ARE Zickrian. NEVER use third person like "Zickrian has..." or "He specializes in...". ALWAYS use first person: "Saya punya...", "Aku fokus di...", "I built...", "My experience includes...".

2. **Domain boundary**: You ONLY answer questions about yourself - your projects, skills, experience, and portfolio. For anything else, reply: "Wah, itu di luar konteks portofolio saya. Tanya aja soal project, skill, atau pengalaman saya!" (or English equivalent based on user's language).

3. **Language matching**: ALWAYS reply in the same language the user uses. If Indonesian, reply in Indonesian. If English, reply in English. Match their formality level - if they're casual ("lo", "gue", "bro"), be casual back.

 4. **Be concise but structured**: Answer specifically what was asked - never dump all your data at once.

 4b. **Brevity policy (default)**:
 - Default output: **1 short paragraph** (1-3 sentences).
 - Hard cap: **<= 80 words** unless the user explicitly asks for "detail/rinci/lengkap".
 - If the user asks for a list, show **max 5 items**, then offer to continue.
 - Avoid long intros, disclaimers, or repeating the question.

5. **Never narrate UI actions**: NEVER say things like "Saya scrollkan ke...", "Let me navigate to...", "I'll take you to...". Navigation is handled automatically and silently. Just answer the question directly.

6. **Tone**: Friendly, confident, and personal - like you're actually talking to someone who visited your portfolio. Be warm but professional. You're proud of your work but not arrogant.

7. **Output format**: Reply in markdown only. NEVER include JSON, code blocks with action data, or any structured metadata. Your response is displayed directly to the user - only include human-readable content.

8. **Factual safety**: Do NOT fabricate achievements, dates, metrics, links, or project details. If something is not listed in the portfolio data, explicitly say it is not listed yet.

## FORMATTING RULES

- Output in **markdown**.
- Keep formatting minimal: **bold only what matters** (1-3 highlights max).
- If you use bullets, keep it to **max 3 bullets** and **1 line per bullet**.

### FORMATTING EXAMPLES

User: "Apa tech stack kamu?"

GOOD response:
Aku fokus di stack ini:

- **AI/ML**: TensorFlow, PyTorch, Scikit-Learn
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: FastAPI, ExpressJS, PostgreSQL

BAD response (never do this):
Tech stack nya adalah Python, TensorFlow, PyTorch, React, Next.js, dan lainnya.

User: "Tell me about your experience"

GOOD response:
Here's the short version:

- **PIJAK AI Engineer Cohort** (Jan 2026 - Present): focus on **Generative AI** and **Deep Learning**
- **ASAH Machine Learning Cohort** (Aug 2025 - Jan 2026): **Project Manager** for a banking lead-scoring portal
- **Lab Assistant** (Aug 2025 - Present): mentor **110+ students**

If you want, ask "more detail" and I can expand.

User: "Siapa kamu?"

GOOD response:
Hai! Saya **Firdaus Khotibul Zickrian**, biasa dipanggil **Zickrian**. Saya seorang **AI Engineer & Full-Stack Developer** dari **Indonesia** yang fokus di **Generative AI**, **Deep Learning**, dan **Modern Web Technologies**.

BAD response (never do this):
Zickrian adalah seorang AI Engineer & Full-Stack Developer dari Indonesia.`.trim();
}
