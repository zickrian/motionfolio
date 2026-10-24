// ─── Portfolio Data (single source of truth for site content) ────
//
// This is the LIVE data the site renders and the AI assistant reads. It is
// imported by `src/services/aiContext.js` and `src/components/ChatWidget.jsx`.
//
// CUSTOMIZING: edit the values below with your own details. For a clean,
// fully-commented starter template (with guidance on every field), see
// `src/data/examplePortfolioData.js`. See also `docs/customization.md`.
//
// FIELDS TO EDIT:
//   profile.name / role / bio / location / email / socials  → your identity
//   experience[]   → your work / organization / education history
//   techStack[]    → your skills, grouped by `category`
//   projects[]     → short project summaries (keep `slug` in sync with
//                    projectMeta.js + projectDetailsData.js)
//   achievements[] → awards / hackathons (optional)
//   capabilities[] → high-level specializations
export const PORTFOLIO_DATA = {
  profile: {
    name: "Firdaus Khotibul Zickrian",
    role: "AI Engineer & Full-Stack Developer",
    bio: "Passionate about building intelligent systems that learn, adapt, and solve complex problems. Specializing in Generative AI, Deep Learning, and Modern Web Technologies.",
    location: "Indonesia",
    email: "firdauskhotibulzickrian@gmail.com",
    socials: {
      github: "https://github.com/zickrian",
      linkedin: "https://linkedin.com/in/firdauskhotibulzickrian/",
    },
  },
  experience: [
    {
      title: "Google Developer Student Club - Universitas Dian Nuswantoro",
      period: "Nov 2023 - Nov 2025",
      description: [
        "Actively participating in developer community events, workshops, and collaborative study sessions.",
        "Contributed to 5+ community discussions across 4 projects, sharing insights on development and analytics.",
      ],
    },
    {
      title: "Data Analyst - Blockvizo",
      period: "Jun 2024 - Jul 2025",
      description: [
        "Processed 50,000+ game hash history records, examining item drop patterns and building probability-based prediction models that improved forecasting accuracy by 35%.",
        "Delivered actionable insights through data visualization dashboards, supporting strategic decisions for decentralized projects and reducing analysis time by 40%.",
        "Specializing in predictive airdrop and winning probability analysis by examining large-scale on-chain data from 10+ Web3 ecosystems",
      ],
    },
    {
      title: "Lab Assistant - Programming Lab, Universitas Dian Nuswantoro",
      period: "Aug 2025 - Present",
      description: [
        "Assisted in over 3 academic lab sessions per week for programming and software development courses.",
        "Mentored around 110 junior students by guiding them through practical exercises and foundational programming concepts.",
      ],
    },
    {
      title: "Machine Learning Cohort - ASAH (led by Dicoding x Accenture)",
      period: "Aug 2025 - Jan 2026",
      description: [
        "Served as Project Manager, leading a cross-functional team of 5 machine learning engineers and React developers to build solutions addressing real-world business problems.",
        "Managing the development of a banking sales prediction portal that improves sales efficiency by prioritizing high-probability leads and reducing time wasted on low-potential prospects.",
        "Coordinated project timelines, technical discussions, and workflow execution across departments, improving team time efficiency by 70% and ensuring on-time delivery.",
      ],
    },
    {
      title: "AI Engineer Cohort - PIJAK (led by Dicoding x IBM)",
      period: "Jan 2026 - Present",
      description: [
        "Selected as one of the top talents for an intensive AI Engineering bootcamp focusing on Generative AI, Deep Learning, and Ethics.",
        "Developing advanced AI solutions using Python, applying industry-standard practices from IBM SkillsBuild curriculum.",
        "Collaborating on a capstone project to solve real-world challenges through innovative Artificial Intelligence implementation.",
      ],
    },
  ],
  techStack: [
    { name: "Python", category: "Language" },
    { name: "TensorFlow", category: "Deep Learning" },
    { name: "PyTorch", category: "Deep Learning" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Supabase", category: "Backend" },
    { name: "Docker", category: "DevOps" },
    { name: "MLOps", category: "Machine Learning Operations" },
    { name: "Scikit-Learn", category: "Machine Learning" },
    { name: "OpenCV", category: "Computer Vision" },
    { name: "FastAPI", category: "Backend" },
    { name: "Streamlit", category: "ML Deployment" },
    { name: "Pandas", category: "Data Analysis" },
    { name: "Matplotlib", category: "Visualization" },
    { name: "Seaborn", category: "Visualization" },
    { name: "Keras", category: "Deep Learning" },
    { name: "Numpy", category: "Data Science" },
    { name: "Google Gemini", category: "LLM / GenAI" },
    { name: "RAG", category: "AI Architecture" },
    { name: "ExpressJS", category: "Backend" },
    { name: "Microsoft Azure", category: "Cloud" },
  ],
  projects: [
    {
      slug: "diabetes-classification",
      title: "Diabetes Classification",
      category: "AI / Machine Learning",
      description: "Machine Learning model to classify diabetes risk based on medical data.",
    },
    {
      slug: "leadsup",
      title: "LeadsUp",
      category: "AI-Powered Lead Scoring",
      description: "AI system for scoring sales leads to prioritize high-value prospects.",
    },
    {
      slug: "polsekrembang",
      title: "Polsek Rembang Virtual Assistant",
      category: "RAG Chatbot / AI Assistant",
      description: "RAG-based chatbot to assist with police station inquiries and services.",
    },
    {
      slug: "floodsegmen",
      title: "Flood Segmentation Analyzer",
      category: "Computer Vision",
      description:
        "Computer Vision system for analyzing flood patterns and segmentation from satellite/drone imagery.",
    },
    {
      slug: "qmeal",
      title: "QMeal E-Kantin",
      category: "Multi-Vendor Ordering Platform",
      description:
        "Digital canteen ordering system supporting multiple vendors and efficient queue management.",
    },
    {
      slug: "lostandfound",
      title: "SITEMU Lost & Found Portal",
      category: "Web Application",
      description: "Community platform for reporting and finding lost items.",
    },
    {
      slug: "imageclas",
      title: "Vegetable Image Classification",
      category: "Computer Vision",
      description: "Deep Learning model for classifying different types of vegetables from images.",
    },
    {
      slug: "financial-assistant-bot",
      title: "Financial Assistant Bot",
      category: "AI / Fintech",
      description: "AI bot for personal finance management and advice.",
    },
  ],
  achievements: [
    {
      title: "National Finalist - Base Indonesia Hackathon 2025",
      project: "Base Realms",
      description:
        "Built an onchain 16-bit RPG battle game on Base chain with QRIS payment integration, ERC-721/ERC-1155 NFTs, and seasonal reward pools. Onboards non-crypto users through familiar payment methods.",
      team: "Terra Bit (Firdaus Khotibul Zickrian & Gagah Athallah Fatha)",
      track: "Base Track",
      techStack: ["Solidity", "Next.js", "TypeScript", "JavaScript", "CSS"],
      links: {
        devfolio: "https://devfolio.co/projects/base-realms-b63a",
        github: "https://github.com/zickrian/Base-Realms",
        live: "https://baserealms.app/",
      },
    },
  ],
  capabilities: [
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing (NLP)",
    "Machine Learning Operations (MLOps)",
    "Data Analysis",
    "Web Development",
  ],
};
