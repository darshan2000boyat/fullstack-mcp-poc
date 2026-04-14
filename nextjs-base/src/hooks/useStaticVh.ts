// hooks/useStaticVh.tsx
import { useEffect } from "react";

export default function useStaticVh() {
  useEffect(() => {
    let previousHeight = 0;
    let previousWidth = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    // Function to update the CSS variable
    const updateVh = () => {
      const currentHeight = window.innerHeight;
      const currentWidth = window.innerWidth;

      // Check if width has changed (horizontal resize)
      const hasWidthChanged =
        previousWidth !== 0 && currentWidth !== previousWidth;

      // Check if it's the first run
      const isFirstRun = previousHeight === 0;

      // Check if height has changed significantly (for orientation changes)
      const hasHeightChangedSignificantly =
        Math.abs(currentHeight - previousHeight) > 100;

      // Only update in these specific cases:
      // 1. First run
      // 2. Horizontal resize
      // 3. Significant height change (likely an orientation change)
      if (isFirstRun || hasWidthChanged || hasHeightChangedSignificantly) {
        document.documentElement.style.setProperty(
          "--static-vh",
          `${currentHeight * 0.01}px`,
        );
        previousHeight = currentHeight;
      }

      // Always update previous width to track horizontal changes
      previousWidth = currentWidth;
    };

    // Custom resize handler to check if it's a horizontal resize
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      // Only trigger update when width changes
      if (currentWidth !== previousWidth) {
        debouncedUpdateVh();
      }
    };

    // Debounce function to avoid multiple rapid updates
    const debouncedUpdateVh = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateVh, 200);
    };

    // Set it initially with a slight delay to ensure correct measurement
    setTimeout(updateVh, 100);

    // Listen for resize events with our custom handler
    window.addEventListener("resize", handleResize, { passive: true });

    // Orientation change should always trigger an update
    window.addEventListener("orientationchange", debouncedUpdateVh, {
      passive: true,
    });

    // Clean up all event listeners when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", debouncedUpdateVh);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
}
