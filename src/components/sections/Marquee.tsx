"use client";

import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "Grassroots Impact",
  "Inclusive Welfare",
  "Sustainable Action",
  "Community First",
  "Youth Empowerment",
];

// Tripling the items ensures the array is wide enough for large monitors
const REPEATED_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export const Marquee: React.FC = () => {
  return (
    <div
      className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-r from-[#0A0A0F] via-[#1A1A24] to-[#0A0A0F]"
      aria-label="Core Values Marquee"
    >
      {/* Top gradient fade */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E4BB5]/50 to-transparent"
      />

      {/* PERFORMANCE FIX: Replaced CPU-heavy CSS Masking with simple absolute gradients.
        Because your background edges are #0A0A0F, these perfectly mimic the fade without lagging Safari.
      */}
      <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-[#0A0A0F] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-[#0A0A0F] to-transparent pointer-events-none" />

      {/* First row - Moving Left */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
          style={{
            // Forces Safari to use hardware acceleration (GPU) for this layer
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          className="flex w-max"
        >
          {/* We render exactly two identical halves. Moving by -50% creates a perfect infinite loop. */}
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16"
              aria-hidden={setIndex === 1 ? "true" : "false"}
            >
              {REPEATED_ITEMS.map((item, j) => (
                <div
                  key={`${setIndex}-${j}`}
                  className="flex items-center gap-8 md:gap-16"
                >
                  <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase">
                    {item}
                  </span>
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-[#1E4BB5] to-[#06B6D4] animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row - Moving Right */}
      <div className="flex whitespace-nowrap overflow-hidden mt-6 md:mt-10 opacity-40">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
          style={{
            // Forces Safari to use hardware acceleration (GPU) for this layer
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          className="flex w-max"
        >
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16"
              aria-hidden="true" // Hide entirely from screen readers to prevent spam
            >
              {[...REPEATED_ITEMS].reverse().map((item, j) => (
                <div
                  key={`${setIndex}-${j}`}
                  className="flex items-center gap-8 md:gap-16"
                >
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase">
                    {item}
                  </span>
                  <div className="w-2 h-2 md:w-3 md:h-3 rotate-45 bg-white/30" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent"
      />
    </div>
  );
};
