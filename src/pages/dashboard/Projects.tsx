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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Trash, Edit } from "lucide-react";

const Projects: React.FC = () => {

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    client: "",
    location: "",
    projectType: "",
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
  // Submit Form
  // ======================
  const handleSubmit = async () => {
    try {

      if (editingId) {
        await ProjectService.updateProject(editingId, form);
      } else {
        await ProjectService.createProject(form);
      }

      setOpen(false);
      setEditingId(null);

      setForm({
        name: "",
        client: "",
        location: "",
        projectType: "",
      });

      loadProjects();

    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // Delete Project
  // ======================
  const handleDelete = async (id:string) => {
    if (!confirm("Delete this project?")) return;

    await ProjectService.deleteProject(id);
    loadProjects();
  };

  // ======================
  // Edit Project
  // ======================
  const handleEdit = (project:any) => {
    setEditingId(project.id);
    setForm(project);
    setOpen(true);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects</h2>

        <Button onClick={()=>{
          setEditingId(null);
          setForm({
            name:"",
            client:"",
            location:"",
            projectType:""
          });
          setOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2"/>
          New Project
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white">
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {projects.map(p=>(
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.client}</TableCell>
                <TableCell>{p.location}</TableCell>
                <TableCell>{p.projectType}</TableCell>

                <TableCell className="flex gap-2">

                  <Button size="sm" variant="outline"
                    onClick={()=>handleEdit(p)}>
                    <Edit className="w-4 h-4"/>
                  </Button>

                  <Button size="sm" variant="destructive"
                    onClick={()=>handleDelete(p.id)}>
                    <Trash className="w-4 h-4"/>
                  </Button>

                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </div>

      {/* Modal Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Project" : "Create Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            <Input
              placeholder="Project Name"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
            />

            <Input
              placeholder="Client"
              value={form.client}
              onChange={e=>setForm({...form,client:e.target.value})}
            />

            <Input
              placeholder="Location"
              value={form.location}
              onChange={e=>setForm({...form,location:e.target.value})}
            />

            <Input
              placeholder="Project Type"
              value={form.projectType}
              onChange={e=>setForm({...form,projectType:e.target.value})}
            />

            <Button className="w-full" onClick={handleSubmit}>
              Save Project
            </Button>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Projects;