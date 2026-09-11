"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const stats = [
  { value: "2023", label: "Est. Year" },
  { value: "50+", label: "Volunteers" },
  { value: "1K+", label: "Lives Touched" },
];

export const AboutSection: React.FC = () => {
  // Added TypeScript strict typing for the ref
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="vision"
      className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background pattern - Hidden from screen readers */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
      >
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1E4BB5 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10"
      >
        {/* Left - Visual */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-square">
            {/* Main image card */}
            <motion.div
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
              animate={
                isInView
                  ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }
                  : {}
              }
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.77, 0, 0.175, 1],
              }}
              className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50"
            >
              <Image
                src="/about.jpeg"
                alt="A diverse group of APUN volunteers standing together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Floating stats card - Converted to a semantic list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-8 -right-4 md:-right-8 p-6 md:p-8 bg-gradient-to-br from-[#0A0A0F] to-[#1A1A24] text-white rounded-2xl md:rounded-3xl shadow-2xl"
            >
              <ul
                className="flex gap-6 md:gap-8 m-0 p-0 list-none"
                aria-label="Organization impact statistics"
              >
                {stats.map((stat, i) => (
                  <li key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-black tracking-tighter text-gradient">
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-mono uppercase opacity-50 tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Decorative elements - Hidden from screen readers */}
            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 w-24 h-24 border-2 border-[#1E4BB5]/20 rounded-full animate-float pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-[#1E4BB5] to-[#06B6D4] rounded-2xl opacity-20 rotate-12 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#1E4BB5]/10 text-[#1E4BB5] text-xs font-bold uppercase tracking-widest mb-6">
            The Foundation
          </span>

          <h2
            id="about-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Empower to <span className="text-gradient">Lead.</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
            APUN is a community-based non-profit organization dedicated to
            inclusive social development, humanitarian action, and grassroots
            empowerment. Formed in 2023 and officially registered in January
            2026 under the Societies Registration Act, 1860 (Government of
            Assam), APUN works closely with communities, youth, volunteers, and
            partner institutions. We believe lasting change begins at the{" "}
            <strong className="text-gray-900">grassroots</strong>—when people
            are
            <span className="text-[#1E4BB5] font-semibold">
              {" "}
              empowered to lead their own development
            </span>
            .
          </p>

          <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
            <div className="group">
              <div
                aria-hidden="true"
                className="w-10 h-1 bg-gradient-to-r from-[#1E4BB5] to-[#06B6D4] rounded-full mb-4 group-hover:w-16 transition-all duration-300"
              />
              {/* Changed from h4 to h3 to maintain proper semantic heading hierarchy */}
              <h3 className="font-bold text-sm uppercase tracking-wide mb-2">
                Our Vision
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Empowered, resilient communities where every individual lives
                with dignity.
              </p>
            </div>
            <div className="group">
              <div
                aria-hidden="true"
                className="w-10 h-1 bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] rounded-full mb-4 group-hover:w-16 transition-all duration-300"
              />
              {/* Changed from h4 to h3 to maintain proper semantic heading hierarchy */}
              <h3 className="font-bold text-sm uppercase tracking-wide mb-2">
                Our Mission
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                To uplift communities through inclusive and sustainable
                development.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
