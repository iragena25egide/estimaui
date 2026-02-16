import React from "react";

const MaterialTakeOff: React.FC = () => {
  const mock = [
    { id: 'm1', materialName: 'Cement', specification: '42.5', unit: 'bags', quantity: 200 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Material Take Off</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Material</th>
              <th className="py-2">Specification</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(m => (
              <tr key={m.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{m.materialName}</td>
                <td className="py-3">{m.specification}</td>
                <td className="py-3">{m.unit}</td>
                <td className="py-3">{m.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MaterialTakeOff;
