import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Gsap } from "../utils/gsapAnimate";
import { Calendar, Code, ExternalLink, Users, Terminal } from "lucide-react";

const GITHUB_USERNAME = "zickrian";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const HEATMAP_DAYS = 364;
const COLS = 52;
const ROWS = 7;

// Color palette matching the dark engineering theme
const LEVEL_COLORS = {
  0: "#111111", // dark-gray for empty
  1: "#1a2e05", // darkest lime
  2: "#3f6212",
  3: "#65a30d",
  4: "#a3e635", // bright lime
};

const LOADING_COLOR = "#1a1a1a";

const HeatmapCanvas = memo(function HeatmapCanvas({ data, loading }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const containerWidth = container.clientWidth;
    const dpr = window.devicePixelRatio || 1;

    // Calculate cell size
    const gap = window.innerWidth >= 768 ? 3 : 2;
    const cellSize = Math.floor((containerWidth - (COLS - 1) * gap) / COLS);
    const canvasWidth = COLS * cellSize + (COLS - 1) * gap;
    const canvasHeight = ROWS * cellSize + (ROWS - 1) * gap;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < HEATMAP_DAYS; i++) {
      const col = Math.floor(i / ROWS);
      const row = i % ROWS;

      const x = col * (cellSize + gap);
      const y = row * (cellSize + gap);

      if (loading) {
        ctx.fillStyle = LOADING_COLOR;
      } else {
        const day = data[i];
        ctx.fillStyle = day ? LEVEL_COLORS[day.level] || LEVEL_COLORS[0] : LEVEL_COLORS[0];
      }

      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }, [data, loading]);

  useEffect(() => {
    draw();

    let rafId = null;
    const handleResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        draw();
        rafId = null;
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full"
        aria-label={`GitHub contribution heatmap showing ${HEATMAP_DAYS} days of activity`}
      />
    </div>
  );
});

const GitHubStats = memo(function GitHubStats() {
  const [userData, setUserData] = useState(null);
  const [contributionData, setContributionData] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const [userRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { signal: controller.signal }),
          fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
            signal: controller.signal,
          }),
        ]);

        if (isCancelled) return;

        const userJson = await userRes.json();
        if (isCancelled) return;
        setUserData(userJson);

        const contribJson = await contribRes.json();
        if (isCancelled) return;

        if (contribJson.contributions) {
          const allDays = contribJson.contributions;
          const total = allDays.reduce((acc, day) => acc + day.count, 0);
          setContributionData(allDays.slice(-364));
          setTotalContributions(total);
        }

        setLoading(false);
      } catch (error) {
        if (error?.name === "AbortError") return;
        setLoading(false);
      }
    };

    const section = document.getElementById("github-stats-section");
    if (!section) {
      fetchData();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchData();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);

    return () => {
      isCancelled = true;
      observer.disconnect();
      controller.abort();
    };
  }, []);

  return (
    <section
      id="github-stats-section"
      className="pt-20 md:pt-24 pb-24 md:pb-32 w-full relative bg-[#0A0A0A] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* ── SECTION HEADER ── */}
        <Gsap.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16 md:mb-20"
        >
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-white/40">
            05. Source_Metrics
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </Gsap.div>

        {/* Big Title Area */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <Gsap.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.98] sm:leading-[0.9] text-white"
          >
            GitHub <br />
            <span className="text-lime-400">Activity.</span>
          </Gsap.h2>

          <Gsap.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-fit border border-lime-400/30 text-lime-400 px-6 py-3 hover:bg-lime-400 hover:text-black transition-all font-mono text-sm font-bold uppercase tracking-[0.14em] md:tracking-[0.2em] group"
          >
            <Terminal size={16} />
            Launch_Profile
            <ExternalLink
              size={14}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Gsap.a>
        </div>

        {/* Grid Layout Layout for Raw Data */}
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8 w-full">
          {/* Left side: Quick Numbers */}
          <Gsap.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="xl:w-1/3 grid grid-cols-2 gap-px bg-white/10 border border-white/10"
          >
            {/* Box 1: Repositories */}
            <div className="bg-[#0A0A0A] p-6 lg:p-8 flex flex-col justify-between aspect-square group hover:bg-[#111111] transition-colors">
              <div className="flex items-center justify-between text-white/40 group-hover:text-lime-400 transition-colors">
                <Code size={20} />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] md:tracking-[0.16em] font-bold">
                  REPOS
                </span>
              </div>
              <div>
                <p className="text-4xl lg:text-6xl text-white font-black tracking-tighter group-hover:text-lime-400 transition-colors">
                  {loading ? "-" : String(userData?.public_repos ?? 0).padStart(2, "0")}
                </p>
              </div>
            </div>

            {/* Box 2: Commits */}
            <div className="bg-[#0A0A0A] p-6 lg:p-8 flex flex-col justify-between aspect-square group hover:bg-[#111111] transition-colors">
              <div className="flex items-center justify-between text-white/40 group-hover:text-lime-400 transition-colors">
                <Terminal size={20} />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] md:tracking-[0.16em] font-bold">
                  TOTAL
                </span>
              </div>
              <div>
                <p className="text-4xl lg:text-6xl text-white font-black tracking-tighter group-hover:text-lime-400 transition-colors">
                  {loading
                    ? "..."
                    : totalContributions > 999
                      ? `${(totalContributions / 1000).toFixed(1)}k`
                      : totalContributions}
                </p>
              </div>
            </div>

            {/* Box 3: Followers */}
            <div className="bg-[#0A0A0A] p-6 lg:p-8 flex flex-col justify-between aspect-square group hover:bg-[#111111] transition-colors">
              <div className="flex items-center justify-between text-white/40 group-hover:text-lime-400 transition-colors">
                <Users size={20} />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] md:tracking-[0.16em] font-bold">
                  FLWRS
                </span>
              </div>
              <div>
                <p className="text-4xl lg:text-6xl text-white font-black tracking-tighter group-hover:text-lime-400 transition-colors">
                  {loading ? "-" : String(userData?.followers ?? 0).padStart(2, "0")}
                </p>
              </div>
            </div>

            {/* Box 4: Joined */}
            <div className="bg-[#0A0A0A] p-6 lg:p-8 flex flex-col justify-between aspect-square group hover:bg-[#111111] transition-colors">
              <div className="flex items-center justify-between text-white/40 group-hover:text-lime-400 transition-colors">
                <Calendar size={20} />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] md:tracking-[0.16em] font-bold">
                  EST.
                </span>
              </div>
              <div>
                <p className="text-4xl lg:text-6xl text-white font-black tracking-tighter group-hover:text-lime-400 transition-colors">
                  {loading
                    ? "-"
                    : userData?.created_at
                      ? new Date(userData.created_at).getFullYear()
                      : "----"}
                </p>
              </div>
            </div>
          </Gsap.div>

          {/* Right side: Matrix Output Container */}
          <Gsap.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="xl:w-2/3 border border-white/10 bg-[#0F0F0F] p-6 lg:p-10 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold uppercase text-white tracking-tight">
                  System_Log
                </h3>
                <p className="font-sans text-sm md:text-sm text-white/55 mt-2">
                  Annual code contribution density (last 12 months)
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] md:tracking-[0.16em] text-white/40">
                Less
                <span className="w-3 h-3 bg-[#111111] ml-2" />
                <span className="w-3 h-3 bg-[#1a2e05]" />
                <span className="w-3 h-3 bg-[#3f6212]" />
                <span className="w-3 h-3 bg-[#65a30d]" />
                <span className="w-3 h-3 bg-[#a3e635] mr-2" />
                More
              </div>
            </div>

            <div className="w-full flex-1 flex flex-col justify-center">
              <HeatmapCanvas data={contributionData} loading={loading} />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center font-mono text-xs md:text-sm text-white/40">
              <div>
                <span className="text-lime-500 mr-2">$</span>
                user_query --status
              </div>
              <div className="uppercase tracking-[0.12em] md:tracking-[0.16em] text-lime-400/80 animate-pulse">
                ONLINE
              </div>
            </div>
          </Gsap.div>
        </div>
      </div>
    </section>
  );
});

export default GitHubStats;
