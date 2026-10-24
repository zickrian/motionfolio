import { memo, useRef, useState, useEffect } from "react";
import { Gsap, useGsapInView } from "../utils/gsapAnimate";
import {
  Cpu,
  Network,
  Eye,
  MessageSquare,
  Infinity,
  BarChart2,
  MonitorSmartphone,
} from "lucide-react";

const CAPABILITIES = [
  {
    title: "Machine Learning",
    desc: "Predictive modeling, regression, and algorithmic classification built for scale.",
    icon: BarChart2,
  },
  {
    title: "Deep Learning",
    desc: "Neural architectures for complex pattern recognition and high-accuracy deployments.",
    icon: Network,
  },
  {
    title: "Computer Vision",
    desc: "Image processing, real-time object detection, and robust spatial analytics.",
    icon: Eye,
  },
  {
    title: "NLP & GenAI",
    desc: "Large language models, semantic analysis, and human-like conversational AI.",
    icon: MessageSquare,
  },
  {
    title: "MLOps",
    desc: "End-to-end model deployment frameworks, continuous monitoring, and automation.",
    icon: Infinity,
  },
  {
    title: "Data Analysis",
    desc: "Advanced statistical modeling, big data wrangling, and actionable visualizations.",
    icon: Cpu,
  },
  {
    title: "Web Engineering",
    desc: "Scalable full-stack systems with ultra-responsive, accessible interfaces.",
    icon: MonitorSmartphone,
  },
];

const TechnicalCapabilities = memo(function TechnicalCapabilities() {
  const gridRef = useRef(null);
  const isInView = useGsapInView(gridRef, { once: true, amount: 0.15 });
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (isInView) {
      let currentIndex = 0;
      // 700ms sequential cascade lighting up the boxes for a smooth reveal
      const interval = setInterval(() => {
        setActiveIndex(currentIndex);
        currentIndex++;

        // Clear when it reaches past the ghost cell
        if (currentIndex > CAPABILITIES.length) {
          setTimeout(() => setActiveIndex(-1), 700);
          clearInterval(interval);
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section
      id="capabilities-section"
      className="pt-24 pb-32 w-full relative bg-[#FAF9F6] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* ── SECTION HEADER ── */}
        <Gsap.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-4 mb-20 md:mb-24"
        >
          <div className="w-8 h-[2px] bg-black" />
          <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-black">
            06. Capabilities_Matrix
          </span>
          <div className="w-8 h-[2px] bg-black" />
        </Gsap.div>

        {/* Big Title Area - CENTERED */}
        <div className="mb-20 md:mb-28 flex flex-col items-center text-center max-w-4xl mx-auto">
          <Gsap.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-black"
          >
            Technical <br />
            <span className="text-black/20">Capabilities.</span>
          </Gsap.h2>
        </div>

        {/* ARCHITECTURAL MATRIX GRID - SOLID BLACK BORDERS */}
        <Gsap.div
          ref={gridRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l-2 border-t-2 border-black group/grid bg-[#FAF9F6]"
        >
          {CAPABILITIES.map((cap, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={i}
                className={`group/cell relative border-r-2 border-b-2 border-black p-5 md:p-8 lg:p-10 min-h-[180px] md:min-h-[300px] lg:min-h-[340px] flex flex-col justify-between overflow-hidden cursor-crosshair transition-colors duration-500 hover:bg-[#0A0A0A] ${isActive ? "!bg-[#0A0A0A]" : ""}`}
              >
                {/* Number & Icon Row */}
                <div className="flex justify-between items-start relative z-10">
                  <span
                    className={`font-mono text-xs md:text-sm font-bold text-black group-hover/cell:text-lime-400 transition-colors duration-500 tracking-[0.12em] md:tracking-[0.16em] ${isActive ? "!text-lime-400" : ""}`}
                  >
                    0{i + 1}
                  </span>
                  <cap.icon
                    className={`w-5 h-5 md:w-8 md:h-8 text-black group-hover/cell:text-lime-400 transition-colors duration-500 ${isActive ? "!text-lime-400" : ""}`}
                    strokeWidth={2}
                  />
                </div>

                {/* Center massive number watermark — hidden on mobile */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block text-[10rem] md:text-[14rem] font-black tracking-tighter text-transparent [-webkit-text-stroke:2px_black] group-hover/cell:opacity-0 pointer-events-none transition-all duration-500 z-0 ${isActive ? "!opacity-0" : ""}`}
                >
                  {i + 1}
                </div>

                {/* Title & Desc Row */}
                <div className="relative z-10 mt-auto">
                  <h3
                    className={`text-base md:text-2xl lg:text-3xl font-black uppercase text-black tracking-tight leading-[1.1] mb-1 md:mb-2 group-hover/cell:text-lime-400 transition-colors duration-500 ${isActive ? "!text-lime-400" : ""}`}
                  >
                    {cap.title}
                  </h3>

                  {/* Desktop Hover Description */}
                  <div
                    className={`hidden md:block h-0 opacity-0 group-hover/cell:h-[80px] group-hover/cell:opacity-100 group-hover/cell:mt-4 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "!h-[80px] !opacity-100 !mt-4" : ""}`}
                  >
                    <p
                      className={`text-sm border-l-2 border-lime-400 pl-4 text-white/80 font-mono leading-7 transform translate-y-4 group-hover/cell:translate-y-0 transition-transform duration-500 delay-100 ${isActive ? "!translate-y-0" : ""}`}
                    >
                      {cap.desc}
                    </p>
                  </div>

                  {/* Mobile Always Visible Description — smaller text */}
                  <p
                    className={`md:hidden mt-1 text-[11px] border-l-2 border-black group-hover/cell:border-lime-400 pl-3 text-black/70 group-hover/cell:text-white/80 font-mono leading-5 transition-colors duration-500 ${isActive ? "!border-lime-400 !text-white/80" : ""}`}
                  >
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Ghost Cell for layout balance on 4-col XL screens */}
          {(() => {
            const isGhostActive = activeIndex === CAPABILITIES.length;
            return (
              <div
                className={`flex border-r-2 border-b-2 border-black p-5 md:p-8 lg:p-10 min-h-[180px] md:min-h-[300px] lg:min-h-[340px] bg-transparent flex-col justify-center items-center text-center group/ghost hover:bg-[#0A0A0A] transition-colors duration-500 cursor-crosshair ${isGhostActive ? "!bg-[#0A0A0A]" : ""}`}
              >
                <div
                  className={`w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-black group-hover/ghost:border-lime-400 flex items-center justify-center mb-4 md:mb-6 animate-[spin_10s_linear_infinite] group-hover/ghost:animate-[spin_3s_linear_infinite] transition-all duration-500 ${isGhostActive ? "!border-lime-400 !animate-[spin_3s_linear_infinite]" : ""}`}
                >
                  <div
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 bg-black group-hover/ghost:bg-lime-400 rounded-full transition-colors duration-500 ${isGhostActive ? "!bg-lime-400" : ""}`}
                  />
                </div>
                <span
                  className={`font-mono text-xs tracking-[0.14em] md:tracking-[0.2em] uppercase text-black font-bold group-hover/ghost:text-lime-400 transition-colors duration-500 ${isGhostActive ? "!text-lime-400" : ""}`}
                >
                  Continuously
                  <br />
                  Evolving
                </span>
              </div>
            );
          })()}
        </Gsap.div>
      </div>
    </section>
  );
});

export default TechnicalCapabilities;
