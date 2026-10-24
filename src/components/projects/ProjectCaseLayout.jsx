import { Gsap } from "../../utils/gsapAnimate";
import { ArrowUpRight, Github, Globe } from "lucide-react";

// Helper: inject Cloudinary automatic format & quality + width
function cloudinarySrc(originalUrl, width) {
  try {
    if (!originalUrl || typeof originalUrl !== "string") return originalUrl;
    if (!originalUrl.includes("/upload/")) return originalUrl;
    // Avoid double-injecting transforms
    if (originalUrl.includes("f_auto") || originalUrl.includes("q_auto")) return originalUrl;
    return originalUrl.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  } catch {
    return originalUrl;
  }
}

const TechBadge = ({ children }) => (
  <span className="px-3 py-1.5 bg-black/5 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/80">
    {children}
  </span>
);

export default function ProjectCaseLayout({
  project,
  onClose,
  closeLabel = "Back to Home",
  preFeatureSection,
  mode,
}) {
  return (
    <div
      className={`bg-[#FAF9F6] text-black font-sans selection:bg-lime-400 selection:text-black overflow-x-hidden ${mode === "page" ? "min-h-screen" : "h-full flex flex-col"}`}
    >
      {/* ── Sticky header ─────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] md:tracking-[0.16em] text-black/40 flex items-center gap-2">
              {project.category}
            </span>
            <span className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] md:tracking-[0.16em] text-black/30 border-l border-black/20 pl-3">
              {project.year}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2 text-xs md:text-sm font-bold tracking-wide uppercase hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowUpRight className="rotate-[225deg]" size={16} />
            {closeLabel}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Hero Section ──────────────────────── */}
        <section className="max-w-4xl mx-auto text-center flex flex-col items-center px-6 md:px-10 pt-16 md:pt-20 pb-12">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-black/40 mb-4">
            Project Case Study
          </p>

          <Gsap.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-black mb-6"
          >
            {project.title.split(" ").map((word, i, arr) => (
              <span
                key={i}
                className={i === arr.length - 1 ? "text-transparent" : ""}
                style={i === arr.length - 1 ? { WebkitTextStroke: "2px black" } : {}}
              >
                {word}
                {i !== arr.length - 1 ? " " : ""}
              </span>
            ))}
          </Gsap.h1>

          <Gsap.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg leading-7 md:leading-8 text-black/60 max-w-2xl mx-auto"
          >
            {project.tagline}
          </Gsap.p>

          <Gsap.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="bg-lime-400 text-black px-8 py-3.5 font-bold uppercase text-xs tracking-wider hover:bg-black hover:text-white transition-all duration-300 rounded-[2px] flex items-center gap-2 shadow-sm"
              >
                <Globe size={16} /> View Live
              </a>
            )}
            {project.links?.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="bg-black/5 text-black px-8 py-3.5 font-bold uppercase text-xs tracking-wider border border-transparent hover:border-black/20 transition-all duration-300 rounded-[2px] flex items-center gap-2"
              >
                <Github size={16} /> Repository
              </a>
            )}
          </Gsap.div>
        </section>

        {/* ── Main Cover Image ──────────────────────── */}
        {project.heroImg && (
          <section className="px-6 md:px-10 pb-16">
            <Gsap.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto border border-black/5 p-2 bg-white rounded-lg shadow-sm"
            >
              <div className="w-full bg-neutral-100/50 rounded-[4px] overflow-hidden aspect-video relative flex items-center justify-center border border-black/5">
                <img
                  src={cloudinarySrc(project.heroImg, 1200)}
                  srcSet={[
                    cloudinarySrc(project.heroImg, 600) + " 600w",
                    cloudinarySrc(project.heroImg, 900) + " 900w",
                    cloudinarySrc(project.heroImg, 1200) + " 1200w",
                  ].join(", ")}
                  sizes="(max-width: 768px) 100vw, 1152px"
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
            </Gsap.div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-6 md:px-10 pb-24">
          {/* Custom Section Block */}
          {preFeatureSection}

          {/* Main Grid: Features and Impact side-by-side on desktop */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mt-16 border-t border-black/10 pt-16">
            {/* ── Left Column: Features ──── */}
            <div className="space-y-16">
              {project.features && project.features.length > 0 && (
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/40 mb-6 flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-black/20" /> Key Features
                  </h2>
                  <ul className="space-y-4 text-base leading-relaxed text-black/80">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="mt-1.5 shrink-0 block w-1.5 h-1.5 bg-lime-500 rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── Right Column: Impact ──── */}
            <div className="space-y-16">
              {project.impact && project.impact.length > 0 && (
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/40 mb-6 flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-black/20" /> Outcome & Impact
                  </h2>
                  <ul className="space-y-4 text-base leading-relaxed text-black/80">
                    {project.impact.map((impact, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="mt-1.5 shrink-0 block w-1.5 h-1.5 bg-lime-500 rounded-full" />
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack below both */}
          <div className="mt-12 lg:mt-16 border-t border-black/10 pt-12 lg:pt-16">
            {project.stack && project.stack.length > 0 && (
              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/40 mb-6 flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-black/20" /> Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((stack) => (
                    <TechBadge key={stack}>{stack}</TechBadge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
