import React, { useEffect, useState, useMemo } from "react";
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
  RefreshCw,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
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
  DialogFooter,
} from "@/components/ui/dialog";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    deleting: false,
  });
  const [search, setSearch] = useState("");
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "version">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedReportForSend, setSelectedReportForSend] = useState<Report | null>(null);
  const [sendEmail, setSendEmail] = useState("");

  
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

  
  const regenerateReport = async (reportId: string) => {
    
    if (!selectedProject) return;
    setLoading((prev) => ({ ...prev, generating: true }));
    try {
      await ReportService.generate(selectedProject);
      toast.success("Report regenerated");
      loadReports();
    } catch (error: any) {
      const message = error.serverMessage || "Failed to regenerate report";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, generating: false })); // <-- FIXED: removed stray 'x'
    }
  };

 
  const deleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone."))
      return;
    setLoading((prev) => ({ ...prev, deleting: true }));
    try {
      await ReportService.delete(reportId); 
      toast.success("Report deleted");
      loadReports();
    } catch (error: any) {
      const message = error.serverMessage || "Failed to delete report";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, deleting: false }));
    }
  };

  // ---------- Send report via email (opens modal) ----------
  const openSendModal = (report: Report) => {
    setSelectedReportForSend(report);
    setSendEmail("");
    setSendModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedReportForSend) return;
    if (!sendEmail || !/^\S+@\S+\.\S+$/.test(sendEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading((prev) => ({ ...prev, sending: true }));
    try {
      // Assuming your send endpoint accepts an email parameter.
      // If not, you can modify the service to accept email.
      await ReportService.send(selectedReportForSend.id); // adjust if needed
      toast.success(`Report sent to ${sendEmail}`);
      setSendModalOpen(false);
      setSelectedReportForSend(null);
    } catch (error: any) {
      const message = error.serverMessage || "Failed to send report";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }));
    }
  };

  // ---------- Status badge styling ----------
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

  // ---------- Sorting and filtering ----------
  const sortedAndFilteredReports = useMemo(() => {
    let filtered = reports.filter((r) =>
      r.status?.toLowerCase().includes(search.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        // sort by version
        return sortOrder === "desc" ? b.version - a.version : a.version - b.version;
      }
    });
    return filtered;
  }, [reports, search, sortBy, sortOrder]);

  // ---------- Export to CSV ----------
  const exportToCSV = () => {
    const headers = ["Project", "Version", "Date", "Amount", "Status"];
    const rows = sortedAndFilteredReports.map((r) => [
      projects.find(p => p.id === r.projectId)?.name || "",
      r.version,
      r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
      r.totalAmount,
      r.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${selectedProject}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ---------- Helper to get project name ----------
  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || "—";
  };

  // ---------- Summary statistics ----------
  const totalReports = sortedAndFilteredReports.length;
  const totalAmount = sortedAndFilteredReports.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate, preview, and manage project reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Cumulative Amount</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Selected Project</p>
            <p className="text-2xl font-bold text-gray-900 truncate">
              {getProjectName(selectedProject) || "None"}
            </p>
          </CardContent>
        </Card>
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

            <div className="flex flex-wrap gap-2">
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

              <Button
                variant="outline"
                onClick={() => window.open(SAMPLE_REPORT_URL, '_blank')}
                className="px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border-gray-200"
                title="View a sample report template"
              >
                <FileText className="w-4 h-4" />
                Sample Report
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={loadReports}
                      disabled={loading.reports}
                      className="px-4 py-2.5 rounded-xl border-gray-200"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading.reports ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh reports</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
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

        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={(val: "date" | "version") => setSortBy(val)}>
            <SelectTrigger className="w-32 border-gray-200 rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="version">Version</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="px-3 py-2.5 rounded-xl border-gray-200"
          >
            {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl border-gray-200"
            title="Export to CSV"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
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
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  </tr>
                ))
              ) : !selectedProject ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    Select a project to view its reports.
                  </td>
                </tr>
              ) : sortedAndFilteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {search
                      ? "No reports match your search."
                      : "No reports generated yet for this project."}
                  </td>
                </tr>
              ) : (
                sortedAndFilteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {getProjectName(report.projectId)}
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
                        {/* Preview */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setPreviewReport(report)}
                                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                disabled={!report.filePath}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Preview</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Download */}
                        {report.filePath ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={report.filePath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Download</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-gray-300">
                            <Download className="w-4 h-4" />
                          </span>
                        )}

                        {/* Send Email */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => openSendModal(report)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Send via email</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Regenerate */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => regenerateReport(report.id)}
                                disabled={loading.generating}
                                className="text-amber-600 hover:text-amber-800 disabled:opacity-50"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Regenerate</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Delete */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => deleteReport(report.id)}
                                disabled={loading.deleting}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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

      {/* Send Email Modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Send Report via Email
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">
              Enter the recipient's email address to send this report.
            </p>
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={sendEmail}
              onChange={(e) => setSendEmail(e.target.value)}
              className="border-gray-200 rounded-lg"
            />
          </div>
          <DialogFooter className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSendModalOpen(false)}
                className="border-gray-200 rounded-lg text-gray-600 hover:bg-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={loading.sending}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
              >
                {loading.sending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Send
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;