import React, { useEffect, useState } from "react";
import API from "../../context/axios";

interface Report {
  id: string;
  project: any;
  version: number;
  totalAmount: number;
  status: string;
  filePath?: string;
}

const Reports: React.FC = () => {

  const [reports, setReports] = useState<Report[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  const loadReports = async () => {
    const res = await API.get("/reports");
    setReports(res.data);
  };

  const loadProjects = async () => {
    const res = await API.get("/projects/my");
    setProjects(res.data);
  };

  useEffect(()=>{
    loadReports();
    loadProjects();
  },[]);

  const generateReport = async () => {
    if(!selectedProject){
      alert("Select project");
      return;
    }

    await API.post(`/reports/generate/${selectedProject}`);

    loadReports();
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports</h2>

        <button
          onClick={generateReport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Generate Report
        </button>
      </div>

      {/* Project Selection */}
      <div className="bg-white p-4 rounded-xl border max-w-md">
        <select
          className="w-full border p-2 rounded"
          value={selectedProject}
          onChange={e=>setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>

          {projects.map(p=>(
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}

        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Project</th>
              <th className="p-4 text-left">Version</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {reports.map(r=>(
              <tr key={r.id} className="border-t hover:bg-slate-50">

                <td className="p-4">
                  {r.project?.name}
                </td>

                <td className="p-4">
                  v{r.version}
                </td>

                <td className="p-4 font-semibold">
                  ${r.totalAmount?.toLocaleString()}
                </td>

                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    {r.status}
                  </span>
                </td>

                <td className="p-4">
                  {r.filePath && (
                    <a
                      href={r.filePath}
                      target="_blank"
                      className="text-blue-600 text-sm underline"
                    >
                      View PDF
                    </a>
                  )}
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