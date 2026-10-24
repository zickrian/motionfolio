import { memo } from "react";

const skills = [
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "Natural Language Processing (NLP)",
  "Machine Learning Operations (MLOps)",
  "Data Analysis",
  "Web Development",
];

const MarqueeBanner = memo(function MarqueeBanner() {
  return (
    <div className="relative z-20 sm:-rotate-[0.8deg] sm:scale-[1.02] cursor-default select-none">
      <div className="bg-black shadow-[0_0_40px_rgba(163,230,53,0.08)]">
        {/* ── Row 1: Solid Lime Text, scrolling left ── */}
        <div className="py-4 md:py-6 overflow-hidden relative group border-b border-neutral-800/60">
          <div
            className="flex whitespace-nowrap gap-6 md:gap-14 will-change-transform group-hover:[animation-play-state:paused]"
            style={{ animation: "marquee-scroll-left 28s linear infinite" }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-6 md:gap-14 text-lg sm:text-2xl md:text-4xl font-black uppercase items-center"
              >
                {skills.map((skill, j) => (
                  <span key={j} className="flex items-center gap-6 md:gap-14">
                    <span className="text-lime-400 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.6)]">
                      {skill}
                    </span>
                    <span className="text-lime-400/30 text-xs">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>

        {/* ── Row 2: Green background, scrolling right ── */}
        <div className="py-2.5 md:py-4 bg-lime-400 overflow-hidden relative group">
          <div
            className="flex whitespace-nowrap gap-6 md:gap-12 will-change-transform group-hover:[animation-play-state:paused]"
            style={{ animation: "marquee-scroll-right 32s linear infinite" }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-6 md:gap-12 text-base sm:text-lg md:text-2xl font-black uppercase items-center"
              >
                {skills.map((skill, j) => (
                  <span key={j} className="flex items-center gap-6 md:gap-12">
                    <span className="text-black hover:text-white transition-colors duration-300">
                      {skill}
                    </span>
                    <span className="text-black/25 text-xs">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-lime-400 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-lime-400 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
});

export default MarqueeBanner;
