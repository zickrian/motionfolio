import { memo, useRef, useState, useEffect } from "react";
import { Gsap, useGsapReducedMotion, useGsapScroll, useGsapTransform } from "../utils/gsapAnimate";
import { Terminal, Code2, Database, Cpu, Download, ArrowUpRight } from "lucide-react";

// Shared Intl formatter — created once, reused on every tick
const jakartaFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

// === LOCATION & TIME BADGE ===
// Uses direct DOM update via ref to avoid React re-renders every second
const LocationTimeBadge = () => {
  const timeRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (timeRef.current) {
        timeRef.current.textContent = jakartaFormatter.format(new Date());
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 font-mono text-xs uppercase tracking-[0.15em] text-black/50">
      <div className="flex items-center gap-2">
        <span className="font-bold text-black/70">Based in Indonesia</span>
      </div>
      <div className="w-[1px] h-3 bg-black/15" />
      <div className="flex items-center gap-1.5 tabular-nums">
        <span className="text-black/40 hidden sm:inline">LOCAL:</span>
        <span ref={timeRef} className="font-bold text-black/70" />
      </div>
    </div>
  );
};

// === DECORATIVE ORBITING ELEMENTS (Left & Right) ===
const OrbitingDecoration = ({ icon: Icon, delay, className, isRevealed, enableAmbientMotion }) => (
  <Gsap.div
    initial={false}
    animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.9 }}
    transition={{
      opacity: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
      y: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
      scale: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
    }}
    className={`absolute flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-lime-500/20 bg-white/60 backdrop-blur-lg shadow-[0_10px_30px_rgba(132,204,22,0.12)] ${className}`}
    style={
      enableAmbientMotion && isRevealed
        ? {
            animation: `hero-float 5.8s ${delay + 0.35}s ease-in-out infinite`,
            willChange: "transform",
          }
        : undefined
    }
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lime-300/25 to-transparent" />
    <Icon size={18} className="relative text-black/65" />
  </Gsap.div>
);

// === MAIN COMPONENT ===
const HeroSection = memo(function HeroSection({ isRevealed = true }) {
  const containerRef = useRef(null);
  const reduceMotion = useGsapReducedMotion();
  const [enableParallax, setEnableParallax] = useState(false);
  const [enableAmbientMotion, setEnableAmbientMotion] = useState(false);

  const { scrollYProgress } = useGsapScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Subtle scroll parallax
  const bgY = useGsapTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useGsapTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion) {
      setEnableParallax(false);
      setEnableAmbientMotion(false);
      return;
    }

    const parallaxMedia = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const updateParallax = () => {
      setEnableParallax(parallaxMedia.matches);
      setEnableAmbientMotion(parallaxMedia.matches);
    };

    updateParallax();

    if (parallaxMedia.addEventListener) {
      parallaxMedia.addEventListener("change", updateParallax);
    } else {
      parallaxMedia.addListener(updateParallax);
    }

    return () => {
      if (parallaxMedia.removeEventListener) {
        parallaxMedia.removeEventListener("change", updateParallax);
      } else {
        parallaxMedia.removeListener(updateParallax);
      }
    };
  }, [reduceMotion]);

  return (
    <header
      ref={containerRef}
      id="hero-section"
      className="min-h-[100svh] w-full relative bg-[#FAF9F6] selection:bg-lime-300 selection:text-black overflow-hidden flex flex-col items-center justify-center pt-16 pb-16"
    >
      {/* ── BACKGROUND ENGINEERING Grid & Dynamic Glow ── */}
      <Gsap.div
        initial={false}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={enableParallax ? { y: bgY } : undefined}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(163,230,53,0.12),transparent_48%),linear-gradient(to_bottom,rgba(163,230,53,0.04),transparent_48%)]" />

        {/* 1. Base Moving Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            ...(enableAmbientMotion && isRevealed
              ? { animation: "hero-grid-scroll 14s linear infinite" }
              : {}),
          }}
        />

        {/* 2. Plus/Cross Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M40 38v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' fill='%23000000' fill-opacity='1' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: "center center",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 18%, rgba(163, 230, 53, 0.14), transparent 44%), radial-gradient(circle at 82% 15%, rgba(132, 204, 22, 0.1), transparent 42%), radial-gradient(circle at 50% 85%, rgba(190, 242, 100, 0.09), transparent 50%), linear-gradient(135deg, rgba(163, 230, 53, 0.02), rgba(234, 179, 8, 0.01))",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[920px] max-h-[920px] rounded-full border border-lime-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[72vw] max-w-[720px] max-h-[720px] rounded-full border border-lime-500/10" />

        {/* 3. Dynamic Organic Glowing Orbs — CSS animations for zero JS overhead */}
        <div
          className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-lime-300 rounded-full blur-[90px] lg:blur-[130px] opacity-[0.1]"
          style={
            enableAmbientMotion && isRevealed
              ? {
                  animation: "hero-orb-1 10s ease-in-out infinite",
                  willChange: "transform",
                }
              : { transform: "translate3d(-50%, -50%, 0)" }
          }
        />
        <div
          className="absolute top-1/4 right-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-lime-400 rounded-full blur-[90px] lg:blur-[120px] opacity-[0.06]"
          style={
            enableAmbientMotion && isRevealed
              ? {
                  animation: "hero-orb-2 12s 2s ease-in-out infinite",
                  willChange: "transform",
                }
              : undefined
          }
        />
        <div
          className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] bg-lime-200 rounded-full blur-[100px] lg:blur-[130px] opacity-[0.08]"
          style={
            enableAmbientMotion && isRevealed
              ? {
                  animation: "hero-orb-3 15s 1s ease-in-out infinite",
                  willChange: "transform",
                }
              : undefined
          }
        />

        {/* 4. Radial Vignette to blend gracefully with section edges */}
        <div className="absolute inset-0 bg-[#FAF9F6] [mask-image:radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-75" />

        {/* Soft bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none" />
      </Gsap.div>

      {/* ── MAIN CONTENT (PERFECTLY CENTERED) ── */}
      {/* Parallax wrapper (scroll-driven y only) */}
      <Gsap.div
        style={enableParallax ? { y: contentY } : undefined}
        className="relative z-10 w-full max-w-[1200px] px-5 sm:px-6 md:px-12 flex flex-col items-center text-center mt-8"
      >
        {/* Iris reveal + entrance wrapper */}
        <Gsap.div
          initial={false}
          animate={
            isRevealed
              ? { opacity: 1, y: 0, filter: "blur(0px)", clipPath: "circle(150% at 50% 100%)" }
              : { opacity: 0, y: 14, filter: "blur(3px)", clipPath: "circle(0% at 50% 100%)" }
          }
          transition={{
            clipPath: { duration: 1.25, ease: [0.2, 0.95, 0.3, 1] },
            opacity: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 1.0, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 0.8, delay: 0.1 },
          }}
          className="w-full flex flex-col items-center"
        >
          {/* Location & Time — visible at top */}
          <Gsap.div
            initial={false}
            animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mb-3 md:mb-4"
          >
            <LocationTimeBadge />
          </Gsap.div>

          {/* 2. Massive Clear Typography */}
          <div className="flex flex-col items-center justify-center relative w-full mb-4 md:mb-5">
            {/* Left Decoration */}
            <OrbitingDecoration
              icon={Code2}
              delay={0.15}
              className="left-0 sm:left-2 lg:left-16 top-2"
              isRevealed={isRevealed}
              enableAmbientMotion={enableAmbientMotion}
            />
            <OrbitingDecoration
              icon={Terminal}
              delay={0.45}
              className="left-6 sm:left-12 lg:left-28 bottom-8 hidden sm:flex"
              isRevealed={isRevealed}
              enableAmbientMotion={enableAmbientMotion}
            />

            <Gsap.h1
              initial={false}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(4.25rem,14vw,9rem)] font-black uppercase tracking-tight text-black leading-[0.88]"
            >
              FIRDAUS
            </Gsap.h1>

            <Gsap.h1
              initial={false}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(4.25rem,14vw,9rem)] font-black uppercase tracking-tight text-transparent leading-[0.88] mt-2 sm:mt-0 font-outline-fallback"
            >
              ZICKRIAN
            </Gsap.h1>

            {/* Right Decoration */}
            <OrbitingDecoration
              icon={Database}
              delay={0.28}
              className="right-0 sm:right-2 lg:right-16 top-10"
              isRevealed={isRevealed}
              enableAmbientMotion={enableAmbientMotion}
            />
            <OrbitingDecoration
              icon={Cpu}
              delay={0.58}
              className="right-6 sm:right-12 lg:right-28 -bottom-2 hidden sm:flex"
              isRevealed={isRevealed}
              enableAmbientMotion={enableAmbientMotion}
            />
          </div>

          {/* 3. Clean Slogan with Green Accent */}
          <Gsap.div
            initial={false}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.38, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2 mt-0"
          >
            <h2 className="text-[clamp(1.35rem,4.2vw,2.25rem)] font-bold text-black/80 tracking-tight flex items-center justify-center flex-wrap gap-2 px-2">
              Architecting{" "}
              <span className="bg-lime-400/30 px-2 rounded-md ring-1 ring-lime-500/20">
                Intelligent
              </span>{" "}
              Paradigms<span className="text-lime-500 font-extrabold -ml-1">.</span>
            </h2>
            <p className="font-sans text-base text-black/60 max-w-xl leading-7 mt-2 px-4">
              AI Engineer & Full-Stack Developer specializing in high-performance, scalable systems.
            </p>
          </Gsap.div>

          {/* 4. CTA Buttons */}
          <Gsap.div
            initial={false}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 mt-5"
          >
            <button
              onClick={() =>
                document.getElementById("project-section")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center gap-2 bg-black text-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-lime-400 hover:text-black transition-all duration-300 cursor-pointer"
            >
              View Projects{" "}
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
            <a
              href="/cv.pdf"
              download
              className="group flex items-center gap-2 bg-transparent text-black border-2 border-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-lime-400 transition-all duration-300"
            >
              Download CV{" "}
              <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </a>
          </Gsap.div>
        </Gsap.div>
      </Gsap.div>
    </header>
  );
});

export default HeroSection;
