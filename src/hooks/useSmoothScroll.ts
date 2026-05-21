"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: {
      raf: (time: number) => void;
      destroy: () => void;
      scrollTo: (target: HTMLElement | string | number, opts?: object) => void;
    } | null = null;

    const isMobile =
      typeof window !== "undefined" && window.innerWidth <= 768;

    const init = async () => {
      try {
        const LenisModule = await import("@studio-freight/lenis");
        const Lenis = LenisModule.default;

        lenis = new Lenis({
          duration: isMobile ? 0.8 : 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          // Disable smooth wheel on mobile — native touch scroll is more
          // predictable for GSAP pinned sections on iPhone Safari.
          smoothWheel: !isMobile,
        });

        // Sync Lenis with GSAP ticker for accurate ScrollTrigger updates
        gsap.ticker.add((time) => {
          lenis?.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();
      } catch {
        console.warn("Lenis not available, using native scroll");
      }
    };

    init();

    return () => {
      lenis?.destroy();
    };
  }, []);
}
