// src/hooks/useAccessibility.ts
import { useApp } from "@/components/AppProvider";
import { useCallback, useEffect } from "react";

// Track initialization outside the hook
let hasInitialized = false;

export const useAccessibility = () => {
  const {
    fontSizeAdjustment,
    setFontSizeAdjustment,
    highContrastActive,
    setHighContrastActive,
    setAccessibilityTrigger,
  } = useApp();

  // Initialize accessibility settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !hasInitialized) {
      // Get saved accessibility settings from localStorage
      const savedFontAdjustment = localStorage.getItem("fontSizeAdjustment");
      const savedHighContrast = localStorage.getItem("highContrastMode");

      // Apply saved font size adjustment - but only on initial mount
      // Apply saved font size adjustment - but only on initial mount
      if (savedFontAdjustment) {
        const adjustment = parseInt(savedFontAdjustment);
        // Make sure the saved value is within our -2 to +2 range
        const clampedAdjustment = Math.max(-2, Math.min(2, adjustment));
        setFontSizeAdjustment(clampedAdjustment);

        // Apply font size directly - only if there's an actual adjustment
        if (clampedAdjustment !== 0) {
          const html = document.documentElement;
          // Use the CSS variable that's already defined in your CSS
          html.style.fontSize = `calc(var(--original-font-size) + ${clampedAdjustment}px)`;
        }
      }

      // Apply saved high contrast setting
      if (savedHighContrast === "true") {
        setHighContrastActive(true);
        document.documentElement.classList.add("hc");
      }

      // Mark as initialized globally
      hasInitialized = true;
    } else if (hasInitialized) {
      // If already initialized, just sync the state with saved values
      const savedFontAdjustment = localStorage.getItem("fontSizeAdjustment");
      const savedHighContrast = localStorage.getItem("highContrastMode");

      if (savedFontAdjustment) {
        setFontSizeAdjustment(parseInt(savedFontAdjustment));
      }

      setHighContrastActive(savedHighContrast === "true");
    }
  }, [setHighContrastActive, setFontSizeAdjustment]);

  // Function to apply font size adjustment
  const applyFontSizeAdjustment = useCallback(
    (newAdjustment: number, currentAdjustment: number) => {
      const html = document.documentElement;
      // Use the CSS variable directly
      html.style.fontSize = `calc(var(--original-font-size) + ${newAdjustment}px)`;
      setAccessibilityTrigger && setAccessibilityTrigger((prev) => prev + 1);
    },
    [setAccessibilityTrigger],
  );

  // Increase font size
  const increaseFontSize = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      // Only allow increasing if current adjustment is less than 2px
      if (fontSizeAdjustment < 2) {
        const newAdjustment = Math.min(2, fontSizeAdjustment + 2);
        applyFontSizeAdjustment(newAdjustment, fontSizeAdjustment);
        setFontSizeAdjustment(newAdjustment);
        localStorage.setItem("fontSizeAdjustment", newAdjustment.toString());
      }
    },
    [fontSizeAdjustment, applyFontSizeAdjustment, setFontSizeAdjustment],
  );

  // Decrease font size
  const decreaseFontSize = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      // Only allow decreasing if current adjustment is greater than -2px
      if (fontSizeAdjustment > -2) {
        const newAdjustment = Math.max(-2, fontSizeAdjustment - 2);
        applyFontSizeAdjustment(newAdjustment, fontSizeAdjustment);
        setFontSizeAdjustment(newAdjustment);
        localStorage.setItem("fontSizeAdjustment", newAdjustment.toString());
      }
    },
    [fontSizeAdjustment, applyFontSizeAdjustment, setFontSizeAdjustment],
  );

  // Toggle high contrast
  const toggleHighContrast = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const html = document.documentElement;
      const newState = !highContrastActive;

      setHighContrastActive(newState);

      if (newState) {
        html.classList.add("hc");
      } else {
        html.classList.remove("hc");
      }

      localStorage.setItem("highContrastMode", newState.toString());

      setAccessibilityTrigger && setAccessibilityTrigger((prev) => prev + 1);
    },
    [highContrastActive, setHighContrastActive, setAccessibilityTrigger],
  );

  // Reset to defaults
  const resetToDefaults = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();

      // Reset font size to the original responsive setting
      const html = document.documentElement;
      html.style.fontSize = ""; // Remove inline style to let CSS take over
      setFontSizeAdjustment(0);
      localStorage.removeItem("fontSizeAdjustment");

      // Reset high contrast
      setHighContrastActive(false);
      document.documentElement.classList.remove("hc");
      localStorage.removeItem("highContrastMode");
    },
    [setFontSizeAdjustment, setHighContrastActive],
  );

  return {
    fontSizeAdjustment,
    highContrastActive,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    resetToDefaults,
  };
};
