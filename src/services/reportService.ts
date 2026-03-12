import API from "../context/axios";

class ReportService {
  /**
   * Fetch all projects for dropdown
   */
  static async getProjects() {
    try {
      const res = await API.get("/projects/my");
      return res.data;
    } catch (error) {
      console.error("Get projects error:", error);
      throw error;
    }
  }

  /**
   * Fetch reports for a specific project
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/reports/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get project reports error:", error);
      throw error;
    }
  }

  /**
   * Generate a new report for a project
   */
  static async generate(projectId: string) {
    try {
      const res = await API.post(`/reports/${projectId}/generate`);
      return res.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Generate report error response:", error.response.data);
        // Attach server message to error object
        error.serverMessage = error.response.data.message || "Failed to generate report";
      }
      throw error;
    }
  }

  /**
   * Send a report via email
   */
  static async send(reportId: string) {
    try {
      const res = await API.post(`/reports/${reportId}/send`);
      return res.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Send report error response:", error.response.data);
        error.serverMessage = error.response.data.message || "Failed to send report";
      }
      throw error;
    }
  }

  /**
   * Download a report as PDF (triggers browser download)
   */
  static async download(reportId: string, fileName?: string) {
    try {
      const res = await API.get(`/reports/download/${reportId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Download report error:", error);
      throw error;
    }
  }
}

export default ReportService;