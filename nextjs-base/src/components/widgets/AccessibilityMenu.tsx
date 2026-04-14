"use client";
import { useI18n } from "@/app/locales/client";
import { useAccessibility } from "@/hooks/useAccessibility";
import { cn } from "@/lib/utils";

// Global variable to track initialization
let hasInitialized = false;

interface AccessibilityMenuProps {
  isOpen: boolean;
  dropdownPosition: "top" | "bottom";
}

const AccessibilityMenu = ({
  isOpen,
  dropdownPosition,
}: AccessibilityMenuProps) => {
  const t = useI18n();
  const {
    fontSizeAdjustment,
    highContrastActive,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    resetToDefaults,
  } = useAccessibility();

  // Define a type for the icon keys
  type IconKey =
    | "icon-a-plus"
    | "icon-a-minus"
    | "icon-brightness text-[3rem]"
    | "icon-reset";

  // Accessibility actions - use stopPropagation to prevent event bubbling
  const accessibilityActions: Record<IconKey, (e: React.MouseEvent) => void> = {
    "icon-a-plus": increaseFontSize,
    "icon-a-minus": decreaseFontSize,
    "icon-brightness text-[3rem]": toggleHighContrast,
    "icon-reset": resetToDefaults,
  };

  // Update accessibilityOptions to use the typed IconKey
  const accessibilityOptions: Array<{ icon: IconKey; label: string }> = [
    { icon: "icon-a-plus", label: "Increase Size" },
    { icon: "icon-a-minus", label: "Decrease Size" },
    { icon: "icon-brightness text-[3rem]", label: "High Contrast" },
    { icon: "icon-reset", label: "Reset to Default" },
  ];

  return (
    <>
      <div className="p hc:text-white text-start text-white/80">
        {"Accessibility"}
      </div>
      <div className="hc:bg-white h-px bg-white/30"></div>
      <div className="p2 hc:text-white flex w-72 flex-col gap-8 text-white/60">
        {accessibilityOptions?.map(({ icon, label }) => (
          <div
            key={icon}
            className={cn(
              "trasition-colors flex cursor-pointer items-center gap-6 duration-300 lg:hover:text-white",
              icon.includes("brightness") && highContrastActive && "text-white",
              // Add active state for font size buttons
              icon === "icon-a-plus" &&
                fontSizeAdjustment >= 2 &&
                "cursor-not-allowed opacity-50",
              icon === "icon-a-minus" &&
                fontSizeAdjustment <= -2 &&
                "cursor-not-allowed opacity-50",
            )}
            tabIndex={0}
            role="button"
            aria-label={label}
            onClick={accessibilityActions[icon]}
          >
            <div className="relative flex size-12 items-center justify-center">
              {/* Add you'r icon here */}
              <span className={icon} />
            </div>
            <div>{label}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AccessibilityMenu;
