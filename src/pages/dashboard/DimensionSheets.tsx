import React, { useEffect, useState } from "react";
import {
  Search,
  FolderOpen,
  FileText,
  X,
  Ruler,
  Loader2,
} from "lucide-react";
import DrawingService from "@/services/drawingService";
import DimensionSheetService from "@/services/dimensionSheetService";

const DimensionSheets: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [drawings, setDrawings] = useState<any[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string>("");
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    projects: false,
    drawings: false,
    sheets: false,
  });
  const [search, setSearch] = useState("");

  
  useEffect(() => {
    const loadProjects = async () => {
      setLoading((prev) => ({ ...prev, projects: true }));
      try {
        const res = await DrawingService.getDrawingSummary();
        setProjects(res);
        if (res.length > 0) setSelectedProjectId(res[0].projectId);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    };
    loadProjects();
  }, []);

  
  useEffect(() => {
    if (!selectedProjectId) {
      setDrawings([]);
      setSelectedDrawingId("");
      return;
    }

    const loadDrawings = async () => {
      setLoading((prev) => ({ ...prev, drawings: true }));
      try {
        const res = await DrawingService.getByProject(selectedProjectId);
        setDrawings(res);
        if (res.length > 0) setSelectedDrawingId(res[0].id);
        else setSelectedDrawingId("");
      } catch (error) {
        console.error("Failed to load drawings", error);
      } finally {
        setLoading((prev) => ({ ...prev, drawings: false }));
      }
    };
    loadDrawings();
  }, [selectedProjectId]);

 
  useEffect(() => {
    if (!selectedDrawingId) {
      setSheets([]);
      return;
    }

    const loadSheets = async () => {
      setLoading((prev) => ({ ...prev, sheets: true }));
      try {
        const res = await DimensionSheetService.getByDrawing(selectedDrawingId);
        setSheets(res);
      } catch (error) {
        console.error("Failed to load dimension sheets", error);
      } finally {
        setLoading((prev) => ({ ...prev, sheets: false }));
      }
    };
    loadSheets();
  }, [selectedDrawingId]);

  
  const filteredSheets = sheets.filter(
    (s) =>
      s.code?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
     
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dimension Sheets</h1>
        <p className="text-sm text-gray-500 mt-1">
          View dimension sheets for selected drawing
        </p>
      </div>

      {/* Project & Drawing Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Selector */}
        <div className="relative">
          <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
            disabled={loading.projects}
          >
            {loading.projects ? (
              <option>Loading projects...</option>
            ) : projects.length === 0 ? (
              <option>No projects found</option>
            ) : (
              projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))
            )}
          </select>
          {loading.projects && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Drawing Selector */}
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedDrawingId}
            onChange={(e) => setSelectedDrawingId(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
            disabled={!selectedProjectId || loading.drawings}
          >
            {!selectedProjectId ? (
              <option>Select a project first</option>
            ) : loading.drawings ? (
              <option>Loading drawings...</option>
            ) : drawings.length === 0 ? (
              <option>No drawings found</option>
            ) : (
              drawings.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.drawingNo} - {d.title}
                </option>
              ))
            )}
          </select>
          {loading.drawings && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Search Bar */}
      {selectedDrawingId && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Dimension Sheets Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Code</th>
                <th className="p-4 text-left font-semibold text-gray-600">Description</th>
                <th className="p-4 text-left font-semibold text-gray-600">Unit</th>
                <th className="p-4 text-left font-semibold text-gray-600">Rate</th>
                <th className="p-4 text-left font-semibold text-gray-600">Quantity</th>
                <th className="p-4 text-left font-semibold text-gray-600">Total</th>
                <th className="p-4 text-left font-semibold text-gray-600">Dimensions</th>
              </tr>
            </thead>
            <tbody>
              {loading.sheets ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  </tr>
                ))
              ) : !selectedDrawingId ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Please select a project and drawing to view dimension sheets.
                  </td>
                </tr>
              ) : filteredSheets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    {search
                      ? "No dimension sheets match your search."
                      : "No dimension sheets found for this drawing."}
                  </td>
                </tr>
              ) : (
                filteredSheets.map((sheet) => (
                  <tr
                    key={sheet.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{sheet.code}</td>
                    <td className="p-4 text-gray-700">{sheet.description}</td>
                    <td className="p-4 text-gray-700">{sheet.unit}</td>
                    <td className="p-4 text-gray-700">{sheet.rate}</td>
                    <td className="p-4 text-gray-700">{sheet.quantity}</td>
                    <td className="p-4 font-bold text-blue-600">{sheet.total}</td>
                    <td className="p-4 text-gray-700">
                      {sheet.length} × {sheet.width} × {sheet.height}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DimensionSheets;