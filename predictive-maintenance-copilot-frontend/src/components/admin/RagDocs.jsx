import React, { useState, useEffect } from "react";
import { adminServices } from "../../api/adminServices";
import { toast } from "react-hot-toast";
import { 
  FileText, Upload, Trash2, Search, 
  Loader2, BookOpen, AlertCircle 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { DeleteDocumentPopup } from "./DeleteDocumentPopup";

export default function RagDocs() {
  const { user } = useAuth(); 
  const isAdmin = user?.role === 'admin';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("sop");
  const [language, setLanguage] = useState("id");

  const [deleteData, setDeleteData] = useState({ open: false, id: null, name: '' });

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data } = await adminServices.getAllDocuments();
      setDocuments(data.data || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih file PDF");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", docType);
    formData.append("language", language);

    setUploading(true);
    const toastId = toast.loading("Uploading...");

    try {
      await adminServices.uploadDocument(formData);
      toast.success("Berhasil diupload!", { id: toastId });
      setFile(null); 
      document.getElementById("fileInput").value = ""; 
      fetchDocuments(); 
    } catch (err) {
      toast.error("Gagal upload", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const openDeletePopup = (doc) => {
    setDeleteData({ open: true, id: doc.id, name: doc.originalName });
  };

  const confirmDelete = async () => {
    try {
      await adminServices.deleteDocument(deleteData.id);
      toast.success("Dokumen dihapus");
      setDeleteData({ open: false, id: null, name: '' }); 
      fetchDocuments();
    } catch (err) {
      toast.error("Gagal hapus");
    }
  };

  const getTypeBadge = (type) => {
    const colors = { sop: "bg-blue-100 text-blue-700", manual: "bg-purple-100 text-purple-700", datasheet: "bg-gray-100 text-gray-700", safety: "bg-red-100 text-red-700" };
    return <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${colors[type] || "bg-gray-100"}`}>{type}</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* FORM UPLOAD (HANYA ADMIN) */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
            <Upload className="w-5 h-5 mr-2 text-indigo-600" /> Upload New Document
            </h3>
            
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">PDF File</label>
                    <input id="fileInput" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="block w-full h-11 text-sm text-gray-500 file:mr-4 file:py-0 file:h-full file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Type</label>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                        <option value="sop">SOP</option><option value="manual">Manual</option><option value="datasheet">Datasheet</option><option value="safety">Safety</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Lang</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                        <option value="id">ID</option><option value="en">EN</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <button type="submit" disabled={uploading || !file} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex justify-center items-center shadow-md shadow-indigo-100">
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload"}
                    </button>
                </div>
            </form>
            <div className="mt-4 flex items-center gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-700 border border-blue-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="leading-tight">Documents will be processed into the <strong>Manuals & SOPs library</strong> for AI reference. Only PDF files are supported.</p>
            </div>
        </div>
      )}

      {/* LIST DOKUMEN */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <BookOpen className="text-gray-700" size={24} />
            <h3 className="text-lg font-bold text-gray-800">Manuals & SOPs <span className="text-indigo-600 ml-1">({documents.length})</span></h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs tracking-wider border-b border-gray-200">
                    <tr><th className="px-6 py-4">Filename</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Lang</th><th className="px-6 py-4">Size</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading...</td></tr>
                    ) : documents.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-10 text-gray-400">No documents found.</td></tr>
                    ) : documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition group">
                            <td className="px-6 py-4 font-medium text-gray-700 flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded text-red-600"><FileText size={18} /></div>
                                {doc.previewUrl ? (<a href={doc.previewUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-600 hover:underline cursor-pointer transition-colors" title="Click to view">{doc.originalName}</a>) : (<span>{doc.originalName}</span>)}
                            </td>
                            <td className="px-6 py-4">{getTypeBadge(doc.type)}</td>
                            <td className="px-6 py-4"><span className="uppercase text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{doc.language}</span></td>
                            <td className="px-6 py-4 text-gray-500 text-xs">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {doc.previewUrl && (<a href={doc.previewUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="Preview"><Search size={16} /></a>)}
                                    
                                    {/* TOMBOL DELETE (PAKAI POPUP) */}
                                    {isAdmin && (
                                        <button onClick={() => openDeletePopup(doc)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Popup Delete */}
      <DeleteDocumentPopup 
        isOpen={deleteData.open} 
        filename={deleteData.name} 
        onClose={() => setDeleteData({ ...deleteData, open: false })} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}