import React from "react";

const RateAnalysis: React.FC = () => {
  const mock = [
    { id: 'r1', boqItemNo: '1.1', description: 'Concrete', finalUnitRate: 120 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Rate Analysis</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">BOQ Item No</th>
              <th className="py-2">Description</th>
              <th className="py-2">Final Unit Rate</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(r => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{r.boqItemNo}</td>
                <td className="py-3">{r.description}</td>
                <td className="py-3">{r.finalUnitRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RateAnalysis;
