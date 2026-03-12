import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  X,
  FolderOpen,
  Users,
  Loader2,
} from "lucide-react";
import DrawingService from "@/services/drawingService";
import LaborProductivityService from "@/services/laborProductivity";
import { toast } from "sonner";

const LaborProductivity: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    projects: false,
    items: false,
  });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    laborType: "",
    unit: "",
    productivityRate: "",
    wageRate: "",
    workingHours: "",
    outputPerDay: "",
    totalLaborCost: "", // added for completeness
    projectId: "",
  });

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

  useEffect(() => {
    if (!selectedProjectId) {
      setItems([]);
      return;
    }
    loadItems();
  }, [selectedProjectId]);

  const loadItems = async () => {
    setLoading((prev) => ({ ...prev, items: true }));
    try {
      const data = await LaborProductivityService.getByProject(selectedProjectId);
      setItems(data);
    } catch (error) {
      toast.error("Failed to load labor productivity");
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.warning("Please select a project first.");
      return;
    }

    const requiredFields = [
      { field: "laborType", label: "Labor Type" },
      { field: "unit", label: "Unit" },
      { field: "productivityRate", label: "Productivity Rate" },
      { field: "wageRate", label: "Wage Rate" },
      { field: "workingHours", label: "Working Hours" },
      { field: "outputPerDay", label: "Output per Day" },
    ];
    for (const { field, label } of requiredFields) {
      if (!form[field as keyof typeof form]) {
        toast.warning(`Please fill in ${label}`);
        return;
      }
    }

    // Compute totalLaborCost (example: wage * hours – adjust if needed)
    const wage = parseFloat(form.wageRate) || 0;
    const hours = parseFloat(form.workingHours) || 0;
    const totalLaborCost = wage * hours;

    try {
      const payload = {
        ...form,
        projectId: selectedProjectId,
        totalLaborCost, // send computed value
      };

      if (editingId) {
        await LaborProductivityService.update(editingId, payload);
        toast.success("Labor productivity updated");
      } else {
        await LaborProductivityService.create(payload);
        toast.success("Labor productivity created");
      }

      resetForm();
      loadItems();
    } catch (error: any) {
      console.error("Save error", error);
      const message = error.response?.data?.message || error.message || "Save failed. Please try again.";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this labor productivity record?")) return;
    try {
      await LaborProductivityService.delete(id);
      toast.success("Record deleted");
      loadItems();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      laborType: item.laborType || "",
      unit: item.unit || "",
      productivityRate: item.productivityRate?.toString() || "",
      wageRate: item.wageRate?.toString() || "",
      workingHours: item.workingHours?.toString() || "",
      outputPerDay: item.outputPerDay?.toString() || "",
      totalLaborCost: item.totalLaborCost?.toString() || "", // preserve if stored
      projectId: item.projectId || selectedProjectId,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      laborType: "",
      unit: "",
      productivityRate: "",
      wageRate: "",
      workingHours: "",
      outputPerDay: "",
      totalLaborCost: "",
      projectId: selectedProjectId,
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.laborType?.toLowerCase().includes(search.toLowerCase()) ||
      item.unit?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Labor Productivity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage labor productivity rates and costs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative min-w-[200px]">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
              disabled={loading.projects}
            >
              {loading.projects ? (
                <option>Loading projects...</option>
              ) : projects.length === 0 ? (
                <option>No projects found</option>
              ) : (
                projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.projectName}
                  </option>
                ))
              )}
            </select>
            {loading.projects && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
            )}
          </div>

          <button
            onClick={() => setOpen(true)}
            disabled={!selectedProjectId}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
              selectedProjectId
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Labor
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by labor type or unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Labor Type</th>
                <th className="p-4 text-left font-semibold text-gray-600">Unit</th>
                <th className="p-4 text-left font-semibold text-gray-600">Productivity Rate</th>
                <th className="p-4 text-left font-semibold text-gray-600">Wage Rate (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Working Hours</th>
                <th className="p-4 text-left font-semibold text-gray-600">Output/Day</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading.items ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : !selectedProjectId ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Please select a project to view labor productivity records.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    {search
                      ? "No records match your search."
                      : "No labor productivity records found. Click 'Add Labor' to create one."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{item.laborType}</td>
                    <td className="p-4 text-gray-700">{item.unit}</td>
                    <td className="p-4 text-gray-700">{item.productivityRate}</td>
                    <td className="p-4 text-gray-700">₹{item.wageRate}</td>
                    <td className="p-4 text-gray-700">{item.workingHours}</td>
                    <td className="p-4 font-medium text-blue-600">{item.outputPerDay}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {editingId ? "Edit Labor Productivity" : "Add Labor Productivity"}
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
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Labor Type
                  </label>
                  <input
                    type="text"
                    value={form.laborType}
                    onChange={(e) => setForm({ ...form, laborType: e.target.value })}
                    placeholder="e.g., Mason, Carpenter"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="e.g., m², m³, day"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Productivity Rate
                  </label>
                  <input
                    type="number"
                    value={form.productivityRate}
                    onChange={(e) => setForm({ ...form, productivityRate: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Wage Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={form.wageRate}
                    onChange={(e) => setForm({ ...form, wageRate: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Working Hours per Day
                  </label>
                  <input
                    type="number"
                    value={form.workingHours}
                    onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                    placeholder="8"
                    step="0.5"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Output per Day
                  </label>
                  <input
                    type="number"
                    value={form.outputPerDay}
                    onChange={(e) => setForm({ ...form, outputPerDay: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
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
                {editingId ? "Update" : "Create"} Labor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaborProductivity;