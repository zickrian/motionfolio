import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { exponentialEaseOut } from "../utils/easing";

const useScrollToGallery = (galleryRef, isLoading) => {
  const location = useLocation();

  const smoothScrollTo = (target, onComplete) => {
    const lenis = window.lenisInstance;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: exponentialEaseOut,
        lock: true,
        onComplete,
      });
      return;
    }

    window.scrollTo({ top: target, behavior: "smooth" });
    if (onComplete) setTimeout(onComplete, 420);
  };

  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;

    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");

    if (scrollTo && scrollTo.startsWith("project-")) {
      const scrollToGallery = async () => {
        if (!galleryRef.current) return;

        const section = galleryRef.current;
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight || window.innerHeight;
        const offset = Math.min(sectionHeight * 0.3, 300);
        const targetScrollPosition = sectionTop + offset;

        const track = section.querySelector(".flex.gap-6") || section.querySelector(".flex.gap-12");
        if (!track) {
          smoothScrollTo(targetScrollPosition);
          return;
        }

        const [gsapModule, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        const gsap = gsapModule.default || gsapModule.gsap;

        const stInstances = ScrollTrigger.getAll().filter((st) => st.trigger === section);
        const st = stInstances[0];

        if (st) {
          gsap.set(track, { x: 0 });
          ScrollTrigger.refresh();

          requestAnimationFrame(() => {
            smoothScrollTo(targetScrollPosition, () => {
              ScrollTrigger.refresh();
            });
          });
        } else {
          // Fallback
          gsap.set(track, { x: 0 });
          ScrollTrigger.refresh();

          smoothScrollTo(targetScrollPosition, () => {
            ScrollTrigger.refresh();
          });
        }
      };

      const timer = setTimeout(() => {
        scrollToGallery();
      }, 300);

      setTimeout(() => {
        window.history.replaceState({}, "", "/");
      }, 100);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [location.search, isLoading, galleryRef]);
};

export default useScrollToGallery;
