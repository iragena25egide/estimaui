import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DrawingService from "../../services/drawingService";
import { FolderOpen, FileText } from "lucide-react";

const DrawingProjects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await DrawingService.getDrawingSummary();
      setProjects(res);
    } catch (error) {
      console.error("Failed to load project summary", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Drawing Register</h1>
        <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
          {projects.length} Projects
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.projectId}
            onClick={() => navigate(`/dashboard/drawings/${project.projectId}`)}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                      {project.projectName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {project.projectId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">
                  {project.drawingCount} Drawings
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingProjects;