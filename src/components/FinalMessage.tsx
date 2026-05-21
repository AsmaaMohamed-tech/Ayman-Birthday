"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGSAP } from "@/lib/gsapPlugins";
import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 1,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 8}s`,
}));

export default function FinalMessage() {
  const sectionRef = useRef<HTMLElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letterRef.current,
        {
          opacity: 0,
          y: 80,
          scale: 0.94,
          filter: "blur(14px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: letterRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to(".floating-rune", {
        y: -18,
        duration: 4,
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
        ease: "sine.inOut",
      });

      gsap.to(".magic-particle", {
        y: -40,
        x: 20,
        opacity: 0,
        duration: 10,
        repeat: -1,
        stagger: 0.15,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="final"
      className="relative w-full min-h-screen overflow-hidden bg-[#050507] flex items-center justify-center px-5 py-28"
    >
      {/* ───────────────── BACKGROUND ───────────────── */}

      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top, rgba(124,92,255,0.12), transparent 35%),
            radial-gradient(circle at bottom, rgba(201,169,110,0.08), transparent 40%),
            linear-gradient(to bottom, #050507, #08090d, #050507)
          `,
        }}
      />

      {/* Huge moon */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 pointer-events-none">
        <div
          className="rounded-full"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(143,211,255,0.08) 35%, transparent 70%)",
            filter: "blur(12px)",
            animation: "moonFloat 8s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Fog */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05), transparent 30%), radial-gradient(circle at 80% 40%, rgba(124,92,255,0.08), transparent 35%)",
          filter: "blur(70px)",
        }}
      />

      {/* Stars */}
      {Array.from({ length: 120 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background:
              i % 5 === 0
                ? "#c9a96e"
                : i % 4 === 0
                  ? "#8fd3ff"
                  : "white",
            opacity: Math.random() * 0.8,
            animation: `twinkle ${2 + Math.random() * 5
              }s ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* Magic particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="magic-particle absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background:
              p.id % 2 === 0 ? "#c9a96e" : "#8fd3ff",
            boxShadow:
              p.id % 2 === 0
                ? "0 0 18px #c9a96e"
                : "0 0 18px #8fd3ff",
            opacity: 0.6,
            animation: `particleFloat ${p.duration} ${p.delay} linear infinite`,
          }}
        />
      ))}

      {/* Floating symbols */}
      {["✦", "☾", "⟡", "✧", "☽"].map((s, i) => (
        <div
          key={i}
          className="floating-rune absolute text-[#c9a96e]/20"
          style={{
            top: `${15 + i * 16}%`,
            left: i % 2 === 0 ? "8%" : "88%",
            fontSize: `${28 + i * 4}px`,
            filter: "blur(0.3px)",
          }}
        >
          {s}
        </div>
      ))}

      {/* ───────────────── MAIN LETTER ───────────────── */}

      <motion.div
        ref={letterRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-20 max-w-3xl w-full"
      >
        {/* Legendary title */}
        <div className="text-center mb-10">
          <span className="block text-[10px] tracking-[0.7em] uppercase text-[#8fd3ff]/60 mb-4">
            Final Chapter
          </span>

          <h1 className="font-display italic text-5xl sm:text-7xl text-[#f6f1e8] leading-none">
            The Hidden
            <span className="block text-[#c9a96e] mt-2">
              Letter
            </span>
          </h1>

          <div className="mt-6 flex justify-center gap-2">
            <div className="w-16 h-[1px] bg-[#c9a96e]/30" />
            <div className="w-4 h-[1px] bg-[#8fd3ff]/40" />
            <div className="w-16 h-[1px] bg-[#c9a96e]/30" />
          </div>
        </div>

        {/* Magical letter */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(135deg, rgba(12,12,16,0.96), rgba(17,16,22,0.95))",
            backdropFilter: "blur(22px)",
            boxShadow: `
              0 0 120px rgba(124,92,255,0.10),
              0 0 80px rgba(201,169,110,0.08),
              inset 0 0 60px rgba(255,255,255,0.02)
            `,
          }}
        >
          {/* Animated glow border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(130deg, transparent, rgba(201,169,110,0.08), transparent)",
              animation: "borderFlow 7s linear infinite",
            }}
          />

          {/* Decorative corners */}
          {[
            "top-5 left-5",
            "top-5 right-5",
            "bottom-5 left-5",
            "bottom-5 right-5",
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute ${p} text-[#c9a96e]/30 text-xl`}
            >
              ✦
            </div>
          ))}

          <div className="relative z-10 px-7 sm:px-14 py-12 sm:py-16">
            {/* Name */}
            <div className="text-center mb-10">
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/50 block mb-4">
                A message preserved beyond time
              </span>

              <h2 className="font-display italic text-4xl sm:text-6xl text-[#f5f0e7]">
                To Ayman
              </h2>
            </div>

            {/* Text */}
            <div className="space-y-7 text-[#f0ede8]/72 text-[15px] sm:text-[17px] leading-[2.1]">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Somewhere between the stars and the sea of
                dreams, a story was written for you long before
                you even knew it existed.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Every challenge, every heartbreak, every moment
                you thought you were lost — it was never the end
                of your story. It was only another chapter
                guiding you toward the person you are becoming.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                May Allah always light your path, protect your
                heart, and grant you a future more beautiful than
                anything you have ever imagined.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-[#c9a96e]/90"
              >
                The world is still waiting for your greatest
                chapter.
              </motion.p>
            </div>

            {/* Signature */}
            <div className="mt-14 text-right">
              <div className="w-24 h-[1px] bg-[#c9a96e]/20 ml-auto mb-5" />

              <span className="font-display italic text-3xl text-[#c9a96e]/80">
                From Asmaa
              </span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* ───────────────── ANIMATIONS ───────────────── */}

      <style jsx>{`
        @keyframes twinkle {
          from {
            opacity: 0.2;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes particleFloat {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-120px);
          }
        }

        @keyframes moonFloat {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(20px);
          }
        }

        @keyframes borderFlow {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}