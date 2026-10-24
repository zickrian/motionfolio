import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";

export const project = {
  title: "Diabetes Classification",
  category: "AI / Machine Learning",
  heroImg:
    "https://res.cloudinary.com/demlxsf08/image/upload/v1766488152/diabet_clasification_owt8nr.png",
  tagline:
    "A Machine Learning-based diabetes classification app that predicts diabetes risk from patient data, packaged in a simple, fast, and user-friendly web interface.",
  year: "2025",
  stack: [
    "Python",
    "Pandas / NumPy",
    "Scikit-learn",
    "Matplotlib / Seaborn",
    "Streamlit",
    "Model Serialization (Pickle / Joblib)",
  ],
  features: [
    "Patient data input form (glucose, BMI, age, insulin, etc.) for instant risk prediction.",
    "Preprocessing pipeline: handles missing values, scaling, and feature selection for model stability.",
    "Multi-algorithm training & evaluation (Logistic Regression / Random Forest / SVM) to select the best performer.",
    "Clear prediction output (Diabetes / Non-Diabetes) with easy-to-understand feedback messages.",
    "Clean project structure: data processing, training, evaluation, and inference separated for easier maintenance.",
  ],
  impact: [
    "Helps identify diabetes risk early based on patient health data before serious symptoms appear.",
    "Supports decision-making with fast predictions on whether a patient is likely to develop diabetes.",
    "Can be used as an initial screening tool to raise awareness and enable early prevention of diabetes.",
  ],
  links: {
    live: "https://diabetes-classificationn.streamlit.app/",
    repo: "https://github.com/zickrian/Projek-Klasifikasi-Diabetes",
  },
};

export default function DiabetesClassificationDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      mode={mode}
    />
  );
}
