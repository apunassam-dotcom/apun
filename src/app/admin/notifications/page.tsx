"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  EyeOff, 
  Eye, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Notification {
  id: string;
  content: string;
  isHidden: boolean;
  createdAt: Timestamp;
}

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({ content: "", isHidden: false });
  const [saving, setSaving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "notifications"), orderBy("createdAt", sortOrder));
      const querySnapshot = await getDocs(q);
      const fetchedNotifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        fetchedNotifications.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [sortOrder]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setSaving(true);
    try {
      if (editingNotification) {
        await updateDoc(doc(db, "notifications", editingNotification.id), {
          content: formData.content,
          isHidden: formData.isHidden,
        });
      } else {
        await addDoc(collection(db, "notifications"), {
          content: formData.content,
          isHidden: formData.isHidden,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
      setEditingNotification(null);
      setFormData({ content: "", isHidden: false });
      fetchNotifications();
    } catch (error) {
      console.error("Error saving notification:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await deleteDoc(doc(db, "notifications", id));
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const toggleVisibility = async (notification: Notification) => {
    try {
      await updateDoc(doc(db, "notifications", notification.id), {
        isHidden: !notification.isHidden,
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const openModal = (notification?: Notification) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({ content: notification.content, isHidden: notification.isHidden });
    } else {
      setEditingNotification(null);
      setFormData({ content: "", isHidden: false });
    }
    setIsModalOpen(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-1">Manage the scrolling notification banner on the homepage</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E4BB5] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add Notification</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Sort by Date:</span>
            <select 
              className="text-sm border-gray-300 rounded-md focus:ring-[#1E4BB5] focus:border-[#1E4BB5]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <span className="text-sm text-gray-500">Total: {notifications.length}</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 text-[#1E4BB5] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            No notifications found. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500 bg-gray-50">
                  <th className="p-4">Content</th>
                  <th className="p-4 w-32 text-center">Status</th>
                  <th className="p-4 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="text-gray-900 font-medium line-clamp-2">{notification.content}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleString() : "Just now"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.isHidden 
                          ? "bg-gray-100 text-gray-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {notification.isHidden ? "Hidden" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(notification)}
                          className={`p-2 rounded-lg transition-colors ${
                            notification.isHidden 
                              ? "text-gray-400 hover:text-green-600 hover:bg-green-50" 
                              : "text-green-600 hover:text-gray-600 hover:bg-gray-100"
                          }`}
                          title={notification.isHidden ? "Show Notification" : "Hide Notification"}
                        >
                          {notification.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => openModal(notification)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingNotification ? "Edit Notification" : "Create Notification"}
              </h2>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E4BB5] focus:border-[#1E4BB5] transition-all resize-none"
                    placeholder="Enter the notification text here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isHidden"
                    className="w-4 h-4 text-[#1E4BB5] border-gray-300 rounded focus:ring-[#1E4BB5]"
                    checked={formData.isHidden}
                    onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                  />
                  <label htmlFor="isHidden" className="text-sm text-gray-700">
                    Hide this notification from the public
                  </label>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.content.trim()}
                  className="px-4 py-2 bg-[#1E4BB5] text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  Save Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
