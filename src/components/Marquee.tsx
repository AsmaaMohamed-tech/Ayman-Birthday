"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGSAP } from "@/lib/gsapPlugins";

const BIRTHDAY_TEXT = "Happy Birthday Ayman  ✦  ";
const REPEAT = 8;

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      if (!trackRef.current) return;

      gsap.set(trackRef.current, { xPercent: 0 });

      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = Array.from({ length: REPEAT }, (_, i) => (
    <span
      key={i}
      className="inline-flex items-center gap-8 pl-8 flex-shrink-0"
    >
      <span className="font-display italic font-light text-[clamp(3rem,8vw,8rem)] text-transparent"
        style={{
          WebkitTextStroke: "1px rgba(201,169,110,0.35)",
        }}
      >
        {BIRTHDAY_TEXT}
      </span>
      <span
        className="font-display italic font-semibold text-[clamp(3rem,8vw,8rem)] accent-gradient-text flex-shrink-0"
      >
        {BIRTHDAY_TEXT}
      </span>
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="marquee"
      className="relative w-full overflow-hidden bg-[#0a0a0a] border-y border-white/5 py-6"
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] accent-gradient opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] accent-gradient opacity-40" />

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-[#0a0a0a] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0a] to-transparent" />

      {/* Marquee track */}
      <div
        ref={trackRef}
        className="marquee-track will-change-transform"
        style={{ display: "flex", width: "max-content" }}
      >
        {items}
      </div>
    </section>
  );
}
