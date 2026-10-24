import { useRef, memo } from "react";
import { Gsap, useGsapMotionValue } from "../utils/gsapAnimate";

// Feature detection: only enable magnetic effect on devices with a fine pointer (mouse/trackpad)
const HAS_FINE_POINTER =
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const Magnetic = memo(function Magnetic({ children }) {
  const ref = useRef(null);
  const x = useGsapMotionValue(0);
  const y = useGsapMotionValue(0);

  // On mobile/touch: render children without the motion wrapper for zero overhead
  if (!HAS_FINE_POINTER) {
    return children;
  }

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.5);
    y.set(middleY * 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Gsap.div
      style={{ x, y }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </Gsap.div>
  );
});

export default Magnetic;
