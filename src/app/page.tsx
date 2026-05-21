"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// Dynamically import heavy components (no SSR for GSAP/video)
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const Gallery = dynamic(() => import("@/components/Gallery"), { ssr: false });
const Marquee = dynamic(() => import("@/components/Marquee"), { ssr: false });
const FinalMessage = dynamic(() => import("@/components/FinalMessage"), {
  ssr: false,
});

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useSmoothScroll();

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  const handleScrollCTA = useCallback(() => {
    const el = document.getElementById("gallery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main className="relative bg-[#0a0a0a]">
      {/* Loader — mounts on top, unmounts after completion */}
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}

      {/* Site content — always rendered but hidden until loader done */}
      <div
        className="transition-opacity duration-700"
        style={{ opacity: loaderDone ? 1 : 0 }}
      >
        {/* Section 2: Hero */}
        <Hero onScrollCTA={handleScrollCTA} />

        {/* Section 3: Parallax Gallery */}
        <div id="gallery" ref={galleryRef}>
          <Gallery />
        </div>

        {/* Section 4: Celebration Marquee */}
        <Marquee />

        {/* Bonus: Final cinematic letter */}
        <FinalMessage />

        {/* Footer */}
        <footer className="w-full py-10 text-center border-t border-white/5">
          <span className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e]/30 font-sans">
            Happy Birthday Ayman ✦
          </span>
        </footer>
      </div>
    </main>
  );
}
