"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut, Loader2, Menu, X, Bell } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Contacts", href: "/admin/contacts", icon: FileText },
    { label: "Create Sector", href: "/admin/sectors/create", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Fixed on Desktop, Off-Canvas on Mobile) */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-[100] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50/50">
          <h1 className="text-gray-900 text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#1E4BB5] to-[#38bdf8]">
            APUN Admin
          </h1>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for dashboard, prefix match for others to keep active state when editing
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold group ${
                  isActive 
                    ? "bg-gradient-to-r from-[#1E4BB5] to-[#2A5BC7] text-white shadow-lg shadow-blue-500/25" 
                    : "text-gray-500 hover:text-[#1E4BB5] hover:bg-blue-50/50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-[#1E4BB5]"} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-4 w-full text-left text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
            <span className="text-sm tracking-wide">Secure Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#1E4BB5] animate-spin" />
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-gray-900 flex flex-col md:flex-row font-sans selection:bg-[#1E4BB5] selection:text-white">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-[80] bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-gray-900 text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#1E4BB5] to-[#38bdf8]">
          APUN Admin
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 hover:text-[#1E4BB5] hover:bg-blue-50 transition-colors shadow-sm"
        >
          <Menu size={20} />
        </button>
      </header>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 md:ml-72 p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto w-full max-w-[100vw] min-h-[calc(100vh-64px)] md:min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RequireAuth>{children}</RequireAuth>
    </AuthProvider>
  );
}
