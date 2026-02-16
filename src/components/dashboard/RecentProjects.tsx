import React from "react";

interface Project {
  id: string;
  name: string;
  client: string;
  amount: number;
  status: string;
  completion: number;
}

interface RecentProjectsProps {
  projects: Project[];
  loading?: boolean;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects, loading = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-blue-600";
      case "Completed":
        return "text-green-600";
      case "Planning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50";
      case "Completed":
        return "bg-green-50";
      case "Planning":
        return "bg-yellow-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Projects</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Project Name</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Client</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Completion</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`s-${i}`} className="border-b border-slate-100">
                    <td className="py-3 px-4">
                      <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                    </td>
                  </tr>
                ))
              : projects.map((project) => (
                  <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-900 font-medium">{project.name}</td>
                    <td className="py-3 px-4 text-slate-600">{project.client}</td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">${(project.amount / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBg(
                          project.status
                        )} ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-28 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                            style={{ width: `${project.completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-700 w-10">{project.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProjects;
