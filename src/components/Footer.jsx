import { memo, useEffect, useRef } from "react";
import { Gsap } from "../utils/gsapAnimate";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { exponentialEaseOut } from "../utils/easing";

const DiscordIcon = ({ className = "", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.775-.552 1.124a18.273 18.273 0 0 0-5.333 0C9.85 3.775 9.638 3.328 9.447 3a19.736 19.736 0 0 0-4.433 1.369C2.064 8.803 1.253 13.127 1.659 17.39a19.953 19.953 0 0 0 5.993 3.034c.486-.65.918-1.338 1.288-2.061a12.945 12.945 0 0 1-2.034-.97c.171-.126.338-.257.5-.392 3.922 1.846 8.17 1.846 12.046 0 .163.135.329.266.5.392-.652.389-1.333.715-2.034.97.37.723.802 1.411 1.288 2.061a19.919 19.919 0 0 0 5.994-3.034c.477-4.943-.815-9.228-3.883-13.021zM9.682 14.813c-1.183 0-2.157-1.085-2.157-2.419s.953-2.418 2.157-2.418c1.214 0 2.168 1.096 2.157 2.418 0 1.334-.953 2.419-2.157 2.419zm4.636 0c-1.183 0-2.157-1.085-2.157-2.419s.953-2.418 2.157-2.418c1.214 0 2.168 1.096 2.157 2.418 0 1.334-.943 2.419-2.157 2.419z" />
  </svg>
);

const Footer = memo(function Footer() {
  const timeRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (window.lenisInstance && typeof window.lenisInstance.scrollTo === "function") {
      window.lenisInstance.scrollTo(target, {
        offset: -24,
        duration: 1.5,
        easing: exponentialEaseOut,
      });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Direct DOM update for the clock — avoids React re-render every second
  useEffect(() => {
    const updateTime = () => {
      if (!timeRef.current) return;
      const now = new Date();
      timeRef.current.textContent = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      id="contact-section"
      className="bg-[#0A0A0A] text-white pt-20 md:pt-24 pb-12 w-full relative overflow-hidden"
    >
      {/* Subtle Matrix BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 relative z-10 flex flex-col justify-between min-h-[50vh]">
        {/* ── SECTION HEADER ── */}
        <Gsap.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16 md:mb-24"
        >
          <div className="w-2 h-2 bg-lime-400 rounded-[2px] animate-pulse" />
          <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-white/40">
            {"// INITIALIZE_CONTACT"}
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </Gsap.div>

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 md:gap-16 lg:gap-8 mb-20 md:mb-24">
          {/* Left: Huge Name & Status */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.95] sm:leading-[0.9] text-white mb-6">
                LET'S <br />
                <span className="text-lime-400 transform inline-block italic pr-4">CONNECT.</span>
              </h2>
              <p className="font-sans text-sm md:text-base text-white/60 max-w-md leading-7 md:leading-8">
                Feel free to reach out for collaborations, system architecture discussions, or just
                to say hello. Always open to exploring new opportunities.
              </p>
            </div>
          </div>

          {/* Right: Connect & Navigation */}
          <div className="lg:w-1/2 flex flex-col sm:flex-row gap-12 sm:gap-16 lg:justify-end">
            {/* Navigation */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.18em] md:tracking-[0.24em] mb-4 border-l-2 border-white/20 pl-3">
                Sitemap
              </span>

              {[
                { label: "About", id: "about-section" },
                { label: "Projects", id: "project-section" },
                { label: "Experience", id: "experience-section" },
                { label: "Capabilities", id: "capabilities-section" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left font-mono text-xs md:text-sm font-bold uppercase text-white/60 hover:text-lime-400 transition-colors flex items-center gap-3 group py-1"
                >
                  <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-lime-400 transition-colors" />
                  <span className="tracking-[0.14em] md:tracking-[0.2em] relative">
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-lime-400 group-hover:w-full transition-all duration-300" />
                  </span>
                </button>
              ))}
            </div>

            {/* Connect Links */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.18em] md:tracking-[0.24em] mb-4 border-l-2 border-lime-400 pl-3">
                Networks
              </span>

              {[
                {
                  label: "Email",
                  href: "https://mail.google.com/mail/?view=cm&fs=1&to=firdauskhotibulzickrian@gmail.com",
                  icon: Mail,
                },
                { label: "GitHub", href: "https://github.com/zickrian", icon: Github },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/firdauskhotibulzickrian/",
                  icon: Linkedin,
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border border-white/10 bg-[#111111] hover:bg-lime-400 hover:border-lime-400 transition-colors duration-300 p-3"
                >
                  <div className="flex items-center gap-3">
                    <link.icon
                      size={16}
                      className="text-white/40 group-hover:text-black transition-colors"
                    />
                    <span className="font-mono text-xs md:text-sm font-bold uppercase text-white/80 group-hover:text-black tracking-[0.14em] md:tracking-[0.2em] transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-white/20 group-hover:text-black transition-colors"
                  />
                </a>
              ))}

              {/* Discord Profile Link */}
              <a
                href="https://discord.com/users/zickrian"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border border-white/10 bg-[#111111] hover:bg-lime-400 hover:border-lime-400 transition-colors duration-300 p-3 mt-1"
                title="Open Discord profile"
              >
                <div className="flex items-center gap-3">
                  <DiscordIcon
                    className="text-white/40 group-hover:text-black transition-colors"
                    size={16}
                  />
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.14em] md:tracking-[0.2em] leading-none transition-colors text-white/80 group-hover:text-black">
                      Discord
                    </span>
                    <span className="font-mono text-[9px] lowercase leading-none transition-colors text-white/40 group-hover:text-black/60">
                      @zickrian
                    </span>
                  </div>
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-white/20 group-hover:text-black transition-colors"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-4">
          <div className="flex items-center gap-3 font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-[0.14em] md:tracking-[0.2em]">
            <span>SYS.STATUS:</span>
            <div className="flex items-center gap-2 text-lime-400 bg-lime-400/10 px-2 flex-grow-0 min-w-16 justify-center py-0.5 border border-lime-400/20 yg">
              ONLINE
            </div>
          </div>

          <div
            ref={timeRef}
            className="font-mono text-[10px] md:text-xs text-white/30 uppercase tracking-[0.18em] md:tracking-[0.24em] tabular-nums text-center order-first md:order-none opacity-50"
          >
            00:00:00 LOCAL
          </div>

          <div className="font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-[0.14em] md:tracking-[0.2em] text-center md:text-right">
            &copy; {new Date().getFullYear()} ZICKRIAN. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
