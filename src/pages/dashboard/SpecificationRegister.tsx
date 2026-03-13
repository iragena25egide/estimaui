import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  X,
  FolderOpen,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import DrawingService from "@/services/drawingService";
import SpecificationService from "@/services/specificationService";

interface Spec {
  id: string;
  specSection: string;
  description: string;
  discipline: string;
  revision?: string;
  remarks?: string;
  projectId?: string;
}

const SpecificationRegister: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [loading, setLoading] = useState({
    projects: false,
    items: false,
  });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    specSection: "",
    description: "",
    discipline: "ARCH",
    revision: "",
    remarks: "",
    projectId: "",
  });

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      setLoading((prev) => ({ ...prev, projects: true }));
      try {
        const res = await DrawingService.getDrawingSummary();
        setProjects(res);
        if (res.length > 0) setSelectedProjectId(res[0].projectId);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    };
    loadProjects();
  }, []);

  // Load specs when project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setSpecs([]);
      return;
    }
    loadSpecs();
  }, [selectedProjectId]);

  const loadSpecs = async () => {
    setLoading((prev) => ({ ...prev, items: true }));
    try {
      const data = await SpecificationService.getByProject(selectedProjectId);
      setSpecs(data);
    } catch (error) {
      toast.error("Failed to load specifications");
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.warning("Please select a project first.");
      return;
    }

    // Validate required fields
    if (!form.specSection || !form.description) {
      toast.warning("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        ...form,
        projectId: selectedProjectId,
      };

      if (editingId) {
        await SpecificationService.update(editingId, payload);
        toast.success("Specification updated");
      } else {
        await SpecificationService.create(payload);
        toast.success("Specification created");
      }

      resetForm();
      loadSpecs();
    } catch (error: any) {
      console.error("Save error", error);
      const message = error.response?.data?.message || "Save failed. Please try again.";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this specification?")) return;
    try {
      await SpecificationService.delete(id);
      toast.success("Specification deleted");
      loadSpecs();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (spec: Spec) => {
    setEditingId(spec.id);
    setForm({
      specSection: spec.specSection,
      description: spec.description,
      discipline: spec.discipline,
      revision: spec.revision || "",
      remarks: spec.remarks || "",
      projectId: spec.projectId || selectedProjectId,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      specSection: "",
      description: "",
      discipline: "ARCH",
      revision: "",
      remarks: "",
      projectId: selectedProjectId,
    });
  };

  const filteredSpecs = specs.filter(
    (s) =>
      s.specSection?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.discipline?.toLowerCase().includes(search.toLowerCase()) ||
      s.revision?.toLowerCase().includes(search.toLowerCase())
  );

  const clearSearch = () => setSearch("");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Specification Register</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage project specifications by discipline
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          
          <div className="relative min-w-[200px]">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
              disabled={loading.projects}
            >
              <SelectTrigger className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {loading.projects ? (
                  <SelectItem value="loading" disabled>
                    Loading projects...
                  </SelectItem>
                ) : projects.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No projects found
                  </SelectItem>
                ) : (
                  projects.map((p) => (
                    <SelectItem key={p.projectId} value={p.projectId}>
                      {p.projectName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {loading.projects && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
            )}
          </div>

          <Button
            onClick={() => setOpen(true)}
            disabled={!selectedProjectId}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm ${
              selectedProjectId
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Specification
          </Button>
        </div>
      </div>

     
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by section, description, discipline or revision..."
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

      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Section</th>
                <th className="p-4 text-left font-semibold text-gray-600">Description</th>
                <th className="p-4 text-left font-semibold text-gray-600">Discipline</th>
                <th className="p-4 text-left font-semibold text-gray-600">Revision</th>
                <th className="p-4 text-left font-semibold text-gray-600">Remarks</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading.items ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : !selectedProjectId ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    Please select a project to view specifications.
                  </td>
                </tr>
              ) : filteredSpecs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {search
                      ? "No specifications match your search."
                      : "No specifications found. Click 'Add Specification' to create one."}
                  </td>
                </tr>
              ) : (
                filteredSpecs.map((spec) => (
                  <tr
                    key={spec.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{spec.specSection}</td>
                    <td className="p-4 text-gray-700">{spec.description}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {spec.discipline}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{spec.revision || "-"}</td>
                    <td className="p-4 text-gray-700">{spec.remarks || "-"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(spec)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(spec.id)}
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

      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Specification" : "Add Specification"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                Section <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.specSection}
                onChange={(e) => setForm({ ...form, specSection: e.target.value })}
                placeholder="e.g., 01, 02, 03"
                className="border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., General Requirements"
                className="border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                Discipline
              </label>
              <Select
                value={form.discipline}
                onValueChange={(value) => setForm({ ...form, discipline: value })}
              >
                <SelectTrigger className="border-gray-200 rounded-lg">
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
                Revision
              </label>
              <Input
                value={form.revision}
                onChange={(e) => setForm({ ...form, revision: e.target.value })}
                placeholder="e.g., A, 01, Rev1"
                className="border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                Remarks
              </label>
              <Input
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                placeholder="Optional notes"
                className="border-gray-200 rounded-lg"
              />
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
                {editingId ? "Update" : "Create"} Specification
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecificationRegister;