import React, { useState } from "react";

interface Report {
  id: string;
  project: string;
  version: number;
  totalAmount: number;
  status: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: "1", project: "Residential Complex", version: 1, totalAmount: 850000, status: "GENERATED" }
  ]);

  const generateReport = () => {
    const newReport: Report = {
      id: Date.now().toString(),
      project: "New Project",
      version: reports.length + 1,
      totalAmount: Math.floor(Math.random() * 1000000),
      status: "GENERATED"
    };
    setReports(prev => [...prev, newReport]);
  };

  const deleteReport = (id: string) => {
    if (!confirm("Delete report?")) return;
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Reports</h2>
        <button onClick={generateReport} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
          + Generate Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-600">
              <th className="py-2 text-left">Project</th>
              <th className="py-2 text-left">Version</th>
              <th className="py-2 text-left">Total</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{r.project}</td>
                <td className="py-3">v{r.version}</td>
                <td className="py-3">${r.totalAmount.toLocaleString()}</td>
                <td className="py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    {r.status}
                  </span>
                </td>
                <td className="py-3">
                  <button onClick={() => deleteReport(r.id)} className="text-red-600 text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;