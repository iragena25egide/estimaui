import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectService from "../../services/projectService";
import { DollarSign, FileText, Users, Briefcase, ChevronRight } from "lucide-react";

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
        return "text-[#10b981] bg-[#10b981]/10";
      case "Planning":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>

        <button
          onClick={() => navigate("/dashboard/projects")}
          className="text-sm font-medium text-[#10b981] hover:text-[#059669] flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left p-4 pl-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Project
              </th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Client
              </th>
              
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 pr-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="p-4 pl-0">
                    <div className="h-4 w-40 bg-slate-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-full" />
                  </td>
                  <td className="p-4 pr-0">
                    <div className="h-2 w-28 bg-slate-100 animate-pulse rounded-full" />
                  </td>
                </tr>
              ))}

            {!loading &&
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                >
                  <td className="p-4 pl-0 font-medium text-slate-900 group-hover:text-[#10b981] transition-colors">{project.name}</td>

                  <td className="p-4 text-sm text-slate-600">{project.client}</td>
                  
                 <td className="p-4 text-sm text-slate-600">{project.location}</td>

                 <td className="p-4 text-sm text-slate-600">{'13/3/2026'}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="p-4 pr-0">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-[#10b981] rounded-full"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>

                      <span className="text-xs font-semibold text-slate-700 w-8">
                        {project.completion}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-8 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase className="w-8 h-8 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-900">No projects found</p>
                    <p className="text-xs text-slate-500 mt-1">Get started by creating your first project.</p>
                  </div>
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