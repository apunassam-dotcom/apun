"use client";

import { useState, useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import {
  GrainTexture,
  CustomCursor,
  Navbar,
  MenuOverlay,
  HeroSection,
  Marquee,
  AboutSection,
  SectorsSection,
  ContactSection,
  Footer,
} from "@/components";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div
      ref={containerRef}
      // ADDED: overflow-x-hidden right here
      className="relative overflow-x-hidden bg-[#F9FAFB] text-[#000000] font-sans selection:bg-[#1E4BB5] selection:text-white"
    >
      <GrainTexture />
      {/* <CustomCursor /> */}
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <HeroSection />
      <Marquee />
      <AboutSection />
      <SectorsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default App;
