import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";

export const project = {
  title: "Flood Segmentation Analyzer",
  category: "Computer Vision",
  heroImg:
    "https://res.cloudinary.com/demlxsf08/image/upload/v1766488341/Screenshot_2025-12-23_180456_rarqj0.png",
  tagline:
    "A deep learning-based flood segmentation app to detect and calculate affected area from imagery - with side-by-side U-Net and U-Net++ comparison in a single analysis dashboard.",
  year: "2025",
  stack: [
    "Python (Backend)",
    "FastAPI",
    "PyTorch",
    "U-Net",
    "U-Net++",
    "Image Preprocessing (OpenCV)",
    "Post-processing (mask refinement & thresholding)",
    "Frontend Dashboard (Next.js)",
    "Microsoft Azure (Deployment & Hosting)",
  ],
  features: [
    "Automatic flood segmentation from uploaded images to generate clear and readable flood masks.",
    "Two models in one system: U-Net and U-Net++ to compare segmentation performance on the same case.",
    "Analysis statistics: flood area (%), flood pixel count, total pixels, and model difference summary.",
    "Compare mode: displays Original vs U-Net Mask vs U-Net++ Mask and disagreement map for areas of conflict.",
    "Model agreement score to measure prediction consistency between U-Net and U-Net++ (consensus & pixel difference).",
    "Python backend inference pipeline deployed to Microsoft Azure for online access and scalability.",
    "Quick workflow: upload image > inference > result visualization > download/recap analysis.",
  ],
  impact: [
    "Enables rapid identification of flood-affected areas from imagery, making situational analysis more efficient.",
    "Provides quantitative estimates (area/pixel count) that can serve as a basis for reporting and condition monitoring.",
    "Facilitates segmentation model evaluation through direct U-Net vs U-Net++ comparison to select the best approach.",
  ],
  links: {
    repo: "https://github.com/zickrian/FloodSegmentationAPP",
  },
};

export default function FloodSegmenDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      mode={mode}
    />
  );
}
