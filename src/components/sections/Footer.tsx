"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const links = {
  platform: ["Vision", "Initiatives", "Connect"],
  socials: [
    {
      name: "Instagram",
      url: "https://www.instagram.com/apun.org.in?igsh=bTR6bDk3aWxoNm84",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/1B55w4NPdv/?mibextid=wwXIfr",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/apun/?viewAsMember=true",
    },
  ],
};

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbySjpkbrRaUKN7BTm4LqRJWBFdJbGIb6S7Aw81WriA54N-B3vuByXt3WM8wZLthjWg0/exec";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // States for newsletter subscription
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");

    const formToSubmit = new URLSearchParams();
    formToSubmit.append("name", "Newsletter Subscriber");
    formToSubmit.append("email", email);
    formToSubmit.append("message", "Subscribed to newsletter.");
    formToSubmit.append("sheetName", "Newsletter");

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formToSubmit,
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <footer
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-100"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-16">
          <div className="max-w-md">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block mb-6"
            >
              <Link
                href="/"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] rounded-md"
                aria-label="Return to homepage"
              >
                <Image
                  src="/logo.svg"
                  alt="APUN Logo"
                  width={180}
                  height={60}
                  className="h-12 md:h-14 w-auto"
                />
              </Link>
            </motion.div>
            <p className="text-gray-500 leading-relaxed">
              Association for People&apos;s Upliftment and Nurturing. Uplifting
              communities through inclusive, compassionate, and sustainable
              development.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-16">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">
                Platform
              </h3>
              <ul className="space-y-3">
                {links.platform.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-sm font-semibold text-gray-700 hover:text-[#1E4BB5] transition-colors flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] rounded-sm w-max"
                    >
                      {link}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">
                Socials
              </h3>
              <ul className="space-y-3">
                {links.socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-700 hover:text-[#1E4BB5] transition-colors flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] rounded-sm w-max"
                    >
                      {social.name}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">
                Newsletter
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Stay updated with our initiatives.
              </p>

              <form
                className="flex flex-col gap-2 relative"
                onSubmit={handleSubscribe}
              >
                {/* Changed to flex-col on mobile, flex-row on sm screens and up */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "submitting" || status === "success"}
                    // Added w-full and sm:flex-1
                    className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-200 text-base focus:border-[#1E4BB5] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-1 disabled:opacity-70 disabled:bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting" || status === "success"}
                    // Added w-full on mobile, auto width on sm screens. Moved margin logic here.
                    className="w-full sm:w-auto px-6 py-3 cursor-pointer sm:mr-2 md:mr-4 min-w-[80px] flex items-center justify-center bg-gradient-to-r from-[#1E4BB5] to-[#3B6FE8] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-2 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : status === "success" ? (
                      <CheckCircle2 size={16} aria-hidden="true" />
                    ) : (
                      "Join"
                    )}
                  </button>
                </div>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-600 font-medium absolute -bottom-5 left-1"
                  >
                    Subscribed successfully!
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium absolute -bottom-5 left-1"
                  >
                    Failed to subscribe. Try again.
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider text-center md:text-left">
              © {currentYear} APUN • Assam
            </p>
            <p className="text-xs text-gray-500 font-medium">
              Made with{" "}
              <span className="text-red-500" aria-hidden="true">
                ♥
              </span>
              <span className="sr-only">love</span> by{" "}
              <a
                href="https://softexedge.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-[#1E4BB5] transition-colors font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] rounded-sm"
              >
                Softexedge
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              Active Advocacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
