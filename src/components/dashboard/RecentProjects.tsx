import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectService from "../../services/projectService";
import { DollarSign, FileText, Users, Briefcase } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: string;
  completion: number;
  startDate: String;
}

const RecentProjects: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    try {
      setLoading(true);

      const res = await ProjectService.getRecentProjects(5);
      

      setProjects(res || []);
    } catch (error) {
      console.error("Recent projects fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-blue-600 bg-blue-50";
      case "Completed":
        return "text-green-600 bg-green-50";
      case "Planning":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // const formatCurrency = (value: number) => {
  //   return value.toLocaleString(undefined, {
  //     style: "currency",
  //     currency: "USD",
  //     maximumFractionDigits: 0,
  //   });
  // };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Projects</h2>

        <button
          onClick={() => navigate("dashboard/projects")}
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm text-slate-600">
                Project
              </th>
              <th className="text-left p-3 text-sm text-slate-600">
                Client
              </th>
              
              <th className="text-left p-3 text-sm text-slate-600">
                Location
              </th>
              <th className="text-left p-3 text-sm text-slate-600">
                Start Date
              </th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">
                    <div className="h-4 w-40 bg-slate-200 animate-pulse rounded" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-20 bg-slate-200 animate-pulse rounded" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-28 bg-slate-200 animate-pulse rounded" />
                  </td>
                </tr>
              ))}

            {!loading &&
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <td className="p-3 font-medium">{project.name}</td>

                  <td className="p-3 text-slate-600">{project.client}</td>
                  
                 <td className="p-3 text-slate-600">{project.location}</td>

                 <td className="p-3 text-slate-600">{'13/3/2026'}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-28 bg-slate-100 h-2 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>

                      <span className="text-xs font-semibold w-10">
                        {project.completion}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-slate-500">
                  No recent projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProjects;