"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/ui";
import type { NavbarProps } from "@/types";

export const Navbar: React.FC<NavbarProps> = ({ onMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-white"
      }`}
      aria-label="Main Navigation"
    >
      <motion.div whileHover={{ scale: 1.05 }} className="flex">
        <Link
          href="/"
          className="relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] rounded-md block"
          aria-label="Go to homepage"
        >
          <Image
            src="/logo.svg"
            alt="APUN Logo"
            width={120}
            height={40}
            className="h-14 md:h-20 w-auto"
            priority
          />
          <div
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#1E4BB5] to-[#06B6D4] w-0 group-hover:w-full transition-all duration-300"
            aria-hidden="true"
          />
        </Link>
      </motion.div>

      <div className="flex items-center gap-3 md:gap-4">
        <Link href="#connect" aria-label="Go to contact section">
          <MagneticButton className="hidden md:flex text-xs px-6 py-3 font-medium cursor-pointer">
            Let's Connect
          </MagneticButton>
        </Link>

        <motion.button
          onClick={onMenuOpen}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-[#0A0A0F] to-[#1A1A24] text-white rounded-2xl flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Open navigation menu"
          aria-haspopup="menu"
        >
          <Menu
            size={20}
            className="group-hover:scale-110 transition-transform"
            aria-hidden="true"
          />
        </motion.button>
      </div>
    </motion.nav>
  );
};
