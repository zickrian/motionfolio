# Roadmap

This is a living list of planned improvements for MotionFolio. It is meant to double
as a backlog of ready-to-pick GitHub issues. Contributions are welcome — see
[`CONTRIBUTING.md`](../CONTRIBUTING.md). Each item below can be opened as an issue
using the [feature request template](../.github/ISSUE_TEMPLATE/feature_request.md).

## Planned

### Add template mode with sample data

Add a toggle (e.g. an env flag or a single import switch) so the app can render with
the generic [`examplePortfolioData.js`](../src/data/examplePortfolioData.js) instead
of real content. This makes it easy to preview the starter and to develop without
exposing personal data.

- Acceptance: one switch flips the live site between real and example data.

### Add multiple theme presets

Provide a few ready-made color/font presets (e.g. "lime/black", "midnight",
"paper") selectable from one place (Tailwind config + CSS variables in
`src/index.css`).

- Acceptance: switching a single preset value restyles the whole site.

### Improve `prefers-reduced-motion` support

Audit every animation (GSAP helpers, hero, marquee, gallery, cursor, preloader) and
ensure each one has a reduced-motion path. Document the pattern.

- Acceptance: with reduced motion enabled, no large/looping motion remains.

### Extract reusable animation hooks

Refactor common GSAP/ScrollTrigger patterns from components into composable hooks
(e.g. `useReveal`, `useParallax`, `usePinnedSection`) layered on
`src/utils/gsapAnimate.jsx`.

- Acceptance: at least two sections adopt the shared hooks with no behavior change.

### Add more portfolio section examples

Ship optional, ready-to-use sections (e.g. testimonials, blog/writing list, services,
pricing) that plug into the section registry.

- Acceptance: a new section can be enabled by adding data + a registry entry.

### Add serverless proxy example for the AI terminal

Provide a deployable proxy (Vercel/Netlify function) so the AI key stays server-side,
wired to the frontend. See the design in [`docs/ai-terminal.md`](ai-terminal.md).

- Acceptance: a working example where the key is never in the client bundle.

### Add accessibility audit checklist

Create a checklist (and ideally automated checks) covering color contrast, focus
states, keyboard navigation, semantic landmarks, alt text, and reduced motion.

- Acceptance: a documented checklist plus fixes for any issues it surfaces.

### Add performance optimization guide

Document and improve image handling, code-splitting/lazy-loading, font loading, and
animation cost; add Lighthouse targets.

- Acceptance: a guide in `docs/` plus measurable build/runtime improvements.

## Ideas / under consideration

- TypeScript migration or JSDoc-based type coverage.
- A small CLI or script to scaffold a new project entry.
- i18n / multi-language content support.
- Unit/visual tests for critical animation and routing behavior.

## Done

- ✅ Initial open-source release (`0.1.0`) — see [`CHANGELOG.md`](../CHANGELOG.md).
