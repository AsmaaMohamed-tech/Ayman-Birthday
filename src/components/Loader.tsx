"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORDS = ["Are", "You", "Ready?"];
const DURATION_MS = 4500; // Total time for the sequence

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Word cycling logic (Triggers only once per word)
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < WORDS.length - 1) {
          return prev + 1;
        }
        clearInterval(wordInterval); // Stops the loop at "Ready?"
        return prev;
      });
    }, 1300);

    return () => clearInterval(wordInterval);
  }, []);

  // Progress Bar and Exit Logic
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / DURATION_MS, 1);

      setCount(Math.floor(progress * 100));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(100);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative h-40 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={wordIndex}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display italic text-[clamp(3.5rem,10vw,8rem)] font-light tracking-tight text-[#f0ede8] select-none"
          >
            {WORDS[wordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-[#c9a96e]"
          style={{
            width: `${count}%`,
            boxShadow: "0 0 20px 1px rgba(201,169,110,0.3)",
          }}
        />
      </div>
    </motion.div>
  );
}