// ─── Example / Starter Portfolio Data ────────────────────────────
//
// This file is the GENERIC, copy-paste-ready version of the data that powers the
// portfolio. It mirrors the exact shape of `PORTFOLIO_DATA` in `portfolioData.js`,
// but with neutral placeholder content so you can fork MotionFolio and make it yours
// quickly.
//
// HOW TO USE THIS FILE
//   Option A (recommended for a fresh start):
//     1. Copy the object below into `src/data/portfolioData.js`, replacing the
//        existing `PORTFOLIO_DATA` value.
//     2. Fill in your real details.
//   Option B (swap the import):
//     1. In `src/services/aiContext.js` and `src/components/ChatWidget.jsx`,
//        change the import from `./portfolioData` to `./examplePortfolioData`
//        and rename the imported symbol, OR re-export this as `PORTFOLIO_DATA`.
//
// This file is intentionally NOT imported anywhere by default, so it cannot break
// the running app. It is a reference/template only.
//
// ─── FIELDS YOU SHOULD EDIT ───────────────────────────────────────
//   profile.name        → your full name
//   profile.role        → your title/headline (e.g. "Frontend Developer")
//   profile.bio         → 1–2 sentence summary about you
//   profile.location    → city / country
//   profile.email       → public contact email
//   profile.socials     → your social links (github, linkedin, ...)
//   experience[]        → your work / organization / education history
//   techStack[]         → your skills, grouped by `category`
//   projects[]          → short project summaries (see note below)
//   achievements[]      → awards, hackathons, competitions (optional)
//   capabilities[]      → high-level things you can do / specialize in
//
// RELATED FILES (also edit these to fully customize):
//   src/data/projectMeta.js          → project gallery cards (image, color, slug)
//   src/data/projectDetailsData.js   → full project case studies (`cat <slug>`)
//   src/data/sectionRegistry.js      → navbar + chat sections
//   src/components/ChatWidget.jsx    → terminal `COMMANDS` (help, ls, cat, ...)
//   src/services/aiContext.js        → AI assistant persona/system prompt
//
// NOTE: keep `projects[].slug` values in sync with the slugs used in
// `projectMeta.js` and `projectDetailsData.js` so the gallery, the `cat <slug>`
// terminal command, and the AI assistant all resolve to the same project.

export const EXAMPLE_PORTFOLIO_DATA = {
  // ── Basic identity. Shown across the site and used by the AI assistant. ──
  profile: {
    name: "Your Name",
    role: "Your Role / Headline",
    bio: "One or two sentences about who you are and what you build. Keep it punchy.",
    location: "City, Country",
    email: "you@example.com",
    socials: {
      github: "https://github.com/your-username",
      linkedin: "https://linkedin.com/in/your-username",
      // Add more if you like — make sure the component that renders socials
      // (e.g. Footer / HeroSection) reads the keys you add here.
    },
  },

  // ── Work, organization, education, or volunteering history. ──
  // Each entry: { title, period, description: string[] }
  experience: [
    {
      title: "Job Title — Company / Organization",
      period: "Jan 2024 - Present",
      description: [
        "What you do / did, with concrete outcomes when possible.",
        "A second bullet highlighting impact (numbers help: 'improved X by 30%').",
      ],
    },
    {
      title: "Previous Role — Company",
      period: "2022 - 2024",
      description: ["A short, results-oriented description of your responsibilities."],
    },
  ],

  // ── Skills grouped by `category`. The AI assistant groups these by category. ──
  // Each entry: { name, category }
  techStack: [
    { name: "JavaScript", category: "Language" },
    { name: "TypeScript", category: "Language" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Docker", category: "DevOps" },
    { name: "Figma", category: "Design" },
  ],

  // ── Short project summaries. ──
  // For full case studies (images, features, links), also edit
  // `projectMeta.js` (gallery cards) and `projectDetailsData.js` (details),
  // keeping the same `slug`.
  projects: [
    {
      slug: "example-project-one",
      title: "Example Project One",
      category: "Web Application",
      description: "A one-line description of what this project does.",
    },
    {
      slug: "example-project-two",
      title: "Example Project Two",
      category: "Mobile / API / etc.",
      description: "Another short description. Swap in your real work.",
    },
  ],

  // ── Awards, hackathons, competitions. Optional — leave [] if none. ──
  // Each entry shape matches what the AI assistant serializes:
  //   { title, project, description, team, track, techStack[], links{} }
  achievements: [
    {
      title: "Example Hackathon Finalist — 2025",
      project: "Project Name",
      description: "What you built and why it stood out.",
      team: "Team Name (your name & teammates)",
      track: "Track / Category",
      techStack: ["React", "Node.js", "PostgreSQL"],
      links: {
        live: "https://example.com",
        github: "https://github.com/your-username/your-repo",
        devfolio: "", // optional; leave empty to hide
      },
    },
  ],

  // ── High-level capabilities / specializations. Shown as a list. ──
  capabilities: [
    "Frontend Development",
    "UI / UX Implementation",
    "API Design",
    "Performance Optimization",
    "Accessibility",
  ],
};

// Convenience alias so you can do a drop-in swap by re-exporting as PORTFOLIO_DATA:
//   import { PORTFOLIO_DATA } from './examplePortfolioData';
export const PORTFOLIO_DATA = EXAMPLE_PORTFOLIO_DATA;

export default EXAMPLE_PORTFOLIO_DATA;
