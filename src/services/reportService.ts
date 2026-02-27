import API from "../context/axios";

class ReportService {

  // ===============================
  // GET ALL REPORTS
  // ===============================
  static async getReports() {
    try {
      const res = await API.get("/reports");
      return res.data;
    } catch (error) {
      console.error("Get reports error:", error);
      throw error;
    }
  }

  // ===============================
  // GET PROJECT REPORTS
  // ===============================
  static async getProjectReports(projectId: string) {
    try {
      const res = await API.get(`/reports/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get project reports error:", error);
      throw error;
    }
  }

  
  static async generateReport(projectId: string) {
    try {
      const res = await API.post(`/reports/generate/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Generate report error:", error);
      throw error;
    }
  }

  
  static async sendReportEmail(reportId: string) {
    try {
      const res = await API.post(`/reports/send-email/${reportId}`);
      return res.data;
    } catch (error) {
      console.error("Send report email error:", error);
      throw error;
    }
  }

  
  static async downloadReport(reportId: string) {
    try {
      const res = await API.get(
        `/reports/download/${reportId}`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();

    } catch (error) {
      console.error("Download report error:", error);
      throw error;
    }
  }

  
  static async deleteReport(reportId: string) {
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