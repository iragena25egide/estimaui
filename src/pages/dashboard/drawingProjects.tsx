import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DrawingService from "../../services/drawingService";

const DrawingProjects = () => {

  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await DrawingService.getDrawingSummary();
    setProjects(res);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Drawing Register</h2>

      <div className="space-y-4">
        {projects.map(p => (
          <div
            key={p.projectId}
            onClick={() => navigate(`/dashboard/drawings/${p.projectId}`)}
            className="border p-4 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex justify-between">
              <span className="font-semibold">{p.projectName}</span>
              <span className="text-sm text-slate-500">
                {p.drawingCount} Drawings
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawingProjects;