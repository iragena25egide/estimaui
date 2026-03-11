import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DrawingService from "@/services/drawingService";
import DimensionSheetModal from "./dimensionSheetModal";

// Helper to get file icon based on type
const getFileIcon = (fileType?: string) => {
  if (!fileType) return <File className="w-4 h-4" />;
  if (fileType.includes("image") || fileType === "IMAGE") return <ImageIcon className="w-4 h-4" />;
  if (fileType.includes("pdf") || fileType === "PDF") return <FileText className="w-4 h-4" />;
  if (fileType === "IFC") return <File className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

// Helper to determine file type from file name
const getFileTypeFromFile = (file: File): string => {
  const extension = file.name.split('.').pop()?.toUpperCase();
  if (extension === 'IFC') return 'IFC';
  if (extension === 'PDF') return 'PDF';
  if (['PNG', 'JPG', 'JPEG', 'GIF', 'BMP'].includes(extension || '')) return 'IMAGE';
  return 'OTHER';
};

const Drawings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [previewDrawing, setPreviewDrawing] = useState<any | null>(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<any>({
    drawingNo: "",
    title: "",
    discipline: "ARCH",
    revision: "",
    issueDate: "",
    scale: "",
    status: "ISSUED",
    file: null as File | null,
    fileType: "IFC", // default, but will be updated when file is selected
  });

  const loadDrawings = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await DrawingService.getByProject(projectId);
      setDrawings(res);
    } catch (error) {
      toast.error("Failed to load drawings");
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
        toast.success("Drawing updated");
      } else {
        // Ensure file is present when creating
        if (!form.file) {
          toast.warning("Please select a file");
          return;
        }
        await DrawingService.createDrawing({ ...form, projectId });
        toast.success("Drawing created");
      }
      resetForm();
      loadDrawings();
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete drawing?")) return;
    try {
      await DrawingService.delete(id);
      toast.success("Drawing deleted");
      loadDrawings();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (d: any) => {
    setEditingId(d.id);
    setForm({
      drawingNo: d.drawingNo || "",
      title: d.title || "",
      discipline: d.discipline || "ARCH",
      revision: d.revision || "",
      issueDate: d.issueDate || "",
      scale: d.scale || "",
      status: d.status || "ISSUED",
      file: null, // file must be re-uploaded
      fileType: d.fileType || "IFC",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

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
        <Button
          onClick={() => setOpenForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Drawing
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by number or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

      {/* Drawings Table */}
      <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
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
              {filteredDrawings.length === 0 ? (
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDimensionModal(d.id)}
                          className="text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Dimension Sheets"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(d)}
                          className="text-amber-600 hover:bg-amber-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(d.id)}
                          className="text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Drawing Modal */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Drawing" : "Create New Drawing"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Drawing Number
                </label>
                <Input
                  value={form.drawingNo}
                  onChange={(e) => setForm({ ...form, drawingNo: e.target.value })}
                  placeholder="e.g., A-101"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Title
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Floor Plan"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Revision
                </label>
                <Input
                  value={form.revision}
                  onChange={(e) => setForm({ ...form, revision: e.target.value })}
                  placeholder="R01"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Scale
                </label>
                <Input
                  value={form.scale}
                  onChange={(e) => setForm({ ...form, scale: e.target.value })}
                  placeholder="1:100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Issue Date
                </label>
                <Input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Discipline
                </label>
                <Select
                  value={form.discipline}
                  onValueChange={(val) => setForm({ ...form, discipline: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARCH">ARCH</SelectItem>
                    <SelectItem value="STRUCT">STRUCT</SelectItem>
                    <SelectItem value="MEP">MEP</SelectItem>
                    <SelectItem value="CIVIL">CIVIL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ISSUED">ISSUED</SelectItem>
                    <SelectItem value="WIP">WIP</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                  </SelectContent>
                </Select>
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
                      const file = e.target.files[0];
                      setForm({
                        ...form,
                        file: file,
                        fileType: getFileTypeFromFile(file),
                      });
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

          <DialogFooter className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-gray-200 rounded-lg text-gray-600 hover:bg-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
              >
                {editingId ? "Update" : "Create"} Drawing
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog open={!!previewDrawing} onOpenChange={() => setPreviewDrawing(null)}>
        <DialogContent className="sm:max-w-4xl p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {previewDrawing?.drawingNo} - {previewDrawing?.title}
            </DialogTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPreviewDrawing(null)}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>
          <div className="p-6 bg-gray-100 flex items-center justify-center min-h-[60vh]">
            {previewDrawing?.fileType?.includes("image") || previewDrawing?.fileType === "IMAGE" ? (
              <img
                src={previewDrawing?.fileUrl}
                alt={previewDrawing?.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : previewDrawing?.fileType?.includes("pdf") || previewDrawing?.fileType === "PDF" ? (
              <iframe
                src={previewDrawing?.fileUrl}
                title={previewDrawing?.title}
                className="w-full h-full min-h-[60vh] rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <File className="w-16 h-16 mx-auto mb-4" />
                <p>Preview not available for this file type.</p>
                <a
                  href={previewDrawing?.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Download file
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dimension Sheet Modal */}
      <DimensionSheetModal
        drawingId={selectedDrawingId!}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDrawingId(null);
        }}
      />
    </div>
  );
};

export default Drawings;