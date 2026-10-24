import { useEffect, useRef } from "react";
import { exponentialEaseOut } from "../utils/easing";

const useLenis = (disabled) => {
  const lenisRef = useRef(null);
  const disabledRef = useRef(disabled);
  const tickerCallbackRef = useRef(null);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    let cancelled = false;
    let cleanup = null;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldUseLenis = !prefersReducedMotion;

    if (!shouldUseLenis) {
      document.documentElement.classList.remove("lenis");
      if (window.lenisInstance && !window.lenisInstance.isDestroyed) {
        window.lenisInstance.destroy();
      }
      window.lenisInstance = null;
      return;
    }

    const initializeLenis = async () => {
      const [{ default: Lenis }, gsapModule, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      const gsap = gsapModule.default || gsapModule.gsap;
      gsap.registerPlugin(ScrollTrigger);

      // Reuse existing global instance if still alive
      if (window.lenisInstance && !window.lenisInstance.isDestroyed) {
        lenisRef.current = window.lenisInstance;
        if (disabled) lenisRef.current.stop();
        else lenisRef.current.start();
        return;
      }

      window.lenisInstance = null;

      // Lenis with optimized config for stable desktop + touch scrolling
      const lenis = new Lenis({
        duration: 1.5,
        easing: exponentialEaseOut,
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false, // Let mobile devices use native hardware-accelerated momentum scrolling
        touchMultiplier: 2,
        infinite: false,
      });

      document.documentElement.classList.add("lenis");

      lenisRef.current = lenis;
      window.lenisInstance = lenis;

      if (disabledRef.current) lenis.stop();
      else lenis.start();

      // Sync Lenis scroll events with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Use GSAP ticker instead of a separate rAF loop.
      // This avoids double requestAnimationFrame and synchronizes
      // all animations (Lenis + GSAP) in a single frame callback.
      const tickerCallback = (time) => {
        // GSAP ticker provides time in seconds, Lenis expects milliseconds
        lenis.raf(time * 1000);
      };
      tickerCallbackRef.current = tickerCallback;
      gsap.ticker.add(tickerCallback);

      // Tell Lenis not to run its own rAF loop
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();

      cleanup = () => {
        document.documentElement.classList.remove("lenis");
        if (tickerCallbackRef.current) {
          gsap.ticker.remove(tickerCallbackRef.current);
        }
        lenis.destroy();
        window.lenisInstance = null;
      };
    };

    initializeLenis();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (disabled) lenisRef.current.stop();
    else lenisRef.current.start();
  }, [disabled]);
};

export default useLenis;
