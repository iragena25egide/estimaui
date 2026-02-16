import React from "react";

const BillOfQuantity: React.FC = () => {
  const mock = [
    { id: 'b1', itemNo: '1.1', description: 'Concrete', unit: 'm3', qty: 120 },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bill of Quantity</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Item No</th>
              <th className="py-2">Description</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Qty</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(b => (
              <tr key={b.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{b.itemNo}</td>
                <td className="py-3">{b.description}</td>
                <td className="py-3">{b.unit}</td>
                <td className="py-3">{b.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BillOfQuantity;
