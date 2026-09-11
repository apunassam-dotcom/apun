"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor: React.FC = () => {
  // 1. Use Framer Motion values to prevent continuous React re-renders (fixes lag/dropped clicks)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfigMain = { damping: 25, stiffness: 300, mass: 0.5 };
  const springConfigTrailing = { damping: 40, stiffness: 200, mass: 0.8 };

  const cursorX = useSpring(mouseX, springConfigMain);
  const cursorY = useSpring(mouseY, springConfigMain);

  const trailingX = useSpring(mouseX, springConfigTrailing);
  const trailingY = useSpring(mouseY, springConfigTrailing);

  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update motion values directly (does not trigger a React re-render)
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer") // Added to catch icons nested inside clickable divs
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed z-[9999] hidden lg:block"
        style={{
          // 2. Enforce pointer-events explicitly so it NEVER blocks clicks
          pointerEvents: "none",
          x: cursorX,
          y: cursorY,
          // Automatically centers the div exactly on the mouse point
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 48 : 16,
          height: isHovering ? 48 : 16,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-300 ${
            isHovering
              ? "bg-[#1E4BB5]/20 border-2 border-[#1E4BB5]"
              : "bg-gradient-to-br from-[#1E4BB5] to-[#06B6D4]"
          }`}
        />
      </motion.div>

      {/* Trailing cursor */}
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-[#1E4BB5]/30 z-[9998] hidden lg:block"
        style={{
          pointerEvents: "none",
          x: trailingX,
          y: trailingY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
};
