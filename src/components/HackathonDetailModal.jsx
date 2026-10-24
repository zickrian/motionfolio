import { useEffect, useState, useCallback, useRef } from "react";
import { Gsap, GsapPresence } from "../utils/gsapAnimate";
import { createPortal } from "react-dom";
import {
  X,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Github,
  Globe,
  Users,
  Zap,
  Shield,
  Gamepad2,
  Coins,
  Layers,
} from "lucide-react";

/* ─── Image data (compressed WebP) ───────── */
const galleryImages = [
  {
    src: "/hackathon-base/base-realms-3.webp",
    alt: "Base Realms - Onchain Battle Game on Base App",
  },
  { src: "/hackathon-base/base-realms-2.webp", alt: "QRIS Adoption - Normies Friendly Onboarding" },
  { src: "/hackathon-base/base-realms-5.webp", alt: "Just 5 Steps to Play" },
  { src: "/hackathon-base/base-realms-6.webp", alt: "Trade Collectibles & Mint NFTs" },
  { src: "/hackathon-base/base-realms-4.webp", alt: "System Architecture & Flow" },
  { src: "/hackathon-base/base-realms-1.webp", alt: "Team Information & Project Roadmap" },
];

const techStack = ["Solidity", "Next.js", "TypeScript", "JavaScript", "CSS"];

const highlights = [
  { icon: Gamepad2, label: "16-bit RPG Gameplay", desc: "Platformer-inspired onchain battle game" },
  {
    icon: Coins,
    label: "QRIS Payment",
    desc: "Scan & pay with Indonesian QRIS - crypto for everyone",
  },
  {
    icon: Shield,
    label: "Fair Randomness",
    desc: "Commit-reveal mechanics for verifiable outcomes",
  },
  {
    icon: Layers,
    label: "ERC-721 + ERC-1155",
    desc: "Unique characters & mintable/burnable items",
  },
  { icon: Users, label: "Social Onboarding", desc: "Share progress on Farcaster & Base App" },
  { icon: Zap, label: "Multi-Currency", desc: "Battle with ETH, USDC, or IDRX" },
];

const links = {
  devfolio: "https://devfolio.co/projects/base-realms-b63a",
  github: "https://github.com/zickrian/Base-Realms",
  live: "https://baserealms.app/",
  docs: "https://docs.google.com/document/d/1smjwXkiQOyB1mvwBO683Me2Dcbd6aGKBdlfJGjURSjU/edit?usp=sharing",
};

/* ─── Subcomponents ─────────────────────────────────────── */
const TechBadge = ({ children }) => (
  <span className="px-3 py-1.5 bg-black/5 font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-black/80">
    {children}
  </span>
);

/* ─── Image Carousel ────────────────────────────────────── */
function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef(null);
  const len = galleryImages.length;

  const go = useCallback(
    (dir) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + len) % len);
    },
    [len],
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const img = galleryImages[current];

  return (
    <div className="relative w-full">
      {/* Main image container */}
      <div
        className="relative bg-neutral-100 overflow-hidden aspect-video border border-black/10 rounded-[2px]"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (!touchStart.current) return;
          const diff = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(diff) > 50) go(diff < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <GsapPresence initial={false} custom={direction} mode="wait">
          <Gsap.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </Gsap.div>
        </GsapPresence>

        {/* Nav arrows - Minimal styling */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:bg-white text-black/60 hover:text-black transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:bg-white text-black/60 hover:text-black transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-mono text-[10px] tracking-[0.12em] md:tracking-[0.16em] backdrop-saturate-150">
          {String(current + 1).padStart(2, "0")} / {String(len).padStart(2, "0")}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`
                            shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-[2px] overflow-hidden transition-all duration-300 relative
                            ${i === current ? "opacity-100 ring-2 ring-black ring-offset-2" : "opacity-40 hover:opacity-100"}
                        `}
          >
            <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Modal ────────────────────────────────────────── */
export default function HackathonDetailModal({ isOpen, onClose }) {
  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return createPortal(
    <GsapPresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 lg:p-10">
          {/* Backdrop */}
          <Gsap.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <Gsap.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="relative z-10 w-full h-full md:h-auto md:max-h-[90vh] max-w-6xl bg-[#FAF9F6] shadow-2xl md:rounded-lg overflow-y-auto overscroll-contain flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Sticky header ─────────────────────── */}
            <div className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-black/5">
              <div className="px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] md:tracking-[0.16em] text-[#000] flex items-center gap-2">
                    <Trophy size={14} className="text-lime-500" />
                    National Finalist
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Content body ──────────────────────── */}
            <div className="px-6 md:px-10 pt-8 pb-20 space-y-16">
              {/* Title block */}
              <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-black/40 mb-4">
                  Base Indonesia Hackathon 2025
                </p>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-black mb-6">
                  BASE{" "}
                  <span className="text-transparent" style={{ WebkitTextStroke: "2px black" }}>
                    REALMS
                  </span>
                </h1>

                <p className="text-base md:text-lg leading-7 md:leading-8 text-black/60 max-w-2xl mx-auto">
                  An onchain 16-bit RPG battle game built on Base, where players mint characters,
                  battle for seasonal rewards, and onboard into crypto through QRIS - no DeFi
                  knowledge required.
                </p>

                {/* Action links */}
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <a
                    href={links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-lime-400 text-black px-8 py-3.5 font-bold uppercase text-xs tracking-wider hover:bg-black hover:text-white transition-all duration-300 rounded-[2px] flex items-center gap-2"
                  >
                    <Globe size={16} /> Play Live
                  </a>
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black/5 text-black px-8 py-3.5 font-bold uppercase text-xs tracking-wider border border-transparent hover:border-black/20 transition-all duration-300 rounded-[2px] flex items-center gap-2"
                  >
                    <Github size={16} /> Repository
                  </a>
                </div>
              </div>

              {/* Image gallery */}
              <div className="max-w-5xl mx-auto border border-black/5 p-2 bg-white rounded-lg shadow-sm">
                <ImageCarousel />
              </div>

              {/* Content grid */}
              <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Problem & Solution */}
                <div className="space-y-12">
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/40 mb-6 flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-black/20" /> The Problem
                    </h2>
                    <p className="text-base leading-relaxed text-black/80">
                      Most onchain applications push users toward speculative behavior -
                      participation is tightly coupled with price movements, token volatility, and
                      trading risk. NFT-based games amplify this with opaque reward mechanics where
                      minting, randomness, and payouts are blended into a single flow.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/40 mb-6 flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-black/20" /> How We Solve It
                    </h2>
                    <ul className="space-y-4">
                      {[
                        "Clear asset ownership with ERC-721 characters & ERC-1155 items.",
                        "Minting for ownership, not gambling - fees go to liquidity, not RNG payouts.",
                        "Battles as the economic engine - value from skill, not speculation.",
                        "QRIS onboarding for non-crypto users - scan, play, and learn crypto naturally.",
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="mt-1.5 shrink-0 block w-1.5 h-1.5 bg-lime-500 rounded-full" />
                          <span className="text-sm leading-relaxed text-black/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-[0.12em] md:tracking-[0.16em] text-black/40 mb-6 flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-black/20" /> Key Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-y-8 gap-x-6">
                    {highlights.map((h, i) => {
                      const Icon = h.icon;
                      return (
                        <div key={i} className="group flex flex-col">
                          <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-lime-400 group-hover:text-black transition-colors duration-300">
                            <Icon
                              size={18}
                              strokeWidth={2}
                              className="text-black/60 group-hover:text-black transition-colors"
                            />
                          </div>
                          <span className="font-bold text-sm mb-1">{h.label}</span>
                          <p className="text-xs text-black/60 leading-relaxed">{h.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer links */}
              <div className="max-w-5xl mx-auto border-t border-black/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-black/40 tracking-[0.12em] md:tracking-[0.16em]">
                    TEAM:
                  </span>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[10px] font-mono text-white ring-2 ring-[#FAF9F6]">
                      FZ
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-[10px] font-mono text-white ring-2 ring-[#FAF9F6]">
                      GA
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {techStack.map((t) => (
                    <TechBadge key={t}>{t}</TechBadge>
                  ))}
                </div>
              </div>
            </div>
          </Gsap.div>
        </div>
      )}
    </GsapPresence>,
    document.body,
  );
}
