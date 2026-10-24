import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";

export const project = {
  title: "SITEMU Lost & Found Portal",
  category: "Campus Web Application",
  heroImg: "https://res.cloudinary.com/demlxsf08/image/upload/v1766489554/projeklast_zefs7l.png",
  tagline:
    "A Lost & Found app for Udinus students to quickly report lost or found items - complete with a statistics dashboard and per-post chat feature for easier coordination between users.",
  year: "2025",
  stack: ["Next.js", "TailwindCSS", "Supabase (PostgreSQL)", "Realtime Chat", "Geolocation"],
  features: [
    "Lost & found item reporting: students can create detailed reports with category, time, and item description.",
    "Geolocation tagging: when creating a report, users can auto-detect location (GPS) or select a point on the map to mark where the item was last seen/found.",
    "Map view for location context: reports display location pins so other users can better understand the area and speed up the search.",
    "Clean post board: users can browse recent reports, search, and filter by status (lost/found/resolved).",
    "Per-post chat: each report has a discussion thread to facilitate communication between the reporter and the finder.",
    "Statistics dashboard: shows total reports, lost items, found items, active reports, and resolved cases for campus-wide insights.",
    "Udinus email-only login: access is restricted to Udinus email domain to keep the system secure and relevant to the campus environment.",
    "Status tracking: reports can be updated to resolved once the item has been returned to its owner.",
  ],
  impact: [
    "Speeds up item recovery since reports can be created and accessed online without manually spreading the word.",
    "Accurate geolocation helps make searches more effective and reduces confusion about where items were lost.",
    "Reduces miscommunication through direct chat on posts, making verification and item return processes faster.",
    "Enhances system security and relevance as only Udinus students can access it via campus email authentication.",
  ],
  links: {
    repo: "https://github.com/zickrian/LostItem-Project",
  },
  notes:
    "Access Restricted: This website is only accessible using Udinus student email (@mhs.dinus.ac.id).",
};

const accessNotice = (
  <div className="mb-10 border-4 border-black bg-lime-400 p-8">
    <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Restricted Access</h2>
    <p className="text-lg font-medium leading-relaxed">
      This website is only accessible using a Udinus student email (@mhs.dinus.ac.id). The
      authentication system is designed to maintain security and platform relevance within the
      campus environment.
    </p>
  </div>
);

export default function LostAndFoundDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      preFeatureSection={accessNotice}
      mode={mode}
    />
  );
}
