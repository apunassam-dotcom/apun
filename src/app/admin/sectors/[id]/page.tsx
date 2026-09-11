"use client";

import { useState, useEffect } from "react";
import { getCloudinarySignature } from "@/actions/cloudinary";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { Loader2, X, Plus, Type, Image as ImageIcon, List, Minus, UploadCloud, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

type ContentBlock = {
  type: "h2" | "p" | "image" | "bullet" | "break";
  content: string | string[];
};

export default function EditSector() {
  const router = useRouter();
  const { id } = useParams();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState("");
  
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [uploadingBlocks, setUploadingBlocks] = useState<{ [key: number]: { current: number, total: number } }>({});

  useEffect(() => {
    const fetchSector = async () => {
      try {
        const docRef = doc(db, "sectors", id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setSlug(data.slug);
          setShortDesc(data.shortDescription);
          setExistingCoverImageUrl(data.coverImage);
          
          // Ensure older single-string formats for bullet/image are converted to arrays for edit mode
          const normalizedBlocks = (data.contentBlocks || []).map((b: any) => {
            if (b.type === 'bullet' && typeof b.content === 'string') return { ...b, content: [b.content] };
            if (b.type === 'image' && typeof b.content === 'string') return { ...b, content: b.content ? [b.content] : [] };
            return b;
          });
          setBlocks(normalizedBlocks);
        } else {
          alert("Sector not found!");
          router.push("/admin");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) fetchSector();
  }, [id, router]);

  const addBlock = (type: ContentBlock["type"]) => {
    let initialContent: string | string[] = "";
    if (type === "bullet") initialContent = [""];
    if (type === "image") initialContent = [];
    
    setBlocks([...blocks, { type, content: initialContent }]);
  };

  const addActivity = () => {
    setBlocks([
      ...blocks,
      { type: 'h2', content: '' },
      { type: 'p', content: '' },
      { type: 'image', content: [] }
    ]);
  };

  const updateBlock = (index: number, content: string | string[]) => {
    const newBlocks = [...blocks];
    newBlocks[index].content = content;
    setBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // --- Multi-Item Bullet Helpers ---
  const updateBulletPoint = (blockIndex: number, pointIndex: number, text: string) => {
    const newBlocks = [...blocks];
    const block = newBlocks[blockIndex];
    if (Array.isArray(block.content)) {
      block.content[pointIndex] = text;
      setBlocks(newBlocks);
    }
  };

  const addBulletPoint = (blockIndex: number) => {
    const newBlocks = [...blocks];
    const block = newBlocks[blockIndex];
    if (Array.isArray(block.content)) {
      block.content.push("");
      setBlocks(newBlocks);
    }
  };

  const removeBulletPoint = (blockIndex: number, pointIndex: number) => {
    const newBlocks = [...blocks];
    const block = newBlocks[blockIndex];
    if (Array.isArray(block.content)) {
      block.content.splice(pointIndex, 1);
      setBlocks(newBlocks);
    }
  };

  // --- Multi-Image Gallery Helpers ---
  const removeImageFromGallery = (blockIndex: number, imageIndex: number) => {
    const newBlocks = [...blocks];
    const block = newBlocks[blockIndex];
    if (Array.isArray(block.content)) {
      block.content.splice(imageIndex, 1);
      setBlocks(newBlocks);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignature();
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey!);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "apun-assam-sectors");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudinary upload failed:", errText);
      throw new Error(errText);
    }
    
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageBlockUpload = async (index: number, files: FileList) => {
    try {
      setUploadingBlocks(prev => ({ ...prev, [index]: { current: 0, total: files.length } }));
      
      const newUrls = [];
      for (let i = 0; i < files.length; i++) {
        setUploadingBlocks(prev => ({ ...prev, [index]: { current: i + 1, total: files.length } }));
        const url = await uploadToCloudinary(files[i]);
        newUrls.push(url);
      }
      
      const newBlocks = [...blocks];
      const block = newBlocks[index];
      if (Array.isArray(block.content)) {
        block.content = [...block.content, ...newUrls];
        setBlocks(newBlocks);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Failed to upload block images: ${e.message}`);
    } finally {
      setUploadingBlocks(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return alert("Title and Slug are required");

    setLoading(true);
    try {
      let finalCoverUrl = existingCoverImageUrl;
      if (coverImage) {
        finalCoverUrl = await uploadToCloudinary(coverImage);
      }

      await updateDoc(doc(db, "sectors", id as string), {
        title,
        slug,
        shortDescription: shortDesc,
        coverImage: finalCoverUrl,
        contentBlocks: blocks,
        updatedAt: new Date(),
      });

      alert("Changes saved successfully!");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("Error updating sector");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Edit2Icon className="text-[#1E4BB5] w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit Case Study</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Study Title</label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 text-gray-900 font-bold focus:border-[#1E4BB5] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                placeholder="e.g. AI-Powered Automation"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 text-gray-900 font-bold focus:border-[#1E4BB5] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              placeholder="e.g. ai-powered-automation"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Short Description</label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 text-gray-900 font-medium focus:border-[#1E4BB5] focus:ring-4 focus:ring-blue-50 outline-none min-h-[120px] transition-all resize-none"
            placeholder="Brief overview of this case study..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Cover Image</label>
          
          {existingCoverImageUrl && !coverImage && (
            <div className="mb-4 relative w-48 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={existingCoverImageUrl} alt="Current Cover" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded font-bold text-gray-700 shadow-sm">Current</div>
            </div>
          )}

          <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-2 relative flex items-center justify-between">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="px-4 py-2 text-gray-500 font-medium flex items-center gap-3">
              <ImageIcon size={18} />
              <span className="text-sm">{coverImage ? coverImage.name : "Select a new image to replace..."}</span>
            </div>
            <div className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 transition-colors">
              Browse
            </div>
          </div>
        </div>

        <div className="pt-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Content Blocks</h3>
          
          <div className="space-y-6 mb-8">
            {blocks.map((block, index) => {
              const isNewActivity = block.type === 'h2';
              return (
              <div key={index} className="flex flex-col gap-6">
                {isNewActivity && index > 0 && (
                  <div className="flex items-center gap-4 mt-8 mb-2">
                     <div className="h-[1px] flex-1 bg-gray-200" />
                     <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Next Activity / Section</span>
                     <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                )}
                {isNewActivity && index === 0 && (
                  <div className="flex items-center gap-4 mb-2">
                     <div className="h-[1px] flex-1 bg-gray-200" />
                     <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">First Activity / Section</span>
                     <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                )}
                <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 relative group hover:border-[#1E4BB5]/30 transition-colors">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <List size={14} className="text-gray-400" />
                      {block.type}
                    </div>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="text-red-500/50 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors p-1.5"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div>
                  {block.type === 'p' && typeof block.content === 'string' && (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      className="w-full bg-transparent border-none text-gray-900 font-medium focus:outline-none min-h-[100px] resize-none placeholder:text-gray-400"
                      placeholder="Paragraph text..."
                    />
                  )}
                  {block.type === 'h2' && typeof block.content === 'string' && (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      className="w-full bg-transparent border-none text-2xl font-black text-gray-900 focus:outline-none placeholder:text-gray-400"
                      placeholder="Heading text..."
                    />
                  )}
                  {block.type === 'bullet' && Array.isArray(block.content) && (
                    <div className="flex flex-col gap-3">
                      {block.content.map((point, ptIdx) => (
                        <div key={ptIdx} className="flex items-start gap-3 relative group/pt">
                          <span className="text-[#1E4BB5] text-xl mt-1">•</span>
                          <textarea
                            value={point}
                            onChange={(e) => updateBulletPoint(index, ptIdx, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-900 font-medium focus:outline-none min-h-[60px] resize-none placeholder:text-gray-400 focus:border-[#1E4BB5] focus:ring-2 focus:ring-blue-50 transition-all"
                            placeholder={`Bullet point ${ptIdx + 1}...`}
                          />
                          <button
                            type="button"
                            onClick={() => removeBulletPoint(index, ptIdx)}
                            className="absolute right-2 top-2 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover/pt:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addBulletPoint(index)}
                        className="mt-2 text-sm text-[#1E4BB5] hover:text-[#153a96] font-bold flex items-center gap-1 w-fit bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Plus size={16} /> Add Point
                      </button>
                    </div>
                  )}
                  {block.type === 'image' && Array.isArray(block.content) && (
                    <div className="w-full">
                      {block.content.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {block.content.map((url, imgIdx) => (
                            <div key={imgIdx} className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group/img shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeImageFromGallery(index, imgIdx)} 
                                className="absolute inset-0 m-auto w-10 h-10 bg-red-500/80 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:scale-110"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {uploadingBlocks[index] ? (
                        <div className="w-full h-32 border border-dashed border-[#1E4BB5]/50 rounded-xl flex flex-col items-center justify-center text-[#1E4BB5] bg-blue-50">
                          <Loader2 className="w-8 h-8 animate-spin mb-2" />
                          <span className="text-sm font-bold">Uploading {uploadingBlocks[index].current} of {uploadingBlocks[index].total}...</span>
                        </div>
                      ) : (
                        <div className="w-full h-32 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 relative hover:border-[#1E4BB5] hover:bg-blue-50 hover:text-[#1E4BB5] transition-colors cursor-pointer bg-gray-50">
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files?.length) handleImageBlockUpload(index, e.target.files);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <UploadCloud size={24} className="mb-2" />
                          <span className="text-sm font-bold">Click to upload images (Gallery)</span>
                        </div>
                      )}
                    </div>
                  )}
                  {block.type === 'break' && (
                    <div className="w-full h-[1px] bg-gray-200 my-4" />
                  )}
                </div>
              </div>
            </div>
            );
          })}
          </div>

          <button
            type="button"
            onClick={addActivity}
            className="w-full h-16 border-2 border-dashed border-[#1E4BB5]/30 hover:border-[#1E4BB5] rounded-2xl flex items-center justify-center gap-3 text-[#1E4BB5] hover:bg-blue-50 transition-all mb-6"
          >
            <Plus size={20} />
            <span className="font-bold tracking-wide">Add New Activity (Heading + Text + Image)</span>
          </button>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="h-[1px] flex-1 bg-gray-200" />
             <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Or Add Individual Blocks</span>
             <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
            <button
              type="button"
              onClick={() => addBlock("h2")}
              className="flex flex-col items-center justify-center gap-2 h-24 bg-white border border-gray-200 hover:border-[#1E4BB5] hover:shadow-md hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-[#1E4BB5] transition-all cursor-pointer"
            >
              <span className="text-sm font-black">H2</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Heading</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock("p")}
              className="flex flex-col items-center justify-center gap-2 h-24 bg-white border border-gray-200 hover:border-[#1E4BB5] hover:shadow-md hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-[#1E4BB5] transition-all cursor-pointer"
            >
              <span className="text-sm font-serif italic font-black">¶</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Paragraph</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="flex flex-col items-center justify-center gap-2 h-24 bg-white border border-gray-200 hover:border-[#1E4BB5] hover:shadow-md hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-[#1E4BB5] transition-all cursor-pointer"
            >
              <ImageIcon size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock("bullet")}
              className="flex flex-col items-center justify-center gap-2 h-24 bg-white border border-gray-200 hover:border-[#1E4BB5] hover:shadow-md hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-[#1E4BB5] transition-all cursor-pointer"
            >
              <List size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">List</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock("break")}
              className="flex flex-col items-center justify-center gap-2 h-24 bg-white border border-gray-200 hover:border-[#1E4BB5] hover:shadow-md hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-[#1E4BB5] transition-all cursor-pointer"
            >
              <Minus size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Break</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E4BB5] hover:bg-[#153a96] hover:shadow-lg text-white px-8 py-5 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all hover:shadow-sm"
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function Edit2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}
