import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DrawingService from "@/services/drawingService";

interface ProjectSummary {
  projectId: string;
  projectName: string;
  drawingCount: number;
  lastUpdated?: string;
}

const DrawingProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drawing Register</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a project to view and manage its drawings
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          {projects.length} Project{projects.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <Card className="border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No projects found</p>
            <Button
              onClick={() => navigate("/dashboard/projects")}
              variant="outline"
              className="mt-4 border-gray-200 rounded-xl"
            >
              Go to Projects
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.projectId}
              className="border-gray-200 shadow-sm rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
              onClick={() => navigate(`/dashboard/drawings/${project.projectId}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.projectName}
                      </h3>
                      <p className="text-sm text-gray-500">{project.projectId}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {project.drawingCount} Drawing{project.drawingCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    Last updated: {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrawingProjects;