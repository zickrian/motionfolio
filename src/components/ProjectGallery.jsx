import { useEffect, useRef, useState } from "react";
import { Gsap } from "../utils/gsapAnimate";
import { ArrowUpRight } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECT_META } from "../data/projectMeta";

const INDICATOR_CARD_WIDTH = 600;
const INDICATOR_GAP = 48;
const INDICATOR_INTRO_WIDTH = 500;

// Hanya register sekali untuk menghindari konflik
if (typeof window !== "undefined" && !ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper: inject Cloudinary automatic format & quality + width
function cloudinarySrc(originalUrl, width) {
  try {
    if (!originalUrl || typeof originalUrl !== "string") return originalUrl;
    if (!originalUrl.includes("/upload/")) return originalUrl;
    return originalUrl.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  } catch (e) {
    return originalUrl;
  }
}

export default function ProjectGallery({ onOpenProject }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const activeProjectIndexRef = useRef(0);

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [enablePinnedScroll, setEnablePinnedScroll] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // GSAP pinned scroll only on desktop; mobile uses native horizontal scroll
    // to prevent vibration/shaking from touch events fighting GSAP transforms
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMode = () => {
      const isMobile = window.innerWidth < 1024;
      setEnablePinnedScroll(!reducedMotionMedia.matches && !isMobile);
    };

    updateMode();

    if (reducedMotionMedia.addEventListener)
      reducedMotionMedia.addEventListener("change", updateMode);
    else reducedMotionMedia.addListener(updateMode);

    // Also listen for resize to switch between mobile/desktop mode
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMode, 200);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (reducedMotionMedia.removeEventListener)
        reducedMotionMedia.removeEventListener("change", updateMode);
      else reducedMotionMedia.removeListener(updateMode);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Preload gambar pertama untuk smooth loading
  useEffect(() => {
    const firstImage = new Image();
    firstImage.src = cloudinarySrc(PROJECT_META[0]?.img, 800);
  }, []);

  const projects = PROJECT_META;
  const projectCount = projects.length;

  useEffect(() => {
    if (!enablePinnedScroll) {
      setMaxScroll(0);
      return;
    }

    const calc = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const sectionW = section.getBoundingClientRect().width;
      const total = track.scrollWidth - sectionW;
      const nextMaxScroll = Math.max(0, total);
      setMaxScroll((prevMaxScroll) =>
        prevMaxScroll === nextMaxScroll ? prevMaxScroll : nextMaxScroll,
      );
    };

    calc();
    const t1 = setTimeout(calc, 250);
    const t2 = setTimeout(calc, 900);

    // Debounce resize untuk performa lebih baik
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        calc();
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Mobile: visualViewport fires when browser toolbar shows/hides (changes innerHeight)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    let ro;
    if (typeof ResizeObserver !== "undefined" && trackRef.current) {
      // Debounce ResizeObserver callback untuk menghindari loop error
      let roTimeout;
      ro = new ResizeObserver(() => {
        clearTimeout(roTimeout);
        roTimeout = setTimeout(() => {
          calc();
          ScrollTrigger.refresh();
        }, 100);
      });
      ro.observe(trackRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      if (ro) ro.disconnect();
    };
  }, [enablePinnedScroll]);

  useEffect(() => {
    if (enablePinnedScroll) return;

    const container = mobileScrollRef.current;
    if (!container) return;

    const updateActiveByScroll = () => {
      const cards = container.querySelectorAll("[data-project-index]");
      if (!cards.length) return;

      const viewportCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const idx = Number(card.getAttribute("data-project-index") || 0);
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });

      if (closestIndex !== activeProjectIndexRef.current) {
        activeProjectIndexRef.current = closestIndex;
        setActiveProjectIndex(closestIndex);
      }
    };

    updateActiveByScroll();
    container.addEventListener("scroll", updateActiveByScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", updateActiveByScroll);
    };
  }, [enablePinnedScroll]);

  useEffect(() => {
    if (!enablePinnedScroll) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.set(track, { x: 0 });
    activeProjectIndexRef.current = 0;
    setActiveProjectIndex(0);

    if (maxScroll <= 0) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = window.lenisInstance;

    let usingLenis = false;
    if (lenis && typeof lenis.scrollTo === "function") {
      usingLenis = true;

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length) lenis.scrollTo(value, { immediate: true });
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
      });

      ScrollTrigger.defaults({ scroller: document.documentElement });
    } else {
      ScrollTrigger.defaults({ scroller: window });
    }

    const ctx = gsap.context(() => {
      const setX = gsap.quickSetter(track, "x", "px");

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${maxScroll}`,
        pin: true,
        scrub: true,
        anticipatePin: 0.5,
        fastScrollEnd: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const current = self.progress * maxScroll;
          setX(-current);

          const nextActiveIndex = Math.max(
            0,
            Math.min(
              projectCount - 1,
              Math.floor(
                Math.max(0, current - INDICATOR_INTRO_WIDTH + 100) /
                  (INDICATOR_CARD_WIDTH + INDICATOR_GAP),
              ),
            ),
          );

          if (nextActiveIndex !== activeProjectIndexRef.current) {
            activeProjectIndexRef.current = nextActiveIndex;
            setActiveProjectIndex(nextActiveIndex);
          }
        },
      });

      const refreshSoon = () => ScrollTrigger.refresh();
      window.addEventListener("load", refreshSoon);

      return () => {
        window.removeEventListener("load", refreshSoon);
        st.kill();
      };
    }, section);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      if (usingLenis) {
        ScrollTrigger.scrollerProxy(document.documentElement, null);
        ScrollTrigger.defaults({ scroller: window });
      }
    };
  }, [enablePinnedScroll, maxScroll, projectCount]);

  /* ═══════════════════════════════════════════
     Desktop: GSAP horizontal pinned scroll
     Mobile:  Vertical stacked cards
     ═══════════════════════════════════════════ */

  // ── MOBILE LAYOUT ──
  if (!enablePinnedScroll) {
    return (
      <section ref={sectionRef} className="relative bg-neutral-900 overflow-hidden py-16 pb-20">
        {/* Section Header */}
        <div className="px-6 mb-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-2 bg-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              02. Past_Explorations
            </span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <h2 className="text-5xl font-black text-white uppercase leading-[0.92] tracking-tight">
            Past
            <br />
            <span className="text-lime-400">Explorations</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-sm leading-6 max-w-sm">
            Transforming ideas into real-world applications.
          </p>
        </div>

        {/* Project Counter */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <span className="font-mono text-xs text-white/30 uppercase tracking-[0.16em]">
            {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
            {String(projectCount).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === activeProjectIndex ? "w-6 bg-lime-400" : "w-1.5 bg-white/20"}`}
              />
            ))}
          </div>
        </div>

        {/* Horizontally scrollable card strip */}
        <div
          ref={mobileScrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 scrollbar-hide [-webkit-overflow-scrolling:touch] [touch-action:pan-x] pb-4"
        >
          {projects.map((project, index) => (
            <Gsap.div
              key={project.id}
              id={`project-${project.id}`}
              onClick={() => onOpenProject?.(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpenProject?.(project);
              }}
              className="project-card group relative w-[80vw] shrink-0 snap-center overflow-hidden rounded-lg border border-white/10 bg-neutral-950 cursor-pointer active:scale-[0.98] transition-transform"
              data-project-index={index}
              style={{ WebkitTapHighlightColor: "transparent", aspectRatio: "3/4" }}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <picture>
                  <source
                    srcSet={[
                      cloudinarySrc(project.img, 400) + " 400w",
                      cloudinarySrc(project.img, 800) + " 800w",
                    ].join(", ")}
                    sizes="80vw"
                  />
                  <img
                    draggable="false"
                    src={cloudinarySrc(project.img, 800)}
                    alt={project.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover opacity-70 grayscale-[30%]"
                    style={{ imageRendering: "auto" }}
                  />
                </picture>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Number badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="font-mono text-3xl font-light text-white/15 tracking-wider">
                  0{project.id}
                </span>
              </div>

              {/* Category + Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.8)]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-white/70">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase text-white tracking-tight leading-[1.05]">
                  {project.title}
                </h3>

                {/* CTA arrow */}
                <div className="mt-3 flex items-center gap-2 text-lime-400">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold">
                    View Project
                  </span>
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                </div>
              </div>
            </Gsap.div>
          ))}
          <div className="shrink-0 w-2" />
        </div>
      </section>
    );
  }

  // ── DESKTOP LAYOUT (GSAP horizontal pinned scroll) ──
  return (
    <section ref={sectionRef} className="relative bg-neutral-900 overflow-hidden h-[100dvh]">
      {/* Section Header */}
      <Gsap.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-16 left-24 right-24 flex items-center gap-4 z-20 pointer-events-none"
      >
        <div className="w-2 h-2 bg-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
        <span className="font-mono text-xs font-bold uppercase tracking-[0.26em] text-white/40">
          02. Past_Explorations
        </span>
        <div className="flex-1 h-[1px] bg-white/5" />
      </Gsap.div>

      {/* Horizontal scroll track */}
      <div className="flex w-full h-[100dvh] items-center overflow-hidden">
        <Gsap.div ref={trackRef} className="flex gap-12 px-24">
          {/* Intro Card */}
          <Gsap.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center shrink-0 h-[70vh] w-[40vw]"
          >
            <h2 className="text-6xl lg:text-8xl font-black text-white uppercase leading-[0.92]">
              Past
              <br />
              <span className="text-lime-400">Explorations</span>
            </h2>
            <p className="mt-8 text-neutral-300 max-w-md text-lg leading-7">
              Transforming ideas into real-world applications.
            </p>
            <ArrowUpRight className="text-lime-400 w-24 h-24 mt-8" />
          </Gsap.div>

          {/* Project Cards */}
          {projects.map((project, index) => (
            <Gsap.div
              key={project.id}
              id={`project-${project.id}`}
              onClick={() => onOpenProject?.(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpenProject?.(project);
              }}
              className="project-card group relative h-[70vh] w-[45vw] shrink-0 overflow-hidden rounded-[4px] border border-white/10 bg-neutral-900 transition-all duration-500 hover:border-lime-400/50 hover:shadow-[0_0_40px_rgba(163,230,53,0.1)] active:scale-[0.98] cursor-pointer"
              data-project-index={index}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="absolute inset-0 overflow-hidden bg-neutral-950">
                <picture>
                  <source
                    srcSet={[
                      cloudinarySrc(project.img, 400) + " 400w",
                      cloudinarySrc(project.img, 800) + " 800w",
                      cloudinarySrc(project.img, 1200) + " 1200w",
                    ].join(", ")}
                    sizes="45vw"
                  />
                  <img
                    draggable="false"
                    src={cloudinarySrc(project.img, 800)}
                    srcSet={[
                      cloudinarySrc(project.img, 400) + " 400w",
                      cloudinarySrc(project.img, 800) + " 800w",
                      cloudinarySrc(project.img, 1200) + " 1200w",
                    ].join(", ")}
                    sizes="45vw"
                    alt={project.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0 will-change-transform"
                    style={{ imageRendering: "auto" }}
                  />
                </picture>
              </div>

              {/* Premium dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500" />

              {/* Info panel */}
              <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
                <div className="flex justify-between items-end gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                      <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/80">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-[1.1]">
                      {project.title}
                    </h3>
                  </div>

                  {/* Floating Action Button */}
                  <div className="w-14 h-14 bg-white/10 border border-white/20 text-white flex items-center justify-center rounded-full shrink-0 group-hover:bg-lime-400 group-hover:text-black group-hover:border-lime-400 transition-all duration-300 shadow-lg">
                    <ArrowUpRight
                      size={24}
                      strokeWidth={2}
                      className="group-hover:rotate-45 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Number ID */}
              <Gsap.div
                className="absolute top-0 right-0 p-8"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-start">
                  <span className="font-mono text-sm text-lime-400 font-bold mr-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    NO.
                  </span>
                  <span className="font-mono text-5xl font-light text-white/20 tracking-[0.18em] group-hover:text-white/40 transition-colors duration-500">
                    0{project.id}
                  </span>
                </div>
              </Gsap.div>
            </Gsap.div>
          ))}

          <div className="shrink-0 w-[10vw]"></div>
        </Gsap.div>
      </div>

      {/* Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {projects.map((_, index) => {
          const isActive = index === activeProjectIndex;
          return (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-lime-400" : "w-2 bg-white/30"}`}
            />
          );
        })}
      </div>
    </section>
  );
}
