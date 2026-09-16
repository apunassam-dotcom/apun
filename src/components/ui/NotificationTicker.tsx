"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  content: string;
}

export function NotificationTicker() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveNotifications = async () => {
      try {
        // We removed orderBy to avoid the Firebase Index requirement!
        const q = query(
          collection(db, "notifications"),
          where("isHidden", "==", false)
        );
        const snapshot = await getDocs(q);
        const fetchedNotifications: (Notification & { createdAt?: any })[] = [];
        
        snapshot.forEach((doc) => {
          fetchedNotifications.push({ 
            id: doc.id, 
            content: doc.data().content,
            createdAt: doc.data().createdAt?.toMillis() || 0
          });
        });

        // Sort them on the frontend instead of the database!
        fetchedNotifications.sort((a, b) => b.createdAt - a.createdAt);

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveNotifications();
  }, []);

  if (loading || notifications.length === 0) {
    return null; // Don't render if loading or no active notifications
  }

  // Create enough duplicates to ensure it fills even ultrawide screens smoothly
  const duplicatedNotifications = [...notifications, ...notifications, ...notifications, ...notifications];

  return (
    <div className="bg-[#1E4BB5] text-white py-3 overflow-hidden flex relative z-50 items-center">
      {/* Left/Right fading gradients for a premium feel */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#1E4BB5] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1E4BB5] to-transparent z-10 pointer-events-none"></div>
      
      <motion.div
        className="flex shrink-0 w-fit"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40, // Increased duration for a much smoother, slower crawl
        }}
      >
        {/* First Half */}
        <div className="flex shrink-0 items-center gap-16 pr-16">
          {duplicatedNotifications.map((n, i) => (
            <div key={`set1-${i}`} className="flex items-center gap-16">
              <span className="font-semibold text-sm sm:text-base tracking-wide whitespace-nowrap">
                {n.content}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 block"></span>
            </div>
          ))}
        </div>
        
        {/* Second Half (Exact Duplicate to create the seamless loop) */}
        <div className="flex shrink-0 items-center gap-16 pr-16">
          {duplicatedNotifications.map((n, i) => (
            <div key={`set2-${i}`} className="flex items-center gap-16">
              <span className="font-semibold text-sm sm:text-base tracking-wide whitespace-nowrap">
                {n.content}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 block"></span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
