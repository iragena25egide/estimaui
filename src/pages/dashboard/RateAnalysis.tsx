import React, { useEffect, useState } from "react";

const RateAnalysis = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    itemName: "",
    unit: "",
    materialCost: "",
    laborCost: "",
    equipmentCost: "",
    overheadPercent: "",
    profitPercent: "",
    totalRate: ""
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
    if (!confirm("Delete rate analysis?")) return;
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
        <h2 className="text-xl font-bold">Rate Analysis</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add Analysis
        </button>
      </div>

      <div className="rounded-xl border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Material</th>
              <th className="p-3">Labor</th>
              <th className="p-3">Equipment</th>
              <th className="p-3">Total Rate</th>
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
                  <td className="p-3">{i.itemName}</td>
                  <td className="p-3">{i.unit}</td>
                  <td className="p-3">{i.materialCost}</td>
                  <td className="p-3">{i.laborCost}</td>
                  <td className="p-3">{i.equipmentCost}</td>
                  <td className="p-3">{i.totalRate}</td>
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

export default RateAnalysis;