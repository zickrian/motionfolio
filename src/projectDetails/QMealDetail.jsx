import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";

export const project = {
  title: "QMeal E-Kantin",
  category: "Multi-Vendor Ordering Platform",
  heroImg: "https://res.cloudinary.com/demlxsf08/image/upload/v1766489005/projekqmeal_c56xzx.png",
  tagline:
    "A multi-vendor canteen platform that lets users order from multiple stalls at once - faster, queue-free, with AI-powered budget-based menu recommendations and QRIS/cashless payment via Midtrans.",
  year: "2025",
  stack: [
    "Next.js",
    "TailwindCSS",
    "Database (Supabase)",
    "Authentication (JWT / NextAuth)",
    "Midtrans Payment Gateway",
    "QRIS + E-Wallet / VA (via Midtrans) + Cash option",
    "Chatbot Recommendation (Rule-based / LLM integration)",
    "Order History & Rating System",
  ],
  features: [
    "Multi-stall checkout: users can select menu items from multiple vendors in a single order flow (no app-switching needed).",
    "Queue-free ordering: online ordering system reduces wait times and makes buying food more efficient during peak hours.",
    "AI Assistant (chatbot) for recommendations: helps choose menu items based on budget, preferences (snacks/drinks/full meals), and value bundles.",
    "Smart cart: automatically groups items per stall/vendor and shows a clear total summary before checkout.",
    "Flexible payments: supports QRIS/cashless via Midtrans, plus a CASH option for on-site payment (per canteen policy).",
    "Order history: users can view purchase history, order status, and total transactions for expense tracking.",
    "Store rating & review: displays vendor ratings so users can choose the most trustworthy and quality-consistent stalls.",
    "Search & category discovery: menu/vendor search + categories (breakfast/lunch/snacks) for faster exploration.",
  ],
  impact: [
    "Reduces wasted time during breaks as users can pre-order without standing in long queues.",
    "Improves canteen shopping experience with a smooth ordering flow, fast payments, and budget-relevant menu recommendations.",
    "Provides vendor quality insights through ratings and purchase history, making user decisions more confident and data-driven.",
  ],
  links: {
    repo: "https://github.com/zickrian/user-canteen",
  },
};

export default function QMealDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      mode={mode}
    />
  );
}
