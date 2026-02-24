import React, { useEffect, useState } from "react";

interface Spec {
  id: string;
  specSection: string;
  description: string;
  discipline: string;
}

const SpecificationRegister: React.FC = () => {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    specSection: "",
    description: "",
    discipline: "ARCH"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mock: Spec[] = [
      { id: "s1", specSection: "01", description: "General Requirements", discipline: "ARCH" }
    ];
    setSpecs(mock);
  };

  const handleSubmit = () => {
    if (editingId) {
      setSpecs(prev =>
        prev.map(s => s.id === editingId ? { ...s, ...form } : s)
      );
    } else {
      setSpecs(prev => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setOpen(false);
    setEditingId(null);
    setForm({ specSection: "", description: "", discipline: "ARCH" });
  };

  const handleEdit = (spec: Spec) => {
    setEditingId(spec.id);
    setForm(spec);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete specification?")) return;
    setSpecs(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Specification Register</h2>
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + Add Spec
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-600">
              <th className="py-2 text-left">Section</th>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-left">Discipline</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {specs.map(s => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{s.specSection}</td>
                <td className="py-3">{s.description}</td>
                <td className="py-3">{s.discipline}</td>
                <td className="py-3 space-x-3">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 text-xs">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
            <h3 className="font-semibold">{editingId ? "Edit Spec" : "Add Spec"}</h3>
            <input placeholder="Section" className="border p-2 w-full rounded"
              value={form.specSection}
              onChange={e => setForm({ ...form, specSection: e.target.value })}
            />
            <input placeholder="Description" className="border p-2 w-full rounded"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <select className="border p-2 w-full rounded"
              value={form.discipline}
              onChange={e => setForm({ ...form, discipline: e.target.value })}
            >
              <option>ARCH</option>
              <option>STRUCT</option>
              <option>MEP</option>
              <option>CIVIL</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationRegister;