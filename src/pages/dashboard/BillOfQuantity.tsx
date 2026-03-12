import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  X,
  FolderOpen,
  Calculator,
} from "lucide-react";
import BoqService from "@/services/BoqService";
import DrawingService from "@/services/drawingService";
import { toast } from "sonner"; 

const BoqItems: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    itemNo: "",
    description: "",
    unit: "",
    quantity: "",
    materialRate: "",
    laborRate: "",
    equipmentRate: "",
    totalRate: "",
    amount: "",
    section: "",
    projectId: "",
  });

  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await DrawingService.getDrawingSummary();
        setProjects(res);
        if (res.length > 0) setSelectedProjectId(res[0].projectId);
      } catch (error) {
        console.error("Failed to load projects", error);
        toast?.error("Failed to load projects");
      }
    };
    loadProjects();
  }, []);

  
  useEffect(() => {
    if (selectedProjectId) {
      loadItems();
    } else {
      setItems([]);
    }
  }, [selectedProjectId]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await BoqService.getByProject(selectedProjectId);
      setItems(data);
    } catch (error) {
      console.error("Failed to load BOQ items", error);
      toast?.error("Failed to load BOQ items");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const qty = parseFloat(form.quantity) || 0;
    const material = parseFloat(form.materialRate) || 0;
    const labor = parseFloat(form.laborRate) || 0;
    const equipment = parseFloat(form.equipmentRate) || 0;
    const total = material + labor + equipment;
    const amount = qty * total;

    setForm((prev) => ({
      ...prev,
      totalRate: total.toFixed(2),
      amount: amount.toFixed(2),
    }));
  }, [form.quantity, form.materialRate, form.laborRate, form.equipmentRate]);

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast?.warning("Please select a project first.");
      return;
    }

    try {
      const payload = {
        ...form,
        projectId: selectedProjectId,
        quantity: parseFloat(form.quantity),
        materialRate: parseFloat(form.materialRate),
        laborRate: parseFloat(form.laborRate),
        equipmentRate: parseFloat(form.equipmentRate),
        totalRate: parseFloat(form.totalRate),
        amount: parseFloat(form.amount),
      };

      if (editingId) {
        await BoqService.update(editingId, payload);
        toast?.success("BOQ item updated");
      } else {
        await BoqService.create(payload);
        toast?.success("BOQ item created");
      }

      resetForm();
      loadItems();
    } catch (error) {
      console.error("Save error", error);
      toast?.error("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this BOQ item?")) return;
    try {
      await BoqService.delete(id);
      toast?.success("BOQ item deleted");
      loadItems();
    } catch (error) {
      console.error("Delete error", error);
      toast?.error("Delete failed");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      itemNo: item.itemNo || "",
      description: item.description || "",
      unit: item.unit || "",
      quantity: item.quantity?.toString() || "",
      materialRate: item.materialRate?.toString() || "",
      laborRate: item.laborRate?.toString() || "",
      equipmentRate: item.equipmentRate?.toString() || "",
      totalRate: item.totalRate?.toString() || "",
      amount: item.amount?.toString() || "",
      section: item.section || "",
      projectId: item.projectId || selectedProjectId,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      itemNo: "",
      description: "",
      unit: "",
      quantity: "",
      materialRate: "",
      laborRate: "",
      equipmentRate: "",
      totalRate: "",
      amount: "",
      section: "",
      projectId: selectedProjectId,
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemNo?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.section?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">BOQ Items</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Bill of Quantities for selected project
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
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))}
            </select>
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
            Add Item
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by item no, description or section..."
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

      {/* BOQ Items Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Item No</th>
                <th className="p-4 text-left font-semibold text-gray-600">Description</th>
                <th className="p-4 text-left font-semibold text-gray-600">Section</th>
                <th className="p-4 text-left font-semibold text-gray-600">Unit</th>
                <th className="p-4 text-left font-semibold text-gray-600">Qty</th>
                <th className="p-4 text-left font-semibold text-gray-600">Material</th>
                <th className="p-4 text-left font-semibold text-gray-600">Labor</th>
                <th className="p-4 text-left font-semibold text-gray-600">Equipment</th>
                <th className="p-4 text-left font-semibold text-gray-600">Total Rate</th>
                <th className="p-4 text-left font-semibold text-gray-600">Amount</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : !selectedProjectId ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-gray-500">
                    Please select a project to view BOQ items.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-gray-500">
                    No BOQ items found.{" "}
                    <button
                      onClick={() => setOpen(true)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Add your first item
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{item.itemNo}</td>
                    <td className="p-4 text-gray-700">{item.description}</td>
                    <td className="p-4 text-gray-700">{item.section}</td>
                    <td className="p-4 text-gray-700">{item.unit}</td>
                    <td className="p-4 text-gray-700">{item.quantity}</td>
                    <td className="p-4 text-gray-700">₹{item.materialRate}</td>
                    <td className="p-4 text-gray-700">₹{item.laborRate}</td>
                    <td className="p-4 text-gray-700">₹{item.equipmentRate}</td>
                    <td className="p-4 font-medium text-blue-600">₹{item.totalRate}</td>
                    <td className="p-4 font-bold text-gray-900">₹{item.amount}</td>
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

      {/* Add/Edit BOQ Item Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                {editingId ? "Edit BOQ Item" : "Create BOQ Item"}
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
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Item Number
                  </label>
                  <input
                    type="text"
                    value={form.itemNo}
                    onChange={(e) => setForm({ ...form, itemNo: e.target.value })}
                    placeholder="e.g., 1.1"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Section
                  </label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    placeholder="e.g., Substructure"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Description
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed description"
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
                    placeholder="e.g., m³, kg, no"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Material Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={form.materialRate}
                    onChange={(e) => setForm({ ...form, materialRate: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Labor Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={form.laborRate}
                    onChange={(e) => setForm({ ...form, laborRate: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Equipment Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={form.equipmentRate}
                    onChange={(e) => setForm({ ...form, equipmentRate: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Total Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={form.totalRate}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.amount}
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
                {editingId ? "Update" : "Create"} Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoqItems;