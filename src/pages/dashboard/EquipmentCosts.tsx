import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  X,
  FolderOpen,
  Truck,
  Loader2,
} from "lucide-react";
import DrawingService from "@/services/drawingService";
import EquipmentCostService from "@/services/equipmentService";

const EquipmentCosts: React.FC = () => {
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
    equipmentName: "",
    capacity: "",
    hireRatePerDay: "",
    durationDays: "",
    fuelCost: "",
    operatorCost: "",
    totalCost: "",
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
        console.error("Failed to load projects", error);
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    };
    loadProjects();
  }, []);

  // Load equipment costs when project changes
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
      const data = await EquipmentCostService.getByProject(selectedProjectId);
      setItems(data);
    } catch (error) {
      console.error("Failed to load equipment costs", error);
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  // Auto‑calculate total cost
  useEffect(() => {
    const rate = parseFloat(form.hireRatePerDay) || 0;
    const days = parseFloat(form.durationDays) || 0;
    const fuel = parseFloat(form.fuelCost) || 0;
    const operator = parseFloat(form.operatorCost) || 0;
    const total = rate * days + fuel + operator;
    setForm((prev) => ({ ...prev, totalCost: total.toFixed(2) }));
  }, [form.hireRatePerDay, form.durationDays, form.fuelCost, form.operatorCost]);

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      alert("Please select a project first.");
      return;
    }

    try {
      const payload = {
        ...form,
        projectId: selectedProjectId,
      };

      if (editingId) {
        await EquipmentCostService.update(editingId, payload);
      } else {
        await EquipmentCostService.create(payload);
      }

      resetForm();
      loadItems();
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this equipment cost entry?")) return;
    try {
      await EquipmentCostService.delete(id);
      loadItems();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      equipmentName: item.equipmentName || "",
      capacity: item.capacity || "",
      hireRatePerDay: item.hireRatePerDay?.toString() || "",
      durationDays: item.durationDays?.toString() || "",
      fuelCost: item.fuelCost?.toString() || "",
      operatorCost: item.operatorCost?.toString() || "",
      totalCost: item.totalCost?.toString() || "",
      projectId: item.projectId || selectedProjectId,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      equipmentName: "",
      capacity: "",
      hireRatePerDay: "",
      durationDays: "",
      fuelCost: "",
      operatorCost: "",
      totalCost: "",
      projectId: selectedProjectId,
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.equipmentName?.toLowerCase().includes(search.toLowerCase()) ||
      item.capacity?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Costs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage equipment hire and operating costs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Project Dropdown */}
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
            Add Equipment
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by equipment name or capacity..."
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

      {/* Equipment Costs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Equipment</th>
                <th className="p-4 text-left font-semibold text-gray-600">Capacity</th>
                <th className="p-4 text-left font-semibold text-gray-600">Rate/Day (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Duration (days)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Fuel (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Operator (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Total Cost (₹)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading.items ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
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
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    Please select a project to view equipment costs.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    {search
                      ? "No equipment costs match your search."
                      : "No equipment costs found. Click 'Add Equipment' to create one."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{item.equipmentName}</td>
                    <td className="p-4 text-gray-700">{item.capacity}</td>
                    <td className="p-4 text-gray-700">₹{item.hireRatePerDay}</td>
                    <td className="p-4 text-gray-700">{item.durationDays}</td>
                    <td className="p-4 text-gray-700">₹{item.fuelCost}</td>
                    <td className="p-4 text-gray-700">₹{item.operatorCost}</td>
                    <td className="p-4 font-bold text-blue-600">₹{item.totalCost}</td>
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
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                {editingId ? "Edit Equipment Cost" : "Add Equipment Cost"}
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
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    value={form.equipmentName}
                    onChange={(e) =>
                      setForm({ ...form, equipmentName: e.target.value })
                    }
                    placeholder="e.g., Excavator"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({ ...form, capacity: e.target.value })
                    }
                    placeholder="e.g., 20 ton"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Hire Rate per Day (₹)
                  </label>
                  <input
                    type="number"
                    value={form.hireRatePerDay}
                    onChange={(e) =>
                      setForm({ ...form, hireRatePerDay: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) =>
                      setForm({ ...form, durationDays: e.target.value })
                    }
                    placeholder="0"
                    step="1"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Fuel Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={form.fuelCost}
                    onChange={(e) =>
                      setForm({ ...form, fuelCost: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Operator Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={form.operatorCost}
                    onChange={(e) =>
                      setForm({ ...form, operatorCost: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Total Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={form.totalCost}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-blue-700"
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
                {editingId ? "Update" : "Create"} Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentCosts;