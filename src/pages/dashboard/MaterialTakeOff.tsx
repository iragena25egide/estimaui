import React, { useEffect, useState } from "react";

const MaterialTakeOff = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    materialName: "",
    unit: "",
    quantity: "",
    rate: "",
    wastagePercent: "",
    totalCost: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any[] = [];
      setItems(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      // update
    } else {
      // create
    }
    setOpen(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete material?")) return;
    loadData();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm(item);
    setOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Material Take-Off</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add Material
        </button>
      </div>

      <div className="rounded-xl border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Material</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Wastage %</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-6">
                  <div className="h-4 bg-slate-200 animate-pulse rounded" />
                </td>
              </tr>
            )}
            {!loading &&
              items.map((i) => (
                <tr key={i.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">{i.materialName}</td>
                  <td className="p-3">{i.unit}</td>
                  <td className="p-3">{i.quantity}</td>
                  <td className="p-3">{i.rate}</td>
                  <td className="p-3">{i.wastagePercent}</td>
                  <td className="p-3">{i.totalCost}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(i)} className="text-blue-600 text-xs">Edit</button>
                    <button onClick={() => handleDelete(i.id)} className="text-red-600 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialTakeOff;