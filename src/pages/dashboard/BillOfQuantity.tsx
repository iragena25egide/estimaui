import React, { useEffect, useState } from "react";

const BoqItems = () => {

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    itemNo: "",
    description: "",
    unit: "",
    quantity: "",
    materialRate: "",
    laborRate: "",
    equipmentRate: "",
    totalRate: "",
    amount: "",
    section: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res:any[] = [];
      setItems(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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

  const handleDelete = async (id:string) => {
    if (!confirm("Delete item?")) return;
    loadData();
  };

  const handleEdit = (item:any) => {
    setEditingId(item.id);
    setForm(item);
    setOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

      <div className="flex justify-between">
        <h2 className="text-xl font-bold">BOQ Items</h2>
        <button onClick={()=>setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + Add Item
        </button>
      </div>

      <div className="rounded-xl border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Item No</th>
              <th className="p-3">Description</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total Rate</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="p-6">
                <div className="h-4 bg-slate-200 animate-pulse rounded"/>
              </td></tr>
            )}

            {!loading && items.map(i=>(
              <tr key={i.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{i.itemNo}</td>
                <td className="p-3">{i.description}</td>
                <td className="p-3">{i.unit}</td>
                <td className="p-3">{i.quantity}</td>
                <td className="p-3">{i.totalRate}</td>
                <td className="p-3">{i.amount}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>handleEdit(i)} className="text-blue-600 text-xs">Edit</button>
                  <button onClick={()=>handleDelete(i.id)} className="text-red-600 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl space-y-4">
            <h3 className="font-semibold">{editingId ? "Edit Item" : "Create Item"}</h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(form).map(key=>(
                <input
                  key={key}
                  type="text"
                  placeholder={key}
                  value={(form as any)[key]}
                  onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="border px-3 py-2 rounded-md text-sm"
                />
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={()=>setOpen(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BoqItems;