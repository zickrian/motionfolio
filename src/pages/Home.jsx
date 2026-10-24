import { useEffect, useState, useRef, lazy, Suspense, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Preloader from "../components/Preloader";
import Cursor from "../components/Cursor";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ChatLauncher from "../components/ChatLauncher";
import useLenis from "../hooks/useLenis";
import useScrollToGallery from "../hooks/useScrollToGallery";

const MarqueeBanner = lazy(() => import("../components/MarqueeBanner"));
const AboutSection = lazy(() => import("../components/AboutSection"));
const Footer = lazy(() => import("../components/Footer"));

const ProjectGallery = lazy(() => import("../components/ProjectGallery"));
const GitHubStats = lazy(() => import("../components/GitHubStats"));
const TechStack = lazy(() => import("../components/TechStack"));
const NoiseOverlay = lazy(() => import("../components/NoiseOverlay"));
const ProfessionalExperience = lazy(() => import("../components/ProfessionalExperience"));
const TechnicalCapabilities = lazy(() => import("../components/TechnicalCapabilities"));

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const galleryRef = useRef(null);

  /* Refactored Loading & Scroll Logic */
  const [isLoading, setIsLoading] = useState(true);
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const [enableNoiseOverlay, setEnableNoiseOverlay] = useState(false);

  // Initialize Lenis with scroll lock state
  useLenis(isScrollLocked);

  useScrollToGallery(galleryRef, isLoading);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnableNoiseOverlay(isFinePointer && !reduceMotion);
    }
  }, []);

  // Preload profile image (optimized WebP with JPEG fallback)
  useEffect(() => {
    const profileImg = new Image();
    profileImg.src = "/profile.webp";
  }, []);

  // Manage body overflow based on scroll lock
  useEffect(() => {
    if (isScrollLocked) {
      document.body.style.overflow = "hidden";
      // Safety check: ensure strict scroll reset
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
  }, [isScrollLocked]);

  const handleOpenProject = useCallback(
    (project) => {
      if (!project?.slug) return;
      navigate(`/projects/${project.slug}`, {
        state: { backgroundLocation: location },
      });
    },
    [navigate, location],
  );

  return (
    <div className="bg-[#FAF9F6] text-black selection:bg-lime-400 selection:text-black relative">
      {isLoading && (
        <Preloader
          onComplete={() => {
            setIsLoading(false);
            setIsScrollLocked(false);
          }}
        />
      )}

      {enableNoiseOverlay && (
        <Suspense fallback={null}>
          <NoiseOverlay />
        </Suspense>
      )}
      <ChatLauncher />

      <Cursor />
      <Navbar />
      <HeroSection isRevealed={true} />
      <Suspense fallback={null}>
        <MarqueeBanner />
      </Suspense>
      <Suspense fallback={null}>
        <AboutSection />
      </Suspense>

      <div id="project-section" ref={galleryRef} className="bg-neutral-900">
        <Suspense fallback={<div className="h-screen bg-neutral-900" />}>
          <ProjectGallery onOpenProject={handleOpenProject} />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <ProfessionalExperience />
      </Suspense>
      <Suspense fallback={null}>
        <TechStack />
      </Suspense>
      <Suspense fallback={null}>
        <GitHubStats />
      </Suspense>
      <Suspense fallback={null}>
        <TechnicalCapabilities />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
