import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  X,
  FolderOpen,
  Calculator,
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
import RateAnalysisService from "@/services/analysisService";

const RateAnalysis: React.FC = () => {
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
    boqItemNo: "",
    description: "",
    unit: "",
    materialCost: "",
    laborCost: "",
    equipmentCost: "",
    wastage: "",
    overheads: "",
    profitPercent: "",
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

  // Load rate analysis records when project changes
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
      const data = await RateAnalysisService.getByProject(selectedProjectId);
      setItems(data);
    } catch (error) {
      toast.error("Failed to load rate analysis");
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  // Auto-calculate finalUnitRate (not sent to backend, just for display)
  const calculatedFinalRate = React.useMemo(() => {
    const material = parseFloat(form.materialCost) || 0;
    const labor = parseFloat(form.laborCost) || 0;
    const equipment = parseFloat(form.equipmentCost) || 0;
    const wastage = parseFloat(form.wastage) || 0;
    const overheads = parseFloat(form.overheads) || 0;
    const profit = parseFloat(form.profitPercent) || 0;

    const baseCost = material + labor + equipment;
    const wastageCost = baseCost * (wastage / 100);
    const overheadCost = baseCost * (overheads / 100);
    const profitAmount = (baseCost + wastageCost + overheadCost) * (profit / 100);
    const total = baseCost + wastageCost + overheadCost + profitAmount;
    return total.toFixed(2);
  }, [form.materialCost, form.laborCost, form.equipmentCost, form.wastage, form.overheads, form.profitPercent]);

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.warning("Please select a project first.");
      return;
    }

    // Validate required fields
    const requiredFields = [
      { field: "boqItemNo", label: "BOQ Item No" },
      { field: "description", label: "Description" },
      { field: "unit", label: "Unit" },
      { field: "materialCost", label: "Material Cost" },
      { field: "laborCost", label: "Labor Cost" },
      { field: "equipmentCost", label: "Equipment Cost" },
      { field: "wastage", label: "Wastage %" },
      { field: "overheads", label: "Overheads %" },
      { field: "profitPercent", label: "Profit %" },
    ];
    for (const { field, label } of requiredFields) {
      if (!form[field as keyof typeof form]) {
        toast.warning(`Please fill in ${label}`);
        return;
      }
    }

    const payload = {
      ...form,
      projectId: selectedProjectId,
      // Ensure numbers are sent as numbers
      materialCost: parseFloat(form.materialCost),
      laborCost: parseFloat(form.laborCost),
      equipmentCost: parseFloat(form.equipmentCost),
      wastage: parseFloat(form.wastage),
      overheads: parseFloat(form.overheads),
      profitPercent: parseFloat(form.profitPercent),
    };

    try {
      if (editingId) {
        await RateAnalysisService.update(editingId, payload);
        toast.success("Rate analysis updated");
      } else {
        await RateAnalysisService.create(payload);
        toast.success("Rate analysis created");
      }

      resetForm();
      loadItems();
    } catch (error: any) {
      console.error("Save error", error);
      const message = error.response?.data?.message || "Save failed. Please try again.";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this rate analysis record?")) return;
    try {
      await RateAnalysisService.delete(id);
      toast.success("Record deleted");
      loadItems();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      boqItemNo: item.boqItemNo || "",
      description: item.description || "",
      unit: item.unit || "",
      materialCost: item.materialCost?.toString() || "",
      laborCost: item.laborCost?.toString() || "",
      equipmentCost: item.equipmentCost?.toString() || "",
      wastage: item.wastage?.toString() || "",
      overheads: item.overheads?.toString() || "",
      profitPercent: item.profitPercent?.toString() || "",
      projectId: item.projectId || selectedProjectId,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      boqItemNo: "",
      description: "",
      unit: "",
      materialCost: "",
      laborCost: "",
      equipmentCost: "",
      wastage: "",
      overheads: "",
      profitPercent: "",
      projectId: selectedProjectId,
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.boqItemNo?.toLowerCase().includes(search.toLowerCase()) ||
      item.unit?.toLowerCase().includes(search.toLowerCase())
  );

  const clearSearch = () => setSearch("");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rate Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage item rates with overhead, wastage and profit
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Project Dropdown */}
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
            Add Analysis
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by item no, description or unit..."
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

      {/* Rate Analysis Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Item No</th>
                <th className="p-4 text-left font-semibold text-gray-600">Description</th>
                <th className="p-4 text-left font-semibold text-gray-600">Unit</th>
                <th className="p-4 text-left font-semibold text-gray-600">Material (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Labor (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Equipment (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Wastage %</th>
                <th className="p-4 text-left font-semibold text-gray-600">Overheads %</th>
                <th className="p-4 text-left font-semibold text-gray-600">Profit %</th>
                <th className="p-4 text-left font-semibold text-gray-600">Final Rate (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading.items ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : !selectedProjectId ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-gray-500">
                    Please select a project to view rate analysis records.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-gray-500">
                    {search
                      ? "No records match your search."
                      : "No rate analysis records found. Click 'Add Analysis' to create one."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{item.boqItemNo}</td>
                    <td className="p-4 text-gray-700">{item.description}</td>
                    <td className="p-4 text-gray-700">{item.unit}</td>
                    <td className="p-4 text-gray-700">₹{item.materialCost}</td>
                    <td className="p-4 text-gray-700">₹{item.laborCost}</td>
                    <td className="p-4 text-gray-700">₹{item.equipmentCost}</td>
                    <td className="p-4 text-gray-700">{item.wastage}%</td>
                    <td className="p-4 text-gray-700">{item.overheads}%</td>
                    <td className="p-4 text-gray-700">{item.profitPercent}%</td>
                    <td className="p-4 font-bold text-blue-600">₹{item.finalUnitRate}</td>
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

      {/* Add/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Rate Analysis" : "Add Rate Analysis"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  BOQ Item No
                </label>
                <Input
                  value={form.boqItemNo}
                  onChange={(e) => setForm({ ...form, boqItemNo: e.target.value })}
                  placeholder="e.g., 1.1"
                  className="border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Description
                </label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g., Concrete (M25)"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Unit
                </label>
                <Input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="e.g., m³"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Material Cost (₹)
                </label>
                <Input
                  type="number"
                  value={form.materialCost}
                  onChange={(e) => setForm({ ...form, materialCost: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Labor Cost (₹)
                </label>
                <Input
                  type="number"
                  value={form.laborCost}
                  onChange={(e) => setForm({ ...form, laborCost: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Equipment Cost (₹)
                </label>
                <Input
                  type="number"
                  value={form.equipmentCost}
                  onChange={(e) => setForm({ ...form, equipmentCost: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Wastage (%)
                </label>
                <Input
                  type="number"
                  value={form.wastage}
                  onChange={(e) => setForm({ ...form, wastage: e.target.value })}
                  placeholder="5"
                  step="0.1"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Overheads (%)
                </label>
                <Input
                  type="number"
                  value={form.overheads}
                  onChange={(e) => setForm({ ...form, overheads: e.target.value })}
                  placeholder="10"
                  step="0.1"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Profit (%)
                </label>
                <Input
                  type="number"
                  value={form.profitPercent}
                  onChange={(e) => setForm({ ...form, profitPercent: e.target.value })}
                  placeholder="15"
                  step="0.1"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Final Rate (₹) - calculated
                </label>
                <Input
                  type="number"
                  value={calculatedFinalRate}
                  readOnly
                  className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm font-bold text-blue-700"
                />
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
                {editingId ? "Update" : "Create"} Analysis
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RateAnalysis;