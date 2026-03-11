import API from "../context/axios";

class DimensionSheetService {
  /**
   * Get dimension sheets for a specific drawing
   */
  static async getByDrawing(drawingId: string) {
    try {
      const res = await API.get(`/dimension/drawing/${drawingId}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheets by drawing error:", error);
      throw error;
    }
  }

  /**
   * Get dimension sheets for a project (all drawings)
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/dimension/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheets by project error:", error);
      throw error;
    }
  }

  /**
   * Get a single dimension sheet by its ID
   */
  static async getById(id: string) {
    try {
      const res = await API.get(` /dimension/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheet error:", error);
      throw error;
    }
  }
}

export default DimensionSheetService;