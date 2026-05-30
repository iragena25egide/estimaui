import React, { useEffect, useState } from "react";
import ProjectService from "../../services/projectService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
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
import { Plus, Trash, Edit, Search, X, FolderOpen } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
  const parsedDate = value ? new Date(value) : null;
  const currentDay = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getDate().toString() : "";
  const currentMonth = parsedDate && !isNaN(parsedDate.getTime()) ? (parsedDate.getMonth() + 1).toString() : "";
  const currentYear = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getFullYear().toString() : "";

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" }
  ];
  const currentYr = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYr - 5 + i).toString());

  const handleDateChange = (d: string, m: string, y: string) => {
    if (d && m && y) {
      const paddedDay = d.padStart(2, '0');
      const paddedMonth = m.padStart(2, '0');
      onChange(`${y}-${paddedMonth}-${paddedDay}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={currentDay}
          onValueChange={(val) => handleDateChange(val, currentMonth, currentYear)}
        >
          <SelectTrigger className="border-gray-200 rounded-lg">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentMonth}
          onValueChange={(val) => handleDateChange(currentDay, val, currentYear)}
        >
          <SelectTrigger className="border-gray-200 rounded-lg">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentYear}
          onValueChange={(val) => handleDateChange(currentDay, currentMonth, val)}
        >
          <SelectTrigger className="border-gray-200 rounded-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const { isViewer } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<any>({
    name: "",
    client: "",
    location: "",
    projectType: "",
    contractType: "",
    estimatorName: "",
    startDate: "",
    completionDate: "",
    status: "Planning",
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await ProjectService.getMyProjects();
      setProjects(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await ProjectService.updateProject(editingId, form);
        toast.success("Project updated successfully!");
      } else {
        await ProjectService.createProject(form);
        toast.success("Project created successfully!");
      }
      resetForm();
      loadProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save project. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    try {
      await ProjectService.deleteProject(id);
      toast.success("Project deleted successfully!");
      loadProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project.");
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setForm(p);
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm({
      name: "",
      client: "",
      location: "",
      projectType: "",
      contractType: "",
      estimatorName: "",
      startDate: "",
      completionDate: "",
      status: "Planning",
    });
  };

  const filteredProjects = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Planning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const clearSearch = () => setSearch("");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your estimation projects
          </p>
        </div>
        {!isViewer && (
          <Button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search projects..."
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
                <th className="p-4 text-left font-semibold text-gray-600">Project</th>
                <th className="p-4 text-left font-semibold text-gray-600">Client</th>
                <th className="p-4 text-left font-semibold text-gray-600">Location</th>
                <th className="p-4 text-left font-semibold text-gray-600">Type</th>
                <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {search
                      ? "No projects match your search."
                      : "No projects found. Click 'New Project' to create one."}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                    <td className="p-4 text-gray-700">{p.client}</td>
                    <td className="p-4 text-gray-700">{p.location}</td>
                    <td className="p-4 text-gray-700">{p.projectType}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          p.status
                        )}`}
                      >
                        {p.status || "Planning"}
                      </span>
                    </td>
                    <td className="p-4">
                      {isViewer ? (
                        <span className="text-gray-400 font-medium text-xs bg-gray-50 px-2 py-1 rounded border">Read-only</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
              <FolderOpen className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Project Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Commercial Tower"
                  className="border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Client
                </label>
                <Input
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="e.g., ABC Corp"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Location
                </label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., New York, NY"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Project Type
                </label>
                <Input
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  placeholder="e.g., Residential"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Contract Type
                </label>
                <Input
                  value={form.contractType}
                  onChange={(e) => setForm({ ...form, contractType: e.target.value })}
                  placeholder="e.g., Fixed Price"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Estimator Name
                </label>
                <Input
                  value={form.estimatorName}
                  onChange={(e) => setForm({ ...form, estimatorName: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="border-gray-200 rounded-lg"
                />
              </div>

              <CustomDatePicker
                label="Start Date"
                value={form.startDate}
                onChange={(val) => setForm({ ...form, startDate: val })}
              />

              <CustomDatePicker
                label="Completion Date"
                value={form.completionDate}
                onChange={(val) => setForm({ ...form, completionDate: val })}
              />

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger className="border-gray-200 rounded-lg">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
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
                {editingId ? "Update" : "Create"} Project
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;