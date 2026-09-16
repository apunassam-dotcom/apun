"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Trash2, 
  Mail,
  MailOpen,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
}

const ITEMS_PER_PAGE = 10;

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contact_submissions"), orderBy("createdAt", sortOrder));
      const querySnapshot = await getDocs(q);
      const fetchedSubmissions: ContactSubmission[] = [];
      querySnapshot.forEach((doc) => {
        fetchedSubmissions.push({ id: doc.id, ...doc.data() } as ContactSubmission);
      });
      setSubmissions(fetchedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [sortOrder]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, "contact_submissions", id));
      fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const toggleReadStatus = async (submission: ContactSubmission) => {
    try {
      await updateDoc(doc(db, "contact_submissions", submission.id), {
        isRead: !submission.isRead,
      });
      fetchSubmissions();
    } catch (error) {
      console.error("Error updating read status:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact Submissions</h1>
          <p className="text-gray-500 mt-1">Manage messages received from the landing page</p>
        </div>
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
          <span className="text-sm text-gray-500">Total: {submissions.length}</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 text-[#1E4BB5] animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            No contact submissions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500 bg-gray-50">
                  <th className="p-4 w-1/4">Sender Details</th>
                  <th className="p-4">Message</th>
                  <th className="p-4 w-32 text-center">Status</th>
                  <th className="p-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedSubmissions.map((submission) => (
                  <tr key={submission.id} className={`transition-colors ${submission.isRead ? 'bg-white hover:bg-gray-50/50' : 'bg-blue-50/30 hover:bg-blue-50/50'}`}>
                    <td className="p-4 align-top">
                      <p className="text-gray-900 font-semibold">{submission.name}</p>
                      <a href={`mailto:${submission.email}`} className="text-sm text-[#1E4BB5] hover:underline block mt-1">
                        {submission.email}
                      </a>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {submission.createdAt?.toDate ? submission.createdAt.toDate().toLocaleString() : "Just now"}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm">{submission.message}</p>
                    </td>
                    <td className="p-4 text-center align-top">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.isRead 
                          ? "bg-gray-100 text-gray-600" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {submission.isRead ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="p-4 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleReadStatus(submission)}
                          className={`p-2 rounded-lg transition-colors ${
                            submission.isRead 
                              ? "text-gray-400 hover:text-blue-600 hover:bg-blue-50" 
                              : "text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                          }`}
                          title={submission.isRead ? "Mark as Unread" : "Mark as Read"}
                        >
                          {submission.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
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
    </div>
  );
}
