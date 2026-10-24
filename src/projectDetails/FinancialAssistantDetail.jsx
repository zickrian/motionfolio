import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";

export const project = {
  title: "Financial Assistant Bot",
  category: "AI / Fintech",
  heroImg:
    "https://res.cloudinary.com/dujp9ydkx/image/upload/f_auto,q_auto/v1771095429/Screenshot_from_2026-02-15_01-49-09_q6icfy",
  tagline:
    "A personal AI-powered financial assistant on Telegram that automatically tracks expenses & income using RAG technology and OCR.",
  year: "2026",
  stack: [
    "Python (aiogram)",
    "Supabase (PostgreSQL + pgvector)",
    "RAG (Retrieval-Augmented Generation)",
    "LLM (Cerebras / OpenAI)",
    "Docker & Render",
    "Sentence Transformers",
  ],
  features: [
    "Natural language input (text/voice) for instant transaction logging without complicated manual forms.",
    "Advanced RAG Engine that learns user spending patterns for automatic category classification.",
    "Double-entry Ledger system (Bank Core) to ensure balance accuracy and real-time budget tracking.",
    "OCR integration to scan shopping receipts and automatically convert them into transaction data.",
    "Smart clarification mechanism using interactive buttons when input is ambiguous or incomplete.",
    "Periodic financial reports (daily/weekly/monthly) plus AI-based insights for savings recommendations.",
  ],
  impact: [
    "Transforms boring manual financial record-keeping into natural and efficient conversations.",
    "Provides full visibility into users' financial health through instant access in their everyday chat app.",
    "Helps users make better financial decisions through accurate spending data analysis.",
  ],
  links: {
    live: "https://t.me/zickrian_bot",
    repo: "https://github.com/zickrian/Accounting-Assistant",
  },
};

export default function FinancialAssistantDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      mode={mode}
    />
  );
}
