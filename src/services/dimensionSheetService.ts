import API from "../context/axios";

class DimensionSheetService {
  
  static async getByDrawing(drawingId: string) {
    try {
      const res = await API.get(`/dimension/drawing/${drawingId}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheets by drawing error:", error);
      throw error;
    }
  }

  
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/dimension/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheets by project error:", error);
      throw error;
    }
  }

  
  static async getById(id: string) {
    try {
      const res = await API.get(`/dimension/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheet error:", error);
      throw error;
    }
  }

  static async create(data: any) {
    try {
      const res = await API.post(`/dimension`, data);
      return res.data;
    } catch (error) {
      console.error("Create dimension sheet error:", error);
      throw error;
    }
  }

  static async update(id: string, data: any) {
    try {
      const res = await API.patch(`/dimension/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Update dimension sheet error:", error);
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      const res = await API.delete(`/dimension/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete dimension sheet error:", error);
      throw error;
    }
  }
}

export default DimensionSheetService;