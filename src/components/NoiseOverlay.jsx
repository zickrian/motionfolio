import { memo, useState, useEffect } from "react";

/**
 * NoiseOverlay renders a grain/noise texture over the entire viewport.
 *
 * Performance: Uses a static base64-encoded noise PNG tile instead of a live
 * SVG feTurbulence filter. The PNG is cached by the browser and composited
 * as a simple texture blit — no per-frame GPU filter computation.
 *
 * Disabled on mobile devices because the grain effect is barely visible
 * on small screens and still costs a compositing layer.
 */

// Generate a static noise PNG once at module load via Canvas.
// This replaces the feTurbulence SVG which the browser re-computed per-frame.
const generateNoiseDataURI = () => {
  if (typeof document === "undefined") return "";
  const size = 150;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};
const NOISE_DATA_URI = generateNoiseDataURI();

export default memo(function NoiseOverlay() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handleChange = (e) => setIsMobile(e.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleChange);
      }
    };
  }, []);

  // Skip rendering on mobile to save GPU resources
  if (isMobile) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[50] opacity-[0.03] mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE_DATA_URI}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
});
