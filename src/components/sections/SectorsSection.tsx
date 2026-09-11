"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { MagneticButton, LogoArcIcon } from "@/components/ui";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface SectorData {
  id: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  slug: string;
}

export const SectorsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const q = query(collection(db, "sectors"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SectorData[];
        setSectors(data);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSectors();
  }, []);

  return (
    <section
      id="initiatives"
      className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-[#FAFBFC] relative overflow-hidden"
      aria-labelledby="sectors-heading"
    >
      {/* Background decoration - Hidden from screen readers */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#1E4BB5]/5 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#1E4BB5]/10 text-[#1E4BB5] text-xs font-bold uppercase tracking-widest mb-4">
              What We Do
            </span>
            <h2
              id="sectors-heading"
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none"
            >
              Five Core <br />
              <span className="text-gradient">Sectors.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-500 max-w-sm text-sm md:text-base"
          >
            Targeted action across key areas for maximum community upliftment
            and sustainable impact.
          </motion.p>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-8 h-8 animate-spin text-[#1E4BB5]" />
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 list-none p-0 m-0">
            {sectors.map((sector, i) => (
              <motion.li
                key={sector.id}
                tabIndex={0}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] flex flex-col overflow-hidden border border-gray-100 hover:border-[#1E4BB5]/30 transition-all duration-500 shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAFBFC]"
                aria-label={`Explore ${sector.title} sector`}
              >
                <Link href={`/sectors/${sector.slug}`} className="flex flex-col h-full absolute inset-0 z-20">
                  <span className="sr-only">View {sector.title}</span>
                </Link>
                
                {/* Top Image Section (Edge-to-Edge) */}
                <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-50 shrink-0">
                  <Image
                    src={sector.coverImage || "/fallback-image.jpg"}
                    alt={`${sector.title} visualization`}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Optional dark overlay gradient for better contrast if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Bottom Content Section */}
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 bg-white">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#1E4BB5] transition-colors mb-3">
                    {sector.title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3">
                    {sector.shortDescription}
                  </p>
                </div>

                {/* Hover decoration */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-12 -right-12 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none z-0"
                >
                  <LogoArcIcon className="w-64 h-32 text-[#1E4BB5]" />
                </div>
              </motion.li>
            ))}

          {/* CTA Card */}
          <motion.li
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 0.98 }}
            className="relative bg-gradient-to-br from-[#1E4BB5] via-[#2A5BC7] to-[#3B6FE8] rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 flex flex-col justify-center items-center text-center text-white min-h-[380px] md:min-h-[420px] overflow-hidden group shadow-2xl shadow-blue-500/30"
          >
            {/* CTA Background Details */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-white/10 animate-float pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full border border-white/5 pointer-events-none"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="mb-6"
              >
                <Sparkles
                  aria-hidden="true"
                  className="w-12 h-12 md:w-16 md:h-16"
                />
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-black mb-3 leading-tight tracking-tight">
                Become a<br />
                Partner.
              </h3>
              <p className="text-white/70 text-sm mb-8 max-w-[200px] mx-auto">
                Join us in making a difference across Assam.
              </p>
              <Link href="/#connect" aria-label="Go to contact section">
                <MagneticButton
                  className="bg-white text-[#1E4BB5] text-xs hover:bg-gray-100 cursor-pointer"
                  variant="secondary"
                >
                  Apply Now
                </MagneticButton>
              </Link>
            </div>
          </motion.li>
        </ul>
        )}
      </div>
    </section>
  );
};
