import React, { useEffect, useState } from "react";
import ProjectService from "../../services/projectService";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Trash, Edit, Search } from "lucide-react";

const Projects: React.FC = () => {

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
    completionDate: ""
  });

  // ======================
  // Load Projects
  // ======================
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

  // ======================
  // Submit
  // ======================
  const handleSubmit = async () => {
    if (editingId) {
      await ProjectService.updateProject(editingId, form);
    } else {
      await ProjectService.createProject(form);
    }

    setOpen(false);
    setEditingId(null);

    loadProjects();
  };

  // ======================
  const handleDelete = async (id:string) => {
    if (!confirm("Delete project?")) return;

    await ProjectService.deleteProject(id);
    loadProjects();
  };

  const handleEdit = (p:any) => {
    setEditingId(p.id);
    setForm(p);
    setOpen(true);
  };

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ======================
  const getStatusStyle = (status:string) => {
    switch(status){
      case "Completed":
        return "bg-green-50 text-green-700";
      case "In Progress":
        return "bg-blue-50 text-blue-700";
      case "Planning":
        return "bg-yellow-50 text-yellow-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

 return (
  <div className="max-w-7xl mx-auto">

    {/* Main White Container */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">

      {/* HEADER + ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500">
            Manage your estimation projects
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-slate-50 border-slate-200"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>

          <Button
            onClick={()=>setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2"/>
            New Project
          </Button>

        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">

              <th className="p-4 font-medium">Project</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Actions</th>

            </tr>
          </thead>

          <tbody>

            {loading &&
              Array.from({length:5}).map((_,i)=>(
                <tr key={i} className="border-t border-slate-100">
                  <td colSpan={5} className="p-4">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-full"/>
                  </td>
                </tr>
              ))
            }

            {!loading && filteredProjects.map(p=>(
              <tr
                key={p.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >

                <td className="p-4 font-medium text-slate-900">
                  {p.name}
                </td>

                <td className="p-4 text-slate-600">{p.client}</td>
                <td className="p-4 text-slate-600">{p.location}</td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(p.status)}`}>
                    {p.status || "Draft"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">

                    <Button size="sm" variant="outline"
                      onClick={()=>handleEdit(p)}>
                      <Edit className="w-4 h-4"/>
                    </Button>

                    <Button size="sm" variant="destructive"
                      onClick={()=>handleDelete(p.id)}>
                      <Trash className="w-4 h-4"/>
                    </Button>

                  </div>
                </td>

              </tr>
            ))}

            {!loading && filteredProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-slate-500">
                  No projects found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>

    {/* MODAL */}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            {editingId ? "Edit Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {[
            {key:"name", label:"Project Name"},
            {key:"client", label:"Client"},
            {key:"location", label:"Location"},
            {key:"projectType", label:"Project Type"},
            {key:"contractType", label:"Contract Type"},
            {key:"estimatorName", label:"Estimator"},
            {key:"startDate", label:"Start Date", type:"date"},
            {key:"completionDate", label:"Completion Date", type:"date"}
          ].map(field=>(
            <div key={field.key} className="space-y-1">
              <label className="text-xs text-slate-500">
                {field.label}
              </label>

              <Input
                type={field.type || "text"}
                value={form[field.key] || ""}
                onChange={e =>
                  setForm({
                    ...form,
                    [field.key]: e.target.value
                  })
                }
              />
            </div>
          ))}

        </div>

        <Button onClick={handleSubmit} className="w-full mt-4">
          Save Project
        </Button>

      </DialogContent>
    </Dialog>

  </div>
);
};

export default Projects;