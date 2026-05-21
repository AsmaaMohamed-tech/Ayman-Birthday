"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, registerGSAP } from "@/lib/gsapPlugins";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────── */
/* DATA                                                        */
/* ─────────────────────────────────────────────────────────── */

const CARDS = [
  {
    id: "card-1",
    description: `May this year bring you closer to everything you’ve been dreaming of, and may all your hard work finally pay off ✨

يارب أيامك الجاية تكون أخف، أجمل، وأهدى، وتلاقي دايمًا الطمأنينة والراحة في كل خطوة`,
    image:
      "https://i.pinimg.com/736x/cd/27/07/cd2707c26028eaa91de3cbabb767562c.jpg",
    accent: "#c9a96e",
  },

  {
    id: "card-2",
    description: `I hope you always have the courage to keep going and the faith to believe better days are coming 🤍

خليك دايمًا واثق إن ربنا شايلك الأحسن، وإن كل تأخير أو تعب وراه خير كبير مستنيك`,
    image:
      "https://i.pinimg.com/736x/00/06/c4/0006c4ce368a179399a28605119029f9.jpg",
    accent: "#6e9ec9",
  },

  {
    id: "card-3",
    description: `I hope you always find peace, happiness, and strength no matter what life brings your way 🤍

يارب تحقق كل أحلامك واحدة واحدة، وتوصل لكل حاجة نفسك فيها وأنت فخور بنفسك 🌟`,
    image:
      "https://i.pinimg.com/736x/09/5b/2b/095b2b139a64473ac1dc34b68b2f3b25.jpg",
    accent: "#6ec99a",
  },

  {
    id: "card-4",
    description: `I hope you always stay hopeful, strong, and proud of the person you are becoming

مهما كانت الأيام صعبة، أتمنى تفضل مؤمن بنفسك وبقدرتك إنك تتخطى أي حاجة وتبدأ من جديد`,
    image:
      "https://i.pinimg.com/736x/9c/88/4c/9c884c051c2a1e18f4d7684c7559a4fe.jpg",
    accent: "#c96e8a",
  },

  {
    id: "card-5",
    description: `No matter where life takes you, I hope you always find reasons to smile and keep going

يارب يفتحلك أبواب الخير والتوفيق من حيث لا تحتسب، وتكون أيامك مليانة بركة وسعادة ✨`,
    image:
      "https://i.pinimg.com/736x/0d/dc/68/0ddc681ff9575b9b435852b21424bc54.jpg",
    accent: "#c9a96e",
  },

  {
    id: "card-6",
    description: `May Allah protect your kindness and never let the world harden your beautiful heart 🤍 and may Allah keep you surrounded with love, guidance, and people who appreciate your real self
ما تتغيرش يا أيمن 🤍
ربنا يثبتك على الخير ويخلي قلبك دايمًا نضيف، ويزيدك بركة وراحة في كل خطوة في حياتك`,
    image:
      "https://i.pinimg.com/736x/6b/33/d9/6b33d90547705a0f63a819d27b50457f.jpg",
    accent: "#a96ec9",
  },

  {
    id: "card-7",
        description: `كل حلم جواك محتاج منك إيمان، صبر، ومحاولة مستمرة، وربنا عمره ما بيضيع تعب حد ✨

No dream is too big for Allah 🤍`,

    image:
      "https://i.pinimg.com/736x/54/cf/80/54cf801d4b927c73eb83583d53c60f2e.jpg",
    accent: "#6ec99a",
  },

  {
    id: "card-8",
    description: `Every failure experience is a lesson from Allah preparing you for a bigger and more beautiful success than you imagine ✨

ساعات بنقع عشان نتعلم نقوم أقوى، والفشل مجرد محطة مؤقتة مش نهاية الطريق `,
    image:
      "https://i.pinimg.com/736x/fa/22/88/fa228844da0eb8d0ebb50cf844aa1af8.jpg",
    accent: "#c9a96e",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* BACKGROUND                                                  */
/* ─────────────────────────────────────────────────────────── */

const stars = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: `${Math.random() * 5}s`,
}));

function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: 0.7,
            animation: `twinkle 3s ${s.delay} infinite alternate`,
          }}
        />
      ))}

      <style>{`
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
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* MAIN                                                         */
/* ─────────────────────────────────────────────────────────── */

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCard, setActiveCard] = useState<
    (typeof CARDS)[0] | null
  >(null);

  const leftCards = CARDS.slice(0, 4);
  const rightCards = CARDS.slice(4, 8);

  useEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-card",
        {
          opacity: 0,
          y: 80,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openCard = useCallback((card: (typeof CARDS)[0]) => {
    setActiveCard(card);
  }, []);

  const closeCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#070709] overflow-hidden"
    >
      <Background />

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#070709]/75 border-b border-white/5">
        <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
          <h1
            className="font-display italic text-[#f0ede8] leading-tight"
            style={{
              fontSize: "clamp(1.5rem,4vw,2.8rem)",
            }}
          >
            Messages for{" "}
            <span className="text-[#c9a96e]">you</span>
          </h1>

          <p className="text-white/40 text-sm mt-2">
            Click on a card to open the full message
          </p>
        </div>
      </div>

      {/* SMALL SPACE */}
      <div className="h-[4vh]" />

      {/* GRID */}
      <div
        ref={gridRef}
        className="
          relative
          z-10
          max-w-[1180px]
          mx-auto
          px-3
          sm:px-5
          lg:px-8
          pb-24
          flex
          gap-3
          sm:gap-5
        "
      >
        {/* LEFT */}
        <div className="flex flex-col gap-3 sm:gap-5 flex-1">
          {leftCards.map((card) => (
            <GalleryCard
              key={card.id}
              card={card}
              onClick={() => openCard(card)}
            />
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3 sm:gap-5 flex-1 mt-10 sm:mt-20">
          {rightCards.map((card) => (
            <GalleryCard
              key={card.id}
              card={card}
              onClick={() => openCard(card)}
            />
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {activeCard && (
          <Lightbox card={activeCard} onClose={closeCard} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* CARD                                                         */
/* ─────────────────────────────────────────────────────────── */

function GalleryCard({
  card,
  onClick,
}: {
  card: (typeof CARDS)[0];
  onClick: () => void;
}) {
  return (
    <div
      className="
        gallery-card
        relative
        overflow-hidden
        cursor-pointer
        group
      "
      style={{
        borderRadius: "18px",

        /* PERFECT SIZE */
        aspectRatio: "0.72",

        /* DESKTOP SIZE */
        maxHeight: "560px",

        /* MOBILE */
        minHeight: "240px",

        border: "1px solid rgba(255,255,255,0.07)",
        background: "#111",

        boxShadow: "0 20px 40px rgba(0,0,0,0.55)",

        transition:
          "transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-8px) scale(1.01)";

        e.currentTarget.style.boxShadow = `
          0 35px 70px rgba(0,0,0,0.75),
          0 0 30px ${card.accent}35
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";

        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(0,0,0,0.55)";
      }}
    >
      {/* IMAGE */}
      <img
        src={card.image}
        loading="lazy"
        decoding="async"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />

      {/* OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.02) 100%)",
        }}
      />

      {/* GLOW */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${card.accent}55`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* LIGHTBOX                                                     */
/* ─────────────────────────────────────────────────────────── */

function Lightbox({
  card,
  onClose,
}: {
  card: (typeof CARDS)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        p-3
        sm:p-6
      "
      onClick={onClose}
    >
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/92 backdrop-blur-xl" />

      {/* CARD */}
      <motion.div
        initial={{
          scale: 0.88,
          opacity: 0,
          y: 40,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        exit={{
          scale: 0.92,
          opacity: 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          z-10
          w-full
          max-w-[920px]
          overflow-hidden
          flex
          flex-col
        "
        style={{
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#090909",

          /* IMPORTANT */
          maxHeight: "92vh",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            z-30
            w-10
            h-10
            rounded-full
            bg-black/80
            backdrop-blur-md
            border
            border-white/10
            flex
            items-center
            justify-center
            text-white
            hover:bg-black
            transition-colors
          "
        >
          <X size={17} />
        </button>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto">
          {/* IMAGE */}
          <div
            className="
              relative
              w-full
              flex
              items-center
              justify-center
              bg-[#050505]
            "
            style={{
              height: "clamp(260px, 55vh, 520px)",
            }}
          >
            {/* FULL IMAGE NO CROP */}
            <img
              src={card.image}
              className="w-full h-full"
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          {/* TEXT */}
          <div className="px-5 sm:px-8 py-6 sm:py-8 bg-[#0c0c0f]">
            <h2
              className="
                text-[#f0ede8]
                font-display
                italic
                mb-5
                leading-tight
              "
              style={{
                fontSize: "clamp(1.6rem,4vw,3rem)",
              }}
            >
            </h2>

            {/* FULL TEXT */}
            <p
              className="
                text-[#f0ede8]/75
                whitespace-pre-line
                leading-[1.9]
              "
              style={{
                fontSize: "clamp(.95rem,1.4vw,1.05rem)",
              }}
            >
              {card.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}