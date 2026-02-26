import React, { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Edit,
  Trash,
  FileIcon,
} from "lucide-react";

const Drawings: React.FC = () => {

  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState<any>({
    drawingNo: "",
    title: "",
    discipline: "ARCH",
    revision: "",
    issueDate: "",
    scale: "",
    status: "ISSUED",
    file: null as File | null,
    fileType: "IFC"
  });

  // ===============================
  // Load Drawings
  // ===============================
  const loadDrawings = async () => {
    setLoading(true);

    try {
      // Replace with API call
      const res: any[] = [];

      setDrawings(res);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrawings();
  }, []);

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async () => {

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value as any);
      }
    });

    if (editingId) {
      // await DrawingService.update(editingId, formData);
    } else {
      // await DrawingService.create(formData);
    }

    setOpen(false);
    setEditingId(null);

    setForm({
      drawingNo: "",
      title: "",
      discipline: "ARCH",
      revision: "",
      issueDate: "",
      scale: "",
      status: "ISSUED",
      file: null,
      fileType: "IFC"
    });

    loadDrawings();
  };

  // ===============================
  // Delete
  // ===============================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete drawing?")) return;

    // await DrawingService.delete(id);
    loadDrawings();
  };

  // ===============================
  // Edit
  // ===============================
  const handleEdit = (d: any) => {
    setEditingId(d.id);
    setForm(d);
    setOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Drawing Register</h2>
          <p className="text-sm text-slate-500">
            Manage project drawings and IFC files
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Drawing
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

        <input
          placeholder="Search drawings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 border rounded-xl p-2"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-4">No</th>
              <th className="p-4">Title</th>
              <th className="p-4">Discipline</th>
              <th className="p-4">Revision</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td colSpan={7} className="p-4">
                  <div className="h-4 bg-slate-200 animate-pulse rounded" />
                </td>
              </tr>
            ))}

            {!loading && drawings.map(d => (
              <tr key={d.id} className="border-t hover:bg-slate-50">

                <td className="p-4 font-medium">{d.drawingNo}</td>
                <td className="p-4">{d.title}</td>
                <td className="p-4">{d.discipline}</td>
                <td className="p-4">{d.revision}</td>

                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    {d.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(d.issueDate).toLocaleDateString()}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>

              </tr>
            ))}

            {!loading && drawings.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-10 text-slate-500">
                  No drawings found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-6">

            <h3 className="text-xl font-semibold">
              {editingId ? "Edit Drawing" : "Create Drawing"}
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {[
                { key: "drawingNo", label: "Drawing Number" },
                { key: "title", label: "Title" },
                { key: "revision", label: "Revision" },
                { key: "scale", label: "Scale" },
                { key: "issueDate", label: "Issue Date", type: "date" }
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs text-slate-500">
                    {field.label}
                  </label>

                  <input
                    type={field.type || "text"}
                    value={form[field.key] || ""}
                    onChange={e =>
                      setForm({
                        ...form,
                        [field.key]: e.target.value
                      })
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
              ))}

              {/* Discipline */}
              <div>
                <label className="text-xs text-slate-500">Discipline</label>

                <select
                  value={form.discipline}
                  onChange={e =>
                    setForm({ ...form, discipline: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option>ARCH</option>
                  <option>STRUCT</option>
                  <option>MEP</option>
                  <option>CIVIL</option>
                </select>
              </div>

            </div>

            {/* FILE UPLOAD */}
            <div className="border-2 border-dashed rounded-xl p-6 text-center">

              <FileIcon className="mx-auto w-8 h-8 text-slate-400 mb-2" />

              <p className="text-sm text-slate-500 mb-3">
                Upload IFC / PDF / Image
              </p>

              <input
                type="file"
                accept=".ifc,.pdf,.png,.jpg"
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setForm({
                      ...form,
                      file: e.target.files[0]
                    });
                  }
                }}
                className="mx-auto"
              />

              {form.file && (
                <div className="mt-3 text-sm text-blue-600">
                  {form.file.name}
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Save Drawing
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Drawings;