import React, { useEffect, useState } from "react";
import ProjectService from "../../services/projectService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConfirmModal from "../../components/ui/ConfirmModal";
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
import { Plus, Trash, Edit, Search, X, FolderOpen, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    if (value) {
      const parts = value.split('T')[0].split('-');
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parseInt(parts[1], 10).toString());
        setDay(parseInt(parts[2], 10).toString());
      }
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  }, [value]);

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
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-3">
        <Select
          value={day}
          onValueChange={(val) => {
            setDay(val);
            handleDateChange(val, month, year);
          }}
        >
          <SelectTrigger className="bg-white border-gray-200 rounded-xl h-11 text-gray-700 shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all">
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
          value={month}
          onValueChange={(val) => {
            setMonth(val);
            handleDateChange(day, val, year);
          }}
        >
          <SelectTrigger className="bg-white border-gray-200 rounded-xl h-11 text-gray-700 shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all">
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
          value={year}
          onValueChange={(val) => {
            setYear(val);
            handleDateChange(day, month, val);
          }}
        >
          <SelectTrigger className="bg-white border-gray-200 rounded-xl h-11 text-gray-700 shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all">
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
  const [error, setError] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

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

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await ProjectService.deleteProject(deleteId);
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      toast.success("Project deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
      toast.error("Failed to delete project.");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setForm(p);
    setOpen(true);
  };

  const handleView = (p: any) => {
    setSelectedProject(p);
    setViewOpen(true);
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
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="font-semibold text-gray-600">Project</TableHead>
                <TableHead className="font-semibold text-gray-600">Client</TableHead>
                <TableHead className="font-semibold text-gray-600">Location</TableHead>
                <TableHead className="font-semibold text-gray-600">Type</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 bg-gray-200 rounded w-24"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-20"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-20"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-16"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-16"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-20"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    {search
                      ? "No projects match your search."
                      : "No projects found. Click 'New Project' to create one."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((p) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell className="text-gray-700">{p.client}</TableCell>
                    <TableCell className="text-gray-700">{p.location}</TableCell>
                    <TableCell className="text-gray-700">{p.projectType}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          p.status
                        )}`}
                      >
                        {p.status || "Planning"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!isViewer && (
                          <>
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
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
                <Select
                  value={form.contractType}
                  onValueChange={(value) => setForm({ ...form, contractType: value })}
                >
                  <SelectTrigger className="border-gray-200 rounded-lg">
                    <SelectValue placeholder="Select Contract Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUMP_SUM">Lump Sum</SelectItem>
                    <SelectItem value="BOQ">BOQ (Bill of Quantities)</SelectItem>
                    <SelectItem value="COST_PLUS">Cost Plus</SelectItem>
                  </SelectContent>
                </Select>
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Project Details
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Project Name</p>
                  <p className="font-semibold text-gray-900">{selectedProject.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Client</p>
                  <p className="font-semibold text-gray-900">{selectedProject.client}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                  <p className="text-gray-900">{selectedProject.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Project Type</p>
                  <p className="text-gray-900">{selectedProject.projectType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Contract Type</p>
                  <p className="text-gray-900">{selectedProject.contractType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Estimator</p>
                  <p className="text-gray-900">{selectedProject.estimatorName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Start Date</p>
                  <p className="text-gray-900">{selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Completion Date</p>
                  <p className="text-gray-900">{selectedProject.completionDate ? new Date(selectedProject.completionDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <span className={`px-2 py-1 mt-1 inline-block rounded-full text-xs font-medium ${getStatusStyle(selectedProject.status)}`}>
                    {selectedProject.status || "Planning"}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-6 border-t border-gray-200 bg-gray-50">
            <Button onClick={() => setViewOpen(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will delete all associated estimations and costs."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Projects;