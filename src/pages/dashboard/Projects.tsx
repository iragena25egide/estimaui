import React from "react";

const Projects: React.FC = () => {
  const mock = [
    { id: "p1", name: "Residential Complex", client: "Urban Devs", value: 850000, status: "In Progress" },
    { id: "p2", name: "Mall Extension", client: "Metro Co", value: 1200000, status: "In Progress" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Client</th>
              <th className="py-2">Value</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mock.map((p) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{p.name}</td>
                <td className="py-3">{p.client}</td>
                <td className="py-3">${(p.value / 1000).toFixed(0)}K</td>
                <td className="py-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
