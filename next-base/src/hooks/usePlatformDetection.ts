import React from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

interface PlatformDetectionResult {
  isMac: boolean;
  isWindows: boolean;
  detectedPlatform: string;
}

/**
 * Custom hook to detect the user's operating system and apply appropriate CSS classes
 * Works even when browser developer tools with device emulation are active
 */
export function usePlatformDetection(): PlatformDetectionResult {
  const [platform, setPlatform] = React.useState<PlatformDetectionResult>({
    isMac: false,
    isWindows: false,
    detectedPlatform: "",
  });

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("mac", "windows");

    // Check if device emulation is likely active
    const isEmulationActive =
      /android|iphone|ipad|mobile/i.test(navigator.userAgent) &&
      window.innerWidth < 1000 &&
      "ontouchstart" in window;

    // Use userAgentData when available (more reliable and not affected by emulation)
    const userAgentData = (navigator as any).userAgentData;

    // Get the platform with priorities
    let detectedPlatform = "";

    // 1. Use userAgentData.platform if available (most reliable, not affected by emulation)
    if (userAgentData && userAgentData.platform) {
      detectedPlatform = userAgentData.platform;
    }
    // 2. If emulation is likely active, try to detect the host OS
    else if (isEmulationActive) {
      // Check if any Windows-specific objects exist
      if ("msSaveBlob" in window.navigator || (window as any).Windows) {
        detectedPlatform = "Windows";
      }
      // Check for Mac-specific objects/behaviors
      else if (
        navigator.userAgent.includes("Chrome") &&
        !navigator.userAgent.includes("Edge") &&
        /AppleWebKit/.test(navigator.userAgent)
      ) {
        detectedPlatform = "macOS";
      }
    }
    // 3. Fallback to regular platform detection
    else {
      detectedPlatform = navigator.platform || "";
    }

    const isMac = /mac|darwin|macOS/i.test(detectedPlatform);
    const isWindows = /win|Windows/i.test(detectedPlatform);

    // Apply the appropriate class
    if (isMac) root.classList.add("mac");
    else if (isWindows) root.classList.add("windows");
    // Fallback - if we're on desktop but couldn't detect platform specifically
    else if (!isEmulationActive && window.innerWidth > 1024) {
      // Default to Windows if on desktop but couldn't detect platform
      root.classList.add("windows");
    }

    setPlatform({ isMac, isWindows, detectedPlatform });
  }, []);

  return platform;
}
