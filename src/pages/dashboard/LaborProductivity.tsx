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
import LaborProductivityService from "@/services/laborProductivity";

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
    activity: "",       
    trade: "",
    productivityRate: "",
    manHours: "",
    laborRatePerHour: "",
    totalLaborCost: "",
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

  // Load records when project changes
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

  // Auto-calculate total labor cost (backend formula)
  useEffect(() => {
    const manHours = parseFloat(form.manHours) || 0;
    const rate = parseFloat(form.laborRatePerHour) || 0;
    const productivity = parseFloat(form.productivityRate) || 0;
    const total = manHours * rate * (productivity / 100);
    setForm((prev) => ({ ...prev, totalLaborCost: total.toFixed(2) }));
  }, [form.manHours, form.laborRatePerHour, form.productivityRate]);

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.warning("Please select a project first.");
      return;
    }

    const requiredFields = [
      { field: "activity", label: "Activity" },
      { field: "trade", label: "Trade" },
      { field: "productivityRate", label: "Productivity Rate" },
      { field: "manHours", label: "Man Hours" },
      { field: "laborRatePerHour", label: "Labor Rate per Hour" }
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
      productivityRate: parseFloat(form.productivityRate),
      manHours: parseFloat(form.manHours),
      laborRatePerHour: parseFloat(form.laborRatePerHour),
      totalLaborCost: parseFloat(form.totalLaborCost),
    };

    try {
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
      activity: item.activity || "",
      trade: item.trade || "",
     
      productivityRate: item.productivityRate?.toString() || "",
      manHours: item.manHours?.toString() || "",
      laborRatePerHour: item.laborRatePerHour?.toString() || "",
      totalLaborCost: item.totalLaborCost?.toString() || "",
      projectId: item.projectId || selectedProjectId,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      activity: "",
      trade: "",
      productivityRate: "",
      manHours: "",
      laborRatePerHour: "",
      totalLaborCost: "",
      projectId: selectedProjectId,
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.activity?.toLowerCase().includes(search.toLowerCase()) ||
      item.trade?.toLowerCase().includes(search.toLowerCase()) ||
      item.unit?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
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
            Add Labor
          </Button>
        </div>
      </div>

      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by activity, trade or unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Activity</th>
                <th className="p-4 text-left font-semibold text-gray-600">Trade</th>
                
                <th className="p-4 text-left font-semibold text-gray-600">Productivity (%)</th>
                <th className="p-4 text-left font-semibold text-gray-600">Man Hours</th>
                <th className="p-4 text-left font-semibold text-gray-600">Rate/Hour </th>
                <th className="p-4 text-left font-semibold text-gray-600">Total Cost </th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading.items ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : !selectedProjectId ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    Please select a project to view labor productivity records.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
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
                    <td className="p-4 text-gray-700">{item.activity}</td>
                    <td className="p-4 font-medium text-gray-900">{item.trade}</td>
                    <td className="p-4 text-gray-700">{item.productivityRate}%</td>
                    <td className="p-4 text-gray-700">{item.manHours}</td>
                    <td className="p-4 text-gray-700">{item.laborRatePerHour}</td>
                    <td className="p-4 font-bold text-blue-600">{item.totalLaborCost}</td>
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

      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Labor Productivity" : "Add Labor Productivity"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Activity <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.activity}
                  onChange={(e) => setForm({ ...form, activity: e.target.value })}
                  placeholder="e.g., Bricklaying, Plastering"
                  className="border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Trade <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.trade}
                  onChange={(e) => setForm({ ...form, trade: e.target.value })}
                  placeholder="e.g., Mason, Carpenter"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Productivity Rate (%) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={form.productivityRate}
                  onChange={(e) => setForm({ ...form, productivityRate: e.target.value })}
                  placeholder="e.g., 85"
                  step="0.1"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Man Hours <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={form.manHours}
                  onChange={(e) => setForm({ ...form, manHours: e.target.value })}
                  placeholder="e.g., 8"
                  step="0.5"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Labor Rate per Hour  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={form.laborRatePerHour}
                  onChange={(e) => setForm({ ...form, laborRatePerHour: e.target.value })}
                  placeholder="e.g., 500"
                  step="1"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Total Labor Cost 
                </label>
                <Input
                  type="number"
                  value={form.totalLaborCost}
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
                {editingId ? "Update" : "Create"} Labor
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaborProductivity;