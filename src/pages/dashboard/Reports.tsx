import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  FileText,
  Loader2,
  Download,
  Send,
  Eye,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportService from "@/services/reportService";


const SAMPLE_REPORT_URL = "/samples/report-sample.pdf";

interface Report {
  id: string;
  projectId: string;
  version: number;
  totalAmount: number;
  status: string;
  filePath?: string;
  createdAt?: string;
}

const Reports: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState({
    projects: false,
    reports: false,
    generating: false,
    sending: false,
  });
  const [search, setSearch] = useState("");
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  
  useEffect(() => {
    const loadProjects = async () => {
      setLoading((prev) => ({ ...prev, projects: true }));
      try {
        const data = await ReportService.getProjects();
        setProjects(data || []);
        if (data && data.length > 0) {
          setSelectedProject(data[0].id);
        }
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    };
    loadProjects();
  }, []);

  
  useEffect(() => {
    if (!selectedProject) {
      setReports([]);
      return;
    }
    loadReports();
  }, [selectedProject]);

  const loadReports = async () => {
    setLoading((prev) => ({ ...prev, reports: true }));
    try {
      const data = await ReportService.getByProject(selectedProject);
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
      loadReports();
    } catch (error: any) {
      const message = error.serverMessage || "Failed to generate report";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, generating: false }));
    }
  };

  const sendReport = async (reportId: string) => {
    setLoading((prev) => ({ ...prev, sending: true }));
    try {
      await ReportService.send(reportId);
      toast.success("Report sent via email");
      loadReports();
    } catch (error: any) {
      const message = error.serverMessage || "Failed to send report";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "generated":
        return "bg-green-100 text-green-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredReports = reports.filter((r) =>
    r.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate and manage project reports
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
            Select a project and click generate
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

            <div className="flex gap-2">
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

              {/* Sample Report Button */}
              <Button
                variant="outline"
                onClick={() => window.open(SAMPLE_REPORT_URL, '_blank')}
                className="px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border-gray-200"
                title="View a sample report template"
              >
                <FileText className="w-4 h-4" />
                Sample Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search reports by status..."
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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : !selectedProject ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    Select a project to view its reports.
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {search
                      ? "No reports match your search."
                      : "No reports generated yet for this project."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {projects.find(p => p.id === report.projectId)?.name || "—"}
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
                        {report.status || "GENERATED"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {report.filePath ? (
                          <>
                            <button
                              onClick={() => setPreviewReport(report)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={report.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </>
                        ) : (
                          <span className="text-gray-400" title="No file available">
                            <Eye className="w-4 h-4 opacity-30" />
                          </span>
                        )}
                        <button
                          onClick={() => sendReport(report.id)}
                          disabled={loading.sending}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          title="Send via email"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="sm:max-w-4xl p-0 gap-0 rounded-2xl overflow-hidden h-[80vh]">
          <DialogHeader className="p-6 border-b border-gray-200 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Report Preview - {previewReport ? `v${previewReport.version}` : ""}
            </DialogTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPreviewReport(null)}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>
          <div className="flex-1 bg-gray-100 p-4 overflow-auto">
            {previewReport?.filePath ? (
              <iframe
                src={previewReport.filePath}
                title="Report Preview"
                className="w-full h-full rounded-lg border border-gray-200"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <FileText className="w-12 h-12 mr-2" />
                <span>No preview available. The file may not be generated yet.</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;