"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { LogoArcGrey } from "../ui/LogoArcGrey";

const contactInfo = [
  {
    label: "Location",
    value:
      "Ronga Bora, Chetia Chuk, Komar Gaon, Rajabheta 135 F.S., Nagakhalia Gaon, Assam 786004",
    icon: MapPin,
    href: "https://maps.app.goo.gl/jXMe8bgeV1xRDXCY7",
  },
  {
    label: "Email",
    value: "Info@apun.org.in",
    icon: Mail,
    href: "mailto:Info@apun.org.in",
  },
  {
    label: "Phone",
    value: "+91 7896889701 / +91 8099476614",
    icon: Phone,
    href: "tel:+917896889701",
  },
];

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbySjpkbrRaUKN7BTm4LqRJWBFdJbGIb6S7Aw81WriA54N-B3vuByXt3WM8wZLthjWg0/exec";

export const ContactSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formToSubmit = new URLSearchParams();
    formToSubmit.append("name", formData.name);
    formToSubmit.append("email", formData.email);
    formToSubmit.append("message", formData.message);
    formToSubmit.append("sheetName", "Form");
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formToSubmit,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="connect"
      aria-labelledby="contact-heading"
      className="relative py-16 sm:py-24 md:py-32 lg:py-40 px-5 sm:px-8 md:px-12 lg:px-24 bg-gradient-to-br from-[#0A0A0F] via-[#0F0F18] to-[#1A1A24] text-white overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <LogoArcGrey className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-auto rotate-12" />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-[#1E4BB5]/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"
      />

      <div
        ref={ref}
        className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
            Get in Touch
          </span>
          <h2
            id="contact-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.9]"
          >
            Let's Build <span className="text-gradient">Together.</span>
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-md mb-10 sm:mb-12">
            Ready to make an impact? Let's discuss how we can create meaningful
            change.
          </p>

          <ul className="space-y-3 sm:space-y-4 m-0 p-0 list-none">
            {contactInfo.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <a
                  href={item.href}
                  target={item.label === "Location" ? "_blank" : undefined}
                  rel={
                    item.label === "Location"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-start sm:items-center gap-4 p-3 sm:p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5]"
                  aria-label={`Contact us via ${item.label}`}
                >
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#1E4BB5] to-[#3B6FE8] flex items-center justify-center mt-1 sm:mt-0">
                    <item.icon
                      size={20}
                      aria-hidden="true"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">
                      {item.label}
                    </p>
                    <p className="font-semibold text-sm sm:text-base md:text-lg group-hover:text-[#06B6D4] transition-colors break-words">
                      {item.value}
                    </p>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[2rem] border border-white/10 relative"
        >
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center h-full py-12"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E4BB5] to-[#3B6FE8] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <CheckCircle2
                  size={40}
                  className="text-white"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                Thank you for your response!
              </h3>
              <p className="text-white/60 text-sm sm:text-base max-w-sm">
                Your message has been successfully sent. Our team will get back
                to you shortly.
              </p>
            </motion.div>
          ) : (
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 block mb-2 sm:mb-3"
                >
                  Your Name
                </label>
                {/* Changed text-sm sm:text-base to text-base to prevent iOS zoom */}
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Fullname"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-base focus:border-[#1E4BB5] outline-none transition-all font-medium placeholder:text-white/20 focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F0F18]"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 block mb-2 sm:mb-3"
                >
                  Email
                </label>
                {/* Changed text-sm sm:text-base to text-base to prevent iOS zoom */}
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-base focus:border-[#1E4BB5] outline-none transition-all font-medium placeholder:text-white/20 focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F0F18]"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 block mb-2 sm:mb-3"
                >
                  Message
                </label>
                {/* Changed text-sm sm:text-base to text-base to prevent iOS zoom */}
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-base focus:border-[#1E4BB5] outline-none transition-all font-medium placeholder:text-white/20 resize-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F0F18]"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full py-4 sm:py-5 text-sm sm:text-base bg-gradient-to-r cursor-pointer from-[#1E4BB5] to-[#3B6FE8] font-bold uppercase tracking-tight rounded-xl flex items-center justify-center gap-2 sm:gap-3 group hover:shadow-2xl hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4BB5] focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2
                      size={18}
                      className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send
                      size={18}
                      className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </>
                )}
              </motion.button>

              {submitStatus === "error" && (
                <p className="text-red-400 text-sm text-center mt-4">
                  Something went wrong. Please try again later.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
