"use client";

import { useEffect } from "react";

/**
 * Shows the scrollbar only when the cursor is within `edgeSize`
 * pixels of the right window edge.
 *
 * @param edgeSize   – distance from right edge that triggers the class (px)
 * @param className  – class added to <body> while active
 */
export function useEdgeScrollbar(
  edgeSize: number = 16,
  className = "show-scrollbar",
) {
  useEffect(() => {
    // exit early during SSR
    if (typeof window === "undefined") return;

    // Exit for Mozilla Firefox browsers
    if (navigator.userAgent.toLowerCase().includes("firefox")) return;

    const body = document.body;
    const html = document.documentElement;
    let isOnEdge = false;
    let frameRequested = false;

    // Check if body or html has overflow:hidden inline style
    const hasOverflowHidden = (): boolean => {
      return (
        body.style.overflow === "hidden" || html.style.overflow === "hidden"
      );
    };

    // Check if body has a scrollbar
    const hasScrollbar = (): boolean => {
      return body.scrollHeight > window.innerHeight;
    };

    const handleMouse = (e: MouseEvent) => {
      if (frameRequested) return;
      frameRequested = true;

      requestAnimationFrame(() => {
        frameRequested = false;

        // Check if we're near the edge, if overflow is not hidden, and if there's a scrollbar
        const nearEdge = e.clientX >= window.innerWidth - edgeSize;
        const overflowHidden = hasOverflowHidden();
        const scrollbarExists = hasScrollbar();

        if (nearEdge && !isOnEdge && !overflowHidden && scrollbarExists) {
          body.classList.add(className);
          isOnEdge = true;
        } else if (
          (!nearEdge || overflowHidden || !scrollbarExists) &&
          isOnEdge
        ) {
          body.classList.remove(className);
          isOnEdge = false;
        }
      });
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });

    // Create a MutationObserver to watch for inline style changes on body and html
    const bodyObserver = new MutationObserver(() => {
      // If we're currently showing the scrollbar but overflow is now hidden or there's no scrollbar, remove it
      if (isOnEdge && (hasOverflowHidden() || !hasScrollbar())) {
        body.classList.remove(className);
        isOnEdge = false;
      }
    });

    // Observe style attribute changes on both body and html
    bodyObserver.observe(body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    bodyObserver.observe(html, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // tidy up on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      bodyObserver.disconnect();
      body.classList.remove(className);
    };
  }, [edgeSize, className]);
}
