import React, { useEffect, useState } from "react";

const EquipmentCosts = () => {

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    equipmentName: "",
    capacity: "",
    hireRatePerDay: "",
    durationDays: "",
    fuelCost: "",
    operatorCost: "",
    totalCost: ""
  });

  const loadData = async ()=>{
    setLoading(true);
    try {
      const res:any[] = [];
      setItems(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadData(); },[]);

  const handleSubmit = async ()=>{
    if(editingId){
      // update
    } else {
      // create
    }
    setOpen(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = async(id:string)=>{
    if(!confirm("Delete equipment?")) return;
    loadData();
  };

  const handleEdit = (item:any)=>{
    setEditingId(item.id);
    setForm(item);
    setOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Equipment Costs</h2>
        <button onClick={()=>setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + Add Equipment
        </button>
      </div>

      <div className="rounded-xl border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Equipment</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Rate/Day</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Total Cost</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="p-6">
                <div className="h-4 bg-slate-200 animate-pulse rounded"/>
              </td></tr>
            )}
            {!loading && items.map(i=>(
              <tr key={i.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{i.equipmentName}</td>
                <td className="p-3">{i.capacity}</td>
                <td className="p-3">{i.hireRatePerDay}</td>
                <td className="p-3">{i.durationDays}</td>
                <td className="p-3">{i.totalCost}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>handleEdit(i)} className="text-blue-600 text-xs">Edit</button>
                  <button onClick={()=>handleDelete(i.id)} className="text-red-600 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EquipmentCosts;