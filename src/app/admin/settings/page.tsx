"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Key, Mail, Shield, User } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (!user) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updatePassword(user, newPassword);
      setMessage({ type: "success", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: "error", text: "This operation is sensitive and requires recent authentication. Please log out and log in again before retrying." });
      } else {
        setMessage({ type: "error", text: error.message || "Failed to update password." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmail = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage({ type: "success", text: "Password reset email sent." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send reset email." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Settings</h2>
        <p className="text-gray-500 text-sm font-medium">Manage your administrator account details.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 bg-blue-50 text-[#1E4BB5] rounded-2xl flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Administrator Profile</h3>
              <p className="text-sm font-medium text-gray-500">Your current session details.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl">
                <Mail size={18} className="text-gray-500" />
                <span className="text-gray-900 font-bold">{user?.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Account Status</label>
              <div className="flex items-center gap-3 px-4 py-4 bg-green-50 border border-green-100 rounded-xl">
                <Shield size={18} className="text-green-600" />
                <span className="text-green-700 font-bold tracking-wide">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Security & Password</h3>
              <p className="text-sm font-medium text-gray-500">Update your credentials.</p>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 font-bold focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 font-bold focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>
            
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="bg-[#1E4BB5] hover:bg-[#1E4BB5]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 flex-1"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Forgot Password?</h4>
            <p className="text-xs font-medium text-gray-500 mb-4">Send a password reset link to your registered email address.</p>
            <button
              onClick={handleResetEmail}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
