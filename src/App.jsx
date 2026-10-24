import { useLayoutEffect } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetailModal from "./components/projects/ProjectDetailModal";

// Component untuk scroll ke atas setiap kali route berubah
function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType();
  const { pathname, search } = location;
  const isProjectModal = pathname.startsWith("/projects/") && location.state?.backgroundLocation;

  // useLayoutEffect untuk memastikan scroll terjadi SEBELUM render
  useLayoutEffect(() => {
    let cancelled = false;

    // Prevent scroll reset on POP (back button) actions
    if (navType === "POP") return undefined;

    // Cek apakah ada query param scrollTo
    const params = new URLSearchParams(search);
    const hasScrollTo = params.get("scrollTo");

    // Jika modal project di atas home, biarkan state scroll home tetap aktif
    if (isProjectModal) {
      return;
    }

    // Jika navigasi ke halaman project fallback (bukan modal), cleanup Lenis dan ScrollTrigger
    if (pathname !== "/") {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (cancelled) return;

        // Disable CSS scroll-behavior smooth untuk mencegah animasi scroll
        if (document.documentElement) {
          document.documentElement.style.scrollBehavior = "auto";
        }
        if (document.body) {
          document.body.style.scrollBehavior = "auto";
        }

        // Destroy Lenis instance TERLEBIH DAHULU untuk mencegah smooth scroll
        if (window.lenisInstance) {
          try {
            window.lenisInstance.destroy();
          } catch (e) {
            // Ignore errors
          }
          window.lenisInstance = null;
        }

        // Kill semua ScrollTrigger instances
        ScrollTrigger.getAll().forEach((st) => {
          try {
            st.kill();
          } catch (e) {
            // Ignore errors
          }
        });

        // Reset scrollerProxy ke default
        ScrollTrigger.scrollerProxy(document.documentElement, null);
        ScrollTrigger.defaults({ scroller: window });

        // Clear ScrollTrigger cache
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh(true);

        // Force instant scroll to top for project pages
        window.scrollTo(0, 0);
      });
    } else {
      // Home page logic
      // Kembalikan smooth scroll behavior untuk home page
      if (document.documentElement) {
        document.documentElement.style.scrollBehavior = "";
      }
      if (document.body) {
        document.body.style.scrollBehavior = "";
      }

      // JANGAN scroll ke atas jika ada query param scrollTo
      // Biarkan Home.jsx yang handle scroll ke project card
      if (!hasScrollTo) {
        // Scroll to top only when there is no scrollTo query param
        window.scrollTo(0, 0);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [pathname, search, isProjectModal, navType]);

  return null;
}

export default function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <ScrollToTop />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetailModal />} />
        </Routes>
      )}
    </>
  );
}
