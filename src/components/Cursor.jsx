import { useRef, useState, useEffect, memo } from "react";

const hasPointerDevice = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const Cursor = memo(function Cursor() {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Skip on devices without a fine pointer (touch-only)
    if (!hasPointerDevice()) return;

    let rafId = null;

    const mouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (cursorRef.current) {
            const offset = 8; // fixed 16px / 2
            cursorRef.current.style.transform = `translate3d(${positionRef.current.x - offset}px, ${positionRef.current.y - offset}px, 0)`;
          }
          rafId = null;
        });
      }
    };

    // Gunakan event delegation untuk performa lebih baik
    const updateHovered = (nextHovered) => {
      if (hoveredRef.current === nextHovered) return;
      hoveredRef.current = nextHovered;
      setHovered(nextHovered);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, .project-card")) {
        updateHovered(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest("a, button, .project-card")) {
        updateHovered(false);
      }
    };

    window.addEventListener("mousemove", mouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Skip render on touch-only devices
  if (!hasPointerDevice()) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference hidden md:block will-change-transform"
      style={{
        width: 16,
        height: 16,
      }}
    >
      <div
        className="w-full h-full bg-white rounded-full"
        style={{
          transform: hovered ? "scale(4)" : "scale(1)",
          transition: "transform 0.15s ease-out",
        }}
      />
    </div>
  );
});

export default Cursor;
