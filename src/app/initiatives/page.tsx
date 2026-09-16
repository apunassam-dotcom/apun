"use client";

import { useState } from "react";
import {
  Navbar,
  MenuOverlay,
  SectorsSection,
  Footer,
} from "@/components";

export default function InitiativesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className="relative overflow-x-hidden bg-[#F9FAFB] text-[#000000] font-sans selection:bg-[#1E4BB5] selection:text-white min-h-screen flex flex-col">
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Spacer to push content down below the fixed Navbar */}
      <div className="pt-24 md:pt-32 flex-grow">
        <SectorsSection />
      </div>

      <Footer />
    </div>
  );
}
