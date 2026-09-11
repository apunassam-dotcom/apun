"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Play } from "lucide-react";
import { LogoArcIcon } from "@/components/ui";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 relative pt-24 pb-12 overflow-hidden mt-10"
      aria-label="Introduction"
    >
      {/* Background decorations - Hidden from screen readers */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#1E4BB5]/10 via-[#06B6D4]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <div
              aria-hidden="true"
              className="h-px w-5 md:w-12 bg-gradient-to-r from-[#1E4BB5] to-[#06B6D4]"
            />
            <span className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.2em] text-[#1E4BB5]">
              Bridging Communities Across Assam
            </span>
          </motion.div>

          {/* Main Headline - Accessible grouping */}
          <h1
            className="text-[14vw] md:text-[11vw] lg:text-[9vw] font-black leading-[0.85] tracking-tighter mb-12"
            aria-label="Activate Upliftment Nurture"
          >
            <motion.span
              aria-hidden="true"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              ACTIVATE
            </motion.span>
            <motion.span
              aria-hidden="true"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block text-gradient"
            >
              UPLIFTMENT
            </motion.span>
            <motion.span
              aria-hidden="true"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block relative"
            >
              NURTURE
            </motion.span>
          </h1>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl md:rounded-3xl overflow-hidden mb-12 group"
        >
          <Image
            src="/herosection2.jpeg"
            alt="Community empowerment in Assam - APUN"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          {/* Gradient overlays */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#1E4BB5]/20 to-transparent pointer-events-none"
          />

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur-md rounded-xl px-5 py-3 shadow-lg"
          >
            <p className="text-xs md:text-sm font-bold text-[#1E4BB5] uppercase tracking-wider">
              Empowering Communities
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
              Across Assam and North East
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Content */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-8"
          >
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-lg leading-relaxed font-medium">
              The Association for People&apos;s Upliftment and Nurturing is
              building a{" "}
              <strong className="text-[#1E4BB5]">resilient ecosystem</strong> of
              grassroots empowerment in Assam.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {/* Replaced MagneticButton with a standard motion-wrapped Link */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="#connect"
                  className="w-full h-16 px-8 flex items-center justify-center text-sm font-semibold uppercase tracking-tight bg-[#1E4BB5] text-white rounded-full hover:bg-[#153a8f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-2 shadow-lg shadow-blue-500/20"
                  aria-label="Go to contact section"
                >
                  Explore Our Work
                </Link>
              </motion.div>

              {/* Watch Story Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="#vision"
                  className="w-full h-16 flex items-center justify-center gap-3 px-6 rounded-full border-2 border-gray-200 hover:border-[#1E4BB5] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-2"
                  aria-label="Scroll to vision section"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1E4BB5] flex items-center justify-center shrink-0">
                    <Play
                      size={16}
                      className="text-white ml-0.5"
                      fill="white"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-tight text-gray-900">
                    Watch Story
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-end items-end"
            aria-hidden="true"
          >
            <div className="relative">
              <LogoArcIcon className="w-48 md:w-64 h-24 md:h-32 text-[#1E4BB5] opacity-30 hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F9FAFB] pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
      </div>
    </section>
  );
};
