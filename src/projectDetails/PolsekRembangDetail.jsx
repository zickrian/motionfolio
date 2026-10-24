import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";

export const project = {
  title: "Polsek Rembang",
  category: "Virtual Assistant",
  heroImg: "https://res.cloudinary.com/demlxsf08/image/upload/v1766486963/projek3_enbcj9.png",
  tagline:
    "A RAG-based virtual assistant for Polsek Rembang Kota information services - helping citizens get quick, clear, and human-like answers about SKCK, lost item reports, event permits, and related police services.",
  year: "2025",
  stack: [
    "Next.js (API Route)",
    "Google Gemini API",
    "RAG (Knowledge Base + Retrieval)",
    "Prompt Engineering (system prompt & guardrails)",
    "Chat UI (interactive conversation)",
  ],
  features: [
    "Interactive chat for Q&A about police services with a friendly yet professional and informative tone.",
    "RAG knowledge base: answers are derived from internal knowledge (station profile, service hours, SKCK, lost item reports, event permits, detainee visits, etc.).",
    "Response guardrails: assistant only answers topics relevant to police services, and politely declines off-topic questions.",
    "Consistent answer format (plain text): no markdown, no unusual symbols - easily readable on any device.",
    "Quick actions to speed up user flow: e.g., police service buttons, incident reports, and contact an officer.",
    "Download transcript: users can download chat history as evidence/conversation summary.",
    "Multimodal mode (optional): can receive images for analysis if needed (e.g., evidence or simple visual context).",
  ],
  impact: [
    "Speeds up access to service information: citizens no longer need to search for procedures and requirements as answers are instantly available via chat.",
    "Reduces repetitive questions to officers for administrative matters (SKCK, lost items, permits), allowing officers to focus on field services.",
    "Enhances citizen experience with clear, consistent, and human-like responses - bringing public services closer through AI technology.",
  ],
  links: {
    repo: "https://github.com/zickrian/chatbot_ai",
  },
};

export default function PolsekRembangDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      mode={mode}
    />
  );
}
