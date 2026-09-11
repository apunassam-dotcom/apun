"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { Loader2, ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { MenuOverlay } from "@/components/sections/MenuOverlay";

interface SectorData {
  id: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  contentBlocks: Array<{ type: "h2" | "p" | "image" | "bullet" | "break"; content: string | string[] }>;
  slug: string;
  createdAt: any;
  updatedAt?: any;
}

interface SectionData {
  heading?: string;
  texts: Array<{ type: "p" | "bullet"; content: string | string[] }>;
  images: string[];
}

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl group">
        <Image 
          src={images[0]} 
          alt="" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl group">
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((url, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            <Image src={url} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
      
      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md hover:bg-black/40 hover:scale-110 z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md hover:bg-black/40 hover:scale-110 z-20"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default function SectorDetails() {
  const { slug } = useParams();
  const [sector, setSector] = useState<SectorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 150]);

  const sections = useMemo(() => {
    if (!sector?.contentBlocks) return [];
    const secs: SectionData[] = [];
    let currentSec: SectionData = { texts: [], images: [] };
    
    sector.contentBlocks.forEach(block => {
      if (block.type === 'h2') {
        if (currentSec.heading || currentSec.texts.length > 0 || currentSec.images.length > 0) {
          secs.push(currentSec);
          currentSec = { texts: [], images: [] };
        }
        currentSec.heading = block.content as string;
      } else if (block.type === 'p' || block.type === 'bullet') {
        currentSec.texts.push(block as any);
      } else if (block.type === 'image' && Array.isArray(block.content)) {
        currentSec.images.push(...block.content);
      }
    });
    if (currentSec.heading || currentSec.texts.length > 0 || currentSec.images.length > 0) {
      secs.push(currentSec);
    }
    return secs;
  }, [sector]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sections.length / itemsPerPage);
  const currentSections = sections.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchSector = async () => {
      try {
        const q = query(collection(db, "sectors"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          
          // Normalize older string data to arrays for frontend
          const normalizedBlocks = (docData.contentBlocks || []).map((b: any) => {
            if (b.type === 'bullet' && typeof b.content === 'string') return { ...b, content: [b.content] };
            if (b.type === 'image' && typeof b.content === 'string') return { ...b, content: b.content ? [b.content] : [] };
            return b;
          });

          setSector({ 
            id: snapshot.docs[0].id, 
            ...docData,
            contentBlocks: normalizedBlocks 
          } as SectorData);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchSector();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1E4BB5]" />
      </div>
    );
  }

  if (!sector) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Sector Not Found</h1>
        <p className="text-gray-500 mb-10 text-lg max-w-md">The initiative you are looking for doesn't exist or has been removed.</p>
        <Link href="/" className="px-8 py-4 bg-[#1E4BB5] text-white rounded-2xl font-semibold hover:bg-[#153a96] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          Return Home
        </Link>
      </div>
    );
  }

  const formattedDate = sector.createdAt ? new Date(sector.createdAt.seconds * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : "Recent Updates";

  const updatedDate = sector.updatedAt ? new Date(sector.updatedAt.seconds * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : formattedDate;

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#1E4BB5]/20 selection:text-[#1E4BB5]">
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hero Section - Matching Homepage Aesthetic */}
      <header className="pt-40 pb-16 md:pt-56 md:pb-24 px-6 md:px-12 max-w-[90rem] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12"
        >
          <div className="max-w-4xl flex-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#1E4BB5] animate-pulse" />
              <span className="text-[#1E4BB5] font-bold uppercase tracking-widest text-xs">Sector Overview</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-black text-gray-900 uppercase tracking-tighter leading-[1.05] break-words">
              {sector.title}
            </h1>
          </div>
          <div className="max-w-lg md:pb-4">
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-[#1E4BB5]/20 pl-6 py-2">
              {sector.shortDescription}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%] md:h-[130%] md:-top-[15%]">
            <Image
              src={sector.coverImage}
              alt={sector.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-12 pb-12 md:pb-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          {/* Metadata Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-white/50 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-sm mb-16 mt-[-4rem] relative z-30 w-[95%] md:w-[90%] mx-auto">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 flex items-center justify-center text-[#1E4BB5] shadow-inner">
                <Calendar size={24} />
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Published</span>
                  <span className="text-sm font-bold text-gray-900">{formattedDate}</span>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Updated At</span>
                  <span className="text-sm font-bold text-gray-900">{updatedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2">Share</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin, LinkIcon].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:bg-[#1E4BB5] hover:text-white hover:border-[#1E4BB5] hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Sections (Alternating Layout) */}
          <div className="space-y-16">
            {currentSections.length > 0 ? (
              currentSections.map((section, idx) => {
                const absoluteIndex = (currentPage - 1) * itemsPerPage + idx;
                const isImageLeft = absoluteIndex % 2 === 0;
                
                const hasImages = section.images.length > 0;
                const hasTexts = section.heading || section.texts.length > 0;

                const renderImages = () => {
                  if (!hasImages) return null;
                  
                  const borderClasses = isImageLeft 
                    ? "border-t-[8px] border-l-[8px] top-0 left-0 rounded-tl-[2rem] md:rounded-tl-[3rem] border-[#1E4BB5]/20" 
                    : "border-b-[8px] border-r-[8px] bottom-0 right-0 rounded-br-[2rem] md:rounded-br-[3rem] border-[#1E4BB5]/20";
                  
                  const borderParentPadding = isImageLeft ? 'md:pt-8 md:pl-8 lg:pt-10 lg:pl-10' : 'md:pb-8 md:pr-8 lg:pb-10 lg:pr-10';

                  return (
                    <div className="relative w-full flex justify-center items-center md:block">
                      <div className={`hidden md:block absolute w-[70%] h-[70%] -z-10 ${borderClasses} transition-all duration-500`} />
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`relative w-full max-w-[90%] sm:max-w-[80%] md:max-w-none ${borderParentPadding} mx-auto md:mx-0`}
                      >
                        <ImageCarousel images={section.images} />
                      </motion.div>
                    </div>
                  );
                };

                const renderTexts = () => {
                  if (!hasTexts) return null;
                  return (
                    <div className="flex flex-col justify-start w-full px-2 md:px-0">
                      {section.heading && (
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 rounded-full border-2 border-blue-100 flex items-center justify-center text-[#1E4BB5]">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                           </div>
                           <span className="text-[#1E4BB5] font-bold text-sm tracking-wider uppercase">{sector.title}</span>
                        </div>
                      )}
                      
                      {section.heading && (
                        <>
                          <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-4xl md:text-[3.5rem] font-black text-[#0A1931] tracking-tight leading-[1.1] mb-8"
                          >
                            {section.heading}
                          </motion.h2>
                          <div className="w-20 h-1 bg-[#1E4BB5] mb-8"></div>
                        </>
                      )}

                      <div className="space-y-6">
                        {section.texts.map((block, blockIdx) => {
                          if (block.type === 'p') {
                            return (
                              <motion.p 
                                key={blockIdx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium break-words md:leading-loose"
                              >
                                {block.content}
                              </motion.p>
                            );
                          }
                          if (block.type === 'bullet' && Array.isArray(block.content)) {
                            return (
                              <motion.div 
                                key={blockIdx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="my-8 space-y-5 bg-blue-50/30 p-6 md:p-8 rounded-3xl border border-blue-50/50"
                              >
                                {block.content.map((point, ptIdx) => (
                                  <div key={ptIdx} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                      <div className="w-2 h-2 rounded-full bg-[#1E4BB5]"></div>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-[1.8] font-medium">{point}</p>
                                  </div>
                                ))}
                              </motion.div>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <Link href="/#connect" className="mt-10 inline-flex items-center justify-center px-8 py-4 bg-[#1E4BB5] text-white rounded-2xl font-semibold hover:bg-[#153a96] transition-all hover:shadow-xl hover:-translate-y-1 w-fit group">
                        Become a Partner <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  );
                };

                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start py-12 md:py-16">
                    {(!hasImages || !hasTexts) ? (
                      <div className="w-full md:col-span-2">
                        {hasImages && renderImages()}
                        {hasTexts && renderTexts()}
                      </div>
                    ) : isImageLeft ? (
                      <>
                        <div className="w-full order-2 md:order-1">{renderImages()}</div>
                        <div className="w-full order-1 md:order-2">{renderTexts()}</div>
                      </>
                    ) : (
                      <>
                        <div className="w-full order-1">{renderTexts()}</div>
                        <div className="w-full order-2">{renderImages()}</div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center italic py-10">No detailed content available for this sector.</p>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 mt-10 border-t border-gray-100">
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                        currentPage === i + 1 
                          ? "bg-[#1E4BB5] text-white shadow-md" 
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    );
  }
