"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import type { MenuOverlayProps } from "@/types";

const MENU_ITEMS = [
  { label: "Vision", href: "#vision" },
  { label: "Initiatives", href: "#initiatives" },
  { label: "Connect", href: "#connect" },
] as const;

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/apun.org.in?igsh=bTR6bDk3aWxoNm84",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/apun/?viewAsMember=true",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1B55w4NPdv/?mibextid=wwXIfr",
  },
] as const;

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{
            // Forces GPU hardware acceleration in Safari to prevent lag
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
            // Pre-calculates the animation pipeline
            willChange: "clip-path",
          }}
          className="fixed inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0F0F18] to-[#1A1A24] z-[100] flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 md:p-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-mono opacity-40 uppercase tracking-[0.3em] text-white"
            >
              Navigation
            </motion.span>
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-8">
            <nav className="space-y-1 md:space-y-2">
              {MENU_ITEMS.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={onClose}
                  className="group flex items-center justify-between py-3 md:py-5 border-b border-white/10 hover:border-[#1E4BB5] transition-colors"
                >
                  <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white group-hover:text-gradient transition-all duration-300">
                    {item.label}
                  </span>
                  <ArrowUpRight
                    size={32}
                    className="text-white/20 group-hover:text-[#1E4BB5] group-hover:rotate-45 transition-all duration-300 hidden sm:block"
                  />
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 md:p-12 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-6">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-sm text-white/50 hover:text-white transition-colors font-medium"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <p className="text-sm text-white/30 font-mono">Assam • India</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
