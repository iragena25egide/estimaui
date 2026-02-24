import React, { useEffect, useState } from "react";

const Drawings: React.FC = () => {

  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    drawingNo: "",
    title: "",
    discipline: "ARCH",
    revision: "",
    issueDate: "",
    scale: "",
    status: "ISSUED",
    fileUrl: "",
    fileType: "IMAGE"
  });

  
  const loadDrawings = async () => {
    setLoading(true);
    try {
      
      const res:any[] = [];
      setDrawings(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrawings();
  }, []);

 
  const handleSubmit = async () => {

    if (editingId) {
      // await DrawingService.update(editingId, form)
    } else {
      // await DrawingService.create(projectId, form)
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
      fileUrl: "",
      fileType: "IMAGE"
    });

    loadDrawings();
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this drawing?")) return;

    // await DrawingService.delete(id)
    loadDrawings();
  };

  const handleEdit = (d: any) => {
    setEditingId(d.id);
    setForm(d);
    setOpen(true);
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Drawing Register</h2>
          <p className="text-sm text-slate-500">
            Manage project drawings
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Add Drawing
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="p-4">No</th>
              <th className="p-4">Title</th>
              <th className="p-4">Discipline</th>
              <th className="p-4">Revision</th>
              <th className="p-4">Status</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td colSpan={7} className="p-4">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-full" />
                  </td>
                </tr>
              ))}

            {!loading && drawings.map(d => (
              <tr key={d.id} className="border-t hover:bg-slate-50">

                <td className="p-4 font-medium">{d.drawingNo}</td>
                <td className="p-4">{d.title}</td>
                <td className="p-4">{d.discipline}</td>
                <td className="p-4">{d.revision}</td>
                <td className="p-4">{d.status}</td>
                <td className="p-4">
                  {new Date(d.issueDate).toLocaleDateString()}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() => handleEdit(d)}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

            {!loading && drawings.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-500">
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

          <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4">

            <h3 className="text-lg font-semibold">
              {editingId ? "Edit Drawing" : "Create Drawing"}
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {Object.keys(form).map(key => (
                <div key={key} className="space-y-1">

                  <label className="text-xs text-slate-500 capitalize">
                    {key}
                  </label>

                  <input
                    type={key.includes("Date") ? "date" : "text"}
                    value={(form as any)[key]}
                    onChange={e =>
                      setForm({
                        ...form,
                        [key]: e.target.value
                      })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />

                </div>
              ))}

            </div>

            <div className="flex justify-end gap-3 pt-4">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Drawings;