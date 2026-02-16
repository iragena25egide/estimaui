import React from "react";

const Reports: React.FC = () => {
  const mock = [
    { id: 'rep1', project: 'Residential Complex', version: 1, totalAmount: 850000, status: 'GENERATED' }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Project</th>
              <th className="py-2">Version</th>
              <th className="py-2">Total Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(r => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{r.project}</td>
                <td className="py-3">{r.version}</td>
                <td className="py-3">${(r.totalAmount/1000).toFixed(0)}K</td>
                <td className="py-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports;
