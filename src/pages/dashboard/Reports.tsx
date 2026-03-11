import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  FileText,
  Loader2,
  Download,
  X,
  FolderOpen,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReportService from "@/services/reportService";

interface Report {
  id: string;
  project: {
    id: string;
    name: string;
  };
  version: number;
  totalAmount: number;
  status: string;
  filePath?: string;
  createdAt?: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loading, setLoading] = useState({
    reports: false,
    projects: false,
    generating: false,
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjects();
    loadReports();
  }, []);

  const loadProjects = async () => {
    setLoading((prev) => ({ ...prev, projects: true }));
    try {
      const data = await ReportService.getProjects();
      setProjects(data || []);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  const loadReports = async () => {
    setLoading((prev) => ({ ...prev, reports: true }));
    try {
      const data = await ReportService.getAll();
      setReports(data || []);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading((prev) => ({ ...prev, reports: false }));
    }
  };

  const generateReport = async () => {
    if (!selectedProject) {
      toast.warning("Please select a project first");
      return;
    }

    setLoading((prev) => ({ ...prev, generating: true }));
    try {
      await ReportService.generate(selectedProject);
      toast.success("Report generation started");
      setSelectedProject("");
      loadReports(); // refresh list
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoading((prev) => ({ ...prev, generating: false }));
    }
  };

  // Filter reports by project name or status
  const filteredReports = reports.filter((r) =>
    r.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.status?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate and download project reports
        </p>
      </div>

      {/* Generate Report Card */}
      <Card className="border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Generate New Report
          </CardTitle>
          <CardDescription>
            Select a project to generate a cost report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
                disabled={loading.projects}
              >
                <SelectTrigger className="w-full pl-10 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {loading.projects ? (
                    <SelectItem value="loading" disabled>
                      Loading projects...
                    </SelectItem>
                  ) : projects.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No projects available
                    </SelectItem>
                  ) : (
                    projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateReport}
              disabled={loading.generating || !selectedProject}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              {loading.generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              {loading.generating ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search reports by project or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Project</th>
                <th className="p-4 text-left font-semibold text-gray-600">Version</th>
                <th className="p-4 text-left font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left font-semibold text-gray-600">Amount</th>
                <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading.reports ? (
                // Skeleton rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  </tr>
                ))
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {search
                      ? "No reports match your search."
                      : "No reports generated yet. Use the form above to create one."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {report.project?.name || "—"}
                    </td>
                    <td className="p-4 text-gray-700">v{report.version}</td>
                    <td className="p-4 text-gray-700">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 font-semibold text-blue-600">
                      ₹{report.totalAmount?.toLocaleString() ?? 0}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          report.status
                        )}`}
                      >
                        {report.status || "Draft"}
                      </span>
                    </td>
                    <td className="p-4">
                      {report.filePath ? (
                        <a
                          href={report.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not ready</span>
                      )}
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

export default Reports;