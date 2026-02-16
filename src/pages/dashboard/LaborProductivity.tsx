import React from "react";

const LaborProductivity: React.FC = () => {
  const mock = [
    { id: 'l1', trade: 'Carpentry', activity: 'Framing', productivityRate: 0.8, manHours: 120, totalLaborCost: 2400 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Labor Productivity</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Trade</th>
              <th className="py-2">Activity</th>
              <th className="py-2">Productivity Rate</th>
              <th className="py-2">Man Hours</th>
              <th className="py-2">Total Labor Cost</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(m => (
              <tr key={m.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{m.trade}</td>
                <td className="py-3">{m.activity}</td>
                <td className="py-3">{m.productivityRate}</td>
                <td className="py-3">{m.manHours}</td>
                <td className="py-3">${m.totalLaborCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LaborProductivity;
