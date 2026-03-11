import API from "../context/axios";

class ReportService {
  /**
   * Fetch all reports
   */
  static async getAll() {
    try {
      const res = await API.get("/reports");
      return res.data;
    } catch (error) {
      console.error("Get reports error:", error);
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
   * Fetch all projects (for dropdown)
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
   * Generate a new report for a project
   */
  static async generate(projectId: string) {
    try {
      const res = await API.post(`/reports/generate/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Generate report error:", error);
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
    } catch (error) {
      console.error("Download report error:", error);
      throw error;
    }
  }

  /**
   * Send a report via email
   */
  static async sendEmail(reportId: string) {
    try {
      const res = await API.post(`/reports/send-email/${reportId}`);
      return res.data;
    } catch (error) {
      console.error("Send report email error:", error);
      throw error;
    }
  }

  /**
   * Delete a report
   */
  static async delete(reportId: string) {
    try {
      const res = await API.delete(`/reports/${reportId}`);
      return res.data;
    } catch (error) {
      console.error("Delete report error:", error);
      throw error;
    }
  }
}

export default ReportService;