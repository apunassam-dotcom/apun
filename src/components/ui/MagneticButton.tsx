"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { MagneticButtonProps, Position } from "@/types";

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = "",
    variant = "primary",
}) => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    const baseStyles = variant === "primary"
        ? "bg-gradient-to-r from-[#1E4BB5] to-[#3B6FE8] text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
        : "bg-white text-[#1E4BB5] shadow-lg hover:shadow-xl";

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-8 py-4 rounded-full font-bold uppercase tracking-tight transition-all duration-300 overflow-hidden group ${baseStyles} ${className}`}
        >
            <span className="relative z-10 flex items-center gap-2 text-sm">{children}</span>

            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
        </motion.button>
    );
};
