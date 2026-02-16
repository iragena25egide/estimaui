import React from "react";

const DimensionSheets: React.FC = () => {
  const mock = [
    { id: 's1', code: 'DS-01', description: 'Room dimensions', unit: 'm', rate: 10, quantity: 50 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dimension Sheets</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Code</th>
              <th className="py-2">Description</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Rate</th>
              <th className="py-2">Qty</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(d => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{d.code}</td>
                <td className="py-3">{d.description}</td>
                <td className="py-3">{d.unit}</td>
                <td className="py-3">{d.rate}</td>
                <td className="py-3">{d.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DimensionSheets;
