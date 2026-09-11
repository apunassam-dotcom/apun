"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Loader2, Plus, Edit2, Trash2, Eye } from "lucide-react";

interface SectorData {
  id: string;
  title: string;
  slug: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchSectors = async () => {
    try {
      const q = query(collection(db, "sectors"), orderBy("createdAt", "desc"));
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

  useEffect(() => {
    fetchSectors();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to unpublish and delete "${title}"? This cannot be undone.`)) {
      return;
    }
    
    setDeleteLoading(id);
    try {
      await deleteDoc(doc(db, "sectors", id));
      setSectors(sectors.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting sector:", error);
      alert("Failed to delete sector.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 text-sm font-medium">Manage your Case Studies and Sectors</p>
        </div>
        <Link 
          href="/admin/sectors/create" 
          className="bg-[#1E4BB5] hover:bg-[#153a96] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Create Case Study
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Published Sectors</h3>
          <p className="text-4xl font-black text-gray-900">{loading ? "-" : sectors.length}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">All Content</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E4BB5]" />
          </div>
        ) : sectors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No case studies found. Click "Create Case Study" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-widest font-bold text-gray-500 bg-gray-50">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sectors.map((sector) => (
                  <tr key={sector.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900">{sector.title}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-medium">/{sector.slug}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-medium">
                      {sector.createdAt ? new Date(sector.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/sectors/${sector.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-[#1E4BB5] hover:bg-blue-50 rounded-xl transition-colors tooltip"
                          title="View Live"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/sectors/${sector.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(sector.id, sector.title)}
                          disabled={deleteLoading === sector.id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                          title="Unpublish (Delete)"
                        >
                          {deleteLoading === sector.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
