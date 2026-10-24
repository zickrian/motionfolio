import { useRef } from "react";
import { Gsap } from "../utils/gsapAnimate";

// Simple Icons (brand icons) from react-icons
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiKeras,
  SiScikitlearn,
  SiOpencv,
  SiStreamlit,
  SiNumpy,
  SiPandas,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGreensock,
  SiJavascript,
  SiHtml5,
  SiFastapi,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiSupabase,
  SiDocker,
  SiGit,
  SiLinux,
} from "react-icons/si";

// Lucide icons for generic concepts
import { Bot, BrainCircuit, Workflow, Globe, Cloud } from "lucide-react";

const stackCategories = [
  {
    title: "AI & Machine Learning",
    description: "Intelligent systems & models",
    skills: [
      { name: "Python", icon: SiPython },
      { name: "TensorFlow", icon: SiTensorflow },
      { name: "PyTorch", icon: SiPytorch },
      { name: "Keras", icon: SiKeras },
      { name: "Scikit-Learn", icon: SiScikitlearn },
      { name: "OpenCV", icon: SiOpencv },
      { name: "Streamlit", icon: SiStreamlit },
      { name: "Numpy", icon: SiNumpy },
      { name: "Pandas", icon: SiPandas },
      { name: "RAG", icon: BrainCircuit },
      { name: "LLM", icon: Bot },
    ],
  },
  {
    title: "Frontend Eng.",
    description: "Interactive web interfaces",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "GSAP", icon: SiGreensock },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML/CSS", icon: SiHtml5 },
    ],
  },
  {
    title: "Backend & API",
    description: "Scalable server architectures",
    skills: [
      { name: "FastAPI", icon: SiFastapi },
      { name: "ExpressJS", icon: SiExpress },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL", icon: SiMysql },
      { name: "Supabase", icon: SiSupabase },
      { name: "REST APIs", icon: Globe },
    ],
  },
  {
    title: "DevOps & Cloud",
    description: "Infrastructure & deployment",
    skills: [
      { name: "Docker", icon: SiDocker },
      { name: "Microsoft Azure", icon: Cloud },
      { name: "MLOps", icon: Workflow },
      { name: "Git", icon: SiGit },
      { name: "Linux", icon: SiLinux },
    ],
  },
];

const TechStack = () => {
  const containerRef = useRef(null);

  return (
    <section
      id="tech-stack-section"
      ref={containerRef}
      className="pt-20 md:pt-24 pb-24 md:pb-32 w-full relative bg-[#0A0A0A] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* ── SECTION HEADER ── */}
        <Gsap.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-20 md:mb-32"
        >
          <div className="w-2 h-2 bg-lime-400 rounded-full" />
          <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-white/40">
            04. Technical_Arsenal
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </Gsap.div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 lg:gap-24 items-start">
          {/* Left side: Sticky Title area */}
          <div className="lg:sticky lg:top-36 flex flex-col pt-4">
            <Gsap.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.98] sm:leading-[0.95] text-white"
            >
              Core <br />
              <span className="text-lime-400">Stack.</span>
            </Gsap.h2>

            <Gsap.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-6 md:mt-8 font-sans text-sm md:text-base text-white/55 leading-7 md:leading-8 max-w-sm"
            >
              <p>
                An ecosystem of tools and architectures mastered for building scalable, intelligent,
                and high-performance digital solutions. Full engineering proficiency.
              </p>
            </Gsap.div>
          </div>

          {/* Right side: Table List */}
          <div className="flex flex-col border-t border-white/10">
            {stackCategories.map((category, index) => (
              <Gsap.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group border-b border-white/10 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 transition-colors hover:bg-white/[0.02] -mx-4 px-4 sm:px-4 cursor-default"
              >
                <div className="md:w-1/3 shrink-0 flex flex-col gap-2">
                  <h4 className="text-xl md:text-2xl font-bold uppercase text-white tracking-tight group-hover:text-lime-400 transition-colors">
                    {category.title}
                  </h4>
                  <span className="font-mono text-xs text-white/40 uppercase tracking-[0.12em] md:tracking-[0.16em] hidden md:block">
                    {"// "}
                    {category.description}
                  </span>
                </div>

                <div className="md:w-2/3 flex flex-wrap gap-4 lg:gap-5 items-center">
                  {category.skills.map((skill, idx) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={idx}
                        className="relative group/icon w-11 h-11 md:w-12 md:h-12 flex items-center justify-center border border-white/10 rounded-lg hover:border-lime-400/50 hover:bg-lime-400/10 transition-all duration-300 cursor-default"
                        title={skill.name}
                      >
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white/80 group-hover/icon:text-lime-400 transition-colors" />
                        {/* Tooltip */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Gsap.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
