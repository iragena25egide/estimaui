import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  FileIcon,
  X,
  Image as ImageIcon,
  FileText,
  File,
} from "lucide-react";
import DrawingService from "@/services/drawingService";
import DimensionSheetModal from "./dimensionSheetModal";

// Helper to get file icon based on type
const getFileIcon = (fileType?: string) => {
  if (!fileType) return <File className="w-4 h-4" />;
  if (fileType.includes("image")) return <ImageIcon className="w-4 h-4" />;
  if (fileType.includes("pdf")) return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

const Drawings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [previewDrawing, setPreviewDrawing] = useState<any | null>(null); // for file preview modal

  const [form, setForm] = useState<any>({
    drawingNo: "",
    title: "",
    discipline: "ARCH",
    revision: "",
    issueDate: "",
    scale: "",
    status: "ISSUED",
    file: null as File | null,
    fileType: "IFC",
  });

  // State for dimension sheet modal
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadDrawings = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await DrawingService.getByProject(projectId);
      setDrawings(res);
    } catch (error) {
      console.error("Failed to load drawings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrawings();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!projectId) return;
    try {
      if (editingId) {
        await DrawingService.update(editingId, form);
      } else {
        await DrawingService.createDrawing({
          ...form,
          projectId,
        });
      }
      resetForm();
      loadDrawings();
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete drawing?")) return;
    try {
      await DrawingService.delete(id);
      loadDrawings();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleEdit = (d: any) => {
    setEditingId(d.id);
    setForm({
      ...d,
      file: null,
    });
    setOpenForm(true);
  };

  const resetForm = () => {
    setOpenForm(false);
    setEditingId(null);
    setForm({
      drawingNo: "",
      title: "",
      discipline: "ARCH",
      revision: "",
      issueDate: "",
      scale: "",
      status: "ISSUED",
      file: null,
      fileType: "IFC",
    });
  };

  const filteredDrawings = drawings.filter(
    (d) =>
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.drawingNo?.toLowerCase().includes(search.toLowerCase())
  );

  const openDimensionModal = (drawingId: string) => {
    setSelectedDrawingId(drawingId);
    setModalOpen(true);
  };

  const clearSearch = () => setSearch("");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drawing Register</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage project drawings and IFC files
          </p>
        </div>
        <button
          onClick={() => setOpenForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Drawing
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by number or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Drawings Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">No</th>
                <th className="p-4 text-left font-semibold text-gray-600">Title</th>
                <th className="p-4 text-left font-semibold text-gray-600">Discipline</th>
                <th className="p-4 text-left font-semibold text-gray-600">Revision</th>
                <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left font-semibold text-gray-600">File</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredDrawings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    No drawings found.{" "}
                    <button
                      onClick={() => setOpenForm(true)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Add your first drawing
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDrawings.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{d.drawingNo}</td>
                    <td className="p-4 text-gray-700">{d.title}</td>
                    <td className="p-4 text-gray-700">{d.discipline}</td>
                    <td className="p-4 text-gray-700">{d.revision}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          d.status === "ISSUED"
                            ? "bg-green-100 text-green-700"
                            : d.status === "WIP"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      {d.issueDate ? new Date(d.issueDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      {d.fileUrl ? (
                        <button
                          onClick={() => setPreviewDrawing(d)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Preview file"
                        >
                          {getFileIcon(d.fileType)}
                        </button>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDimensionModal(d.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Dimension Sheets"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(d)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Drawing Modal */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Drawing" : "Create New Drawing"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: "drawingNo", label: "Drawing Number", placeholder: "e.g., A-101" },
                  { key: "title", label: "Title", placeholder: "Floor Plan" },
                  { key: "revision", label: "Revision", placeholder: "R01" },
                  { key: "scale", label: "Scale", placeholder: "1:100" },
                  { key: "issueDate", label: "Issue Date", type: "date" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={form[field.key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.key]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Discipline
                  </label>
                  <select
                    value={form.discipline}
                    onChange={(e) =>
                      setForm({ ...form, discipline: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option>ARCH</option>
                    <option>STRUCT</option>
                    <option>MEP</option>
                    <option>CIVIL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option>ISSUED</option>
                    <option>WIP</option>
                    <option>APPROVED</option>
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <FileIcon className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                  <input
                    type="file"
                    id="file-upload"
                    accept=".ifc,.pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setForm({ ...form, file: e.target.files[0] });
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Click to upload
                  </label>
                  <span className="text-gray-500"> or drag and drop</span>
                  {form.file && (
                    <div className="mt-3 text-sm bg-blue-50 text-blue-700 p-2 rounded-lg inline-flex items-center gap-2">
                      {getFileIcon(form.file.type)}
                      {form.file.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={resetForm}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                {editingId ? "Update" : "Create"} Drawing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewDrawing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {previewDrawing.drawingNo} - {previewDrawing.title}
              </h3>
              <button
                onClick={() => setPreviewDrawing(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-100 flex items-center justify-center">
              {previewDrawing.fileType?.includes("image") ? (
                <img
                  src={previewDrawing.fileUrl}
                  alt={previewDrawing.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : previewDrawing.fileType?.includes("pdf") ? (
                <iframe
                  src={previewDrawing.fileUrl}
                  title={previewDrawing.title}
                  className="w-full h-full min-h-[70vh] rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <File className="w-16 h-16 mx-auto mb-4" />
                  <p>Preview not available for this file type.</p>
                  <a
                    href={previewDrawing.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-blue-600 hover:underline"
                  >
                    Download file
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dimension Sheet Modal */}
      {modalOpen && selectedDrawingId && (
        <DimensionSheetModal
          drawingId={selectedDrawingId}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedDrawingId(null);
          }}
        />
      )}
    </div>
  );
};

export default Drawings;