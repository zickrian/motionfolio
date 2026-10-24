import { useEffect, useState } from "react";
import { Gsap } from "../utils/gsapAnimate";

const words = ["INITIALIZING", "LOADING ASSETS", "COMPILING", "READY"];

const Preloader = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Progress counter animation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Random increment for "real" feel
        const diff = Math.random() * 8;
        return Math.min(prev + diff, 100);
      });
    }, 120); // Speed of counter

    // Tick for ASCII glitch/animation
    const tickTimer = setInterval(() => setTick((t) => t + 1), 60);

    return () => {
      clearInterval(timer);
      clearInterval(tickTimer);
    };
  }, []);

  useEffect(() => {
    // Text cycle animation
    if (index === words.length - 1) return;

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 550); // Speed of text change

    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    // Complete trigger
    if (progress === 100) {
      // Delay slightly to show "100%"
      const timeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 800);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black text-lime-400 flex flex-col justify-between p-4 md:p-10 font-mono overflow-hidden transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? "-translate-y-full" : "translate-y-0"}`}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-start uppercase text-xs md:text-sm tracking-widest opacity-50">
        <span>Zickrian Portfolio</span>
        <span>©2026</span>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center gap-6 w-full">
        <Gsap.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl md:text-3xl font-bold tracking-widest uppercase text-lime-400"
        >
          &gt; {words[index]}_
        </Gsap.p>

        {/* ASCII Art Container */}
        <div className="text-lime-400 font-mono text-[10px] sm:text-xs md:text-sm leading-[1.1] md:leading-none whitespace-pre text-center md:text-left select-none overflow-hidden drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">
          {(() => {
            const width = typeof window !== "undefined" && window.innerWidth < 768 ? 20 : 40;
            const filled = Math.floor((progress / 100) * width);
            let ascii = "";
            const fillChars = ["░", "▒", "▓", "█"];

            ascii += "╔" + "═".repeat(width) + "╗\n";
            for (let r = 0; r < 5; r++) {
              let row = "║";
              for (let c = 0; c < width; c++) {
                if (c < filled) {
                  if (c === filled - 1 && progress < 100) {
                    // Glitchy edge
                    row += fillChars[tick % 4];
                  } else {
                    row += "█";
                  }
                } else {
                  row += tick % 2 === 0 && Math.random() > 0.9 ? "." : " ";
                }
              }
              row += "║\n";
              ascii += row;
            }
            ascii += "╚" + "═".repeat(width) + "╝\n";

            // System logs text below
            ascii += `\n>> SYS.MEM.${progress === 100 ? "READY" : "ALLOCATING"}  [${Math.round(progress).toString().padStart(3, "0")}%]`;
            if (progress === 100) {
              ascii += `  [OK]\n>> BOOT SEQUENCE COMPLETE.`;
            } else {
              ascii += `  [${fillChars[tick % 4]}]\n>> 0x${Math.floor(Math.random() * 0xffffff)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase()} ...`;
            }
            return ascii;
          })()}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end uppercase text-xs md:text-sm tracking-widest opacity-50 w-full">
        <span>System Status: {progress === 100 ? "ONLINE" : "BOOTING"}</span>
      </div>

      {/* Background Grid */}
      <div
        className="absolute inset-0 z-[-1] opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-[10] pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

export default Preloader;
