import React from "react";

const EquipmentCosts: React.FC = () => {
  const mock = [
    { id: 'e1', name: 'Crane', hireRatePerDay: 2000, durationDays: 10, totalCost: 20000 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Equipment Costs</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Equipment</th>
              <th className="py-2">Hire Rate/Day</th>
              <th className="py-2">Duration (days)</th>
              <th className="py-2">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(e => (
              <tr key={e.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{e.name}</td>
                <td className="py-3">${e.hireRatePerDay}</td>
                <td className="py-3">{e.durationDays}</td>
                <td className="py-3">${e.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EquipmentCosts;
