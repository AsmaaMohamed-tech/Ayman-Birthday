"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL =
  "https://res.cloudinary.com/dytpksh00/video/upload/v1777254845/Firefly_-Cinematic_animation_of_the_provided_image._High-quality_2D_anime_style._The_shattered_glass_o4zu23.mp4";

interface HeroProps {
  onScrollCTA: () => void;
}

export default function Hero({ onScrollCTA }: HeroProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [revealDone, setRevealDone] = useState(false);

  useEffect(() => {
    // Wait for fonts so GSAP measures the right layout
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 768px)",
        isDesktop: "(min-width: 769px)",
      },
      (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };

        /*
         * Scale targets:
         *   We want the text to grow until its letterforms fill the viewport.
         *   At ~10vw font-size, "WELCOME" ≈ 70vw wide.
         *   To "enter" the glyph interior we push past the stroke → 80-120×.
         *   Mobile uses a lower cap to prevent GPU overload on low-end devices.
         */
        const endScale = isMobile ? 55 : 110;
        const pinBuffer = isMobile ? "1800" : "3000";
        const scrub = isMobile ? 1.6 : 1.0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: `bottom+=${pinBuffer} top`,
            scrub,
            pin: true,          // pins ONLY this section during the animation
            anticipatePin: 1,   // prevents jump when pin starts
            onUpdate(self) {
              /*
               * At ~82% progress the video is fully revealed and content
               * should animate in. Reverses cleanly on scroll-up.
               */
              setRevealDone(self.progress >= 0.82);
            },
          },
        });

        /*
         * ── ANIMATION SEQUENCE ──
         *
         * Phase A (scrub 0 → 100%): Text scales up massively.
         *   Feels like zooming INTO the letters, entering the world.
         *
         * Phase B (scrub ~40% → 65%): Text fades out.
         *   Simulates "passing through" the white glyph into the other side.
         *
         * Phase C (scrub ~50% → 100%): Black overlay fades out.
         *   The cinematic video floods the screen — portal fully open.
         *
         * All three phases REVERSE perfectly on scroll-up because scrub:true.
         */

        // Phase A — scale up (runs the full timeline length = 3 units)
        tl.to(
          textRef.current,
          {
            scale: endScale,
            duration: 3,
            ease: "power2.inOut",
            force3D: false, // Must be false so browser re-rasterizes text instead of scaling a blurry bitmap
            transformOrigin: "center center",
          },
          0
        );

        // Phase B — text opacity fades as you "pass through" it
        tl.to(
          textRef.current,
          {
            opacity: 0,
            duration: 1,
            ease: "power2.in",
          },
          1.1 // starts at timeline position 1.1 out of 3
        );

        // Phase C — black overlay dissolves, video floods the frame
        tl.to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 1.8,
            ease: "power3.inOut",
          },
          1.4 // slight offset after text starts fading
        );

        return () => {};
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* ── Layer 0: Anime cinematic video ── */}
      {/* Hidden behind the black overlay initially; revealed as overlay fades */}
      <video
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* ── Layer 1: Black overlay ── */}
      {/* Starts fully opaque. GSAP fades this out to reveal the video. */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black"
        style={{ zIndex: 1 }}
      />

      {/* ── Layer 2: "WELCOME AYMEN" title ── */}
      {/* Pure white, solid — no cutout/mask tricks. */}
      {/* GSAP scales it up and then fades it as you scroll. */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <h1
          ref={textRef}
          className={syne.className}
          style={{
            color: "white",
            fontSize: "clamp(2.8rem, 9.5vw, 12rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            textAlign: "center",
            userSelect: "none",
            transformOrigin: "center center",
            WebkitFontSmoothing: "antialiased",
            /*
             * A subtle text-shadow gives the text a slight cinematic glow
             * even on the pure black background, making it feel premium.
             */
            textShadow:
              "0 0 60px rgba(255,255,255,0.12), 0 0 120px rgba(255,255,255,0.06)",
          }}
        >
          WELCOME
          <br />
          AYMAN
        </h1>
      </div>

      {/* ── Layer 3: Persistent cinematic gradient vignette ── */}
      {/* Top/bottom fade adds depth and frames the experience. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 20%, transparent 65%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* ── Layer 4: Post-reveal content ── */}
      {/*
       * Framer Motion animates this content in once GSAP ScrollTrigger
       * reaches 82% progress (revealDone = true).
       * Reverses when user scrolls back up (revealDone = false).
       *
       * pointerEvents on the outer div is "none" so it never blocks scrolling,
       * but the inner container re-enables it for the interactive button.
       */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-14 md:pb-20 px-6"
        style={{ zIndex: 4, pointerEvents: "none" }}
      >
        <div
          className="flex flex-col items-center gap-7"
          style={{ pointerEvents: "auto" }}
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
            animate={
              revealDone
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 36, filter: "blur(10px)" }
            }
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-white/85 leading-relaxed max-w-lg tracking-wide"
            style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)",
              fontFamily: `${syne.style.fontFamily}, sans-serif`,
              textShadow: "0 2px 24px rgba(0,0,0,0.95)",
            }}
          >
            You don’t need to be perfect  just  {" "}
            <span
              style={{
                color: "#ffffffff",
                textShadow: "0 0 20px rgba(0, 255, 221, 0.65)",
              }}
            >
              strong enough
            </span>{" "}
            to keep going...
          </motion.p>

          {/* CTA Button — clicking calls onScrollCTA which the parent */}
          {/* implements as: nextSectionRef.current?.scrollIntoView({ behavior: "smooth" }) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={
              revealDone
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 24, scale: 0.94 }
            }
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.38,
            }}
          >
            <button
              id="hero-cta-btn"
              onClick={onScrollCTA}
              aria-label="Start your journey — scroll to next section"
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "15px 44px",
                border: "1px solid rgba(201,169,110,0.5)",
                background: "transparent",
                color: "#c9a96e",
                fontFamily: `${syne.style.fontFamily}, sans-serif`,
                fontWeight: 700,
                fontSize: "clamp(0.65rem, 1.5vw, 0.76rem)",
                letterSpacing: "0.32em",
                textTransform: "uppercase" as const,
                cursor: "pointer",
                transition: "color 0.38s ease, box-shadow 0.38s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                const fill = el.querySelector<HTMLSpanElement>(".cta-fill");
                el.style.color = "#0a0a0a";
                el.style.boxShadow = "0 0 32px rgba(201,169,110,0.45)";
                if (fill) fill.style.transform = "translateY(0%)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                const fill = el.querySelector<HTMLSpanElement>(".cta-fill");
                el.style.color = "#c9a96e";
                el.style.boxShadow = "none";
                if (fill) fill.style.transform = "translateY(101%)";
              }}
              onFocus={(e) => {
                const el = e.currentTarget;
                const fill = el.querySelector<HTMLSpanElement>(".cta-fill");
                el.style.color = "#0a0a0a";
                if (fill) fill.style.transform = "translateY(0%)";
              }}
              onBlur={(e) => {
                const el = e.currentTarget;
                const fill = el.querySelector<HTMLSpanElement>(".cta-fill");
                el.style.color = "#c9a96e";
                if (fill) fill.style.transform = "translateY(101%)";
              }}
            >
              {/* Hover fill sweep — slides up from bottom */}
              <span
                className="cta-fill"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#c9a96e",
                  transform: "translateY(101%)",
                  transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                START YOUR JOURNEY
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}