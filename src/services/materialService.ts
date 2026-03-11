import API from "../context/axios";

class MaterialTakeOffService {
  /**
   * Get all material take-off records for a project
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/material-takeoff/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get material take-off error:", error);
      throw error;
    }
  }

  /**
   * Get a single material take-off record by ID
   */
  static async getById(id: string) {
    try {
      const res = await API.get(`/material-takeoff/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get material take-off record error:", error);
      throw error;
    }
  }

  /**
   * Create a new material take-off record
   */
  static async create(data: any) {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        rate: Number(data.rate || 0),
        wastagePercent: Number(data.wastagePercent || 0),
        totalCost: Number(data.totalCost || 0),
      };
      const { projectId, ...rest } = payload;
      const res = await API.post(`/material-takeoff/project/${projectId}`, rest);
      return res.data;
    } catch (error) {
      console.error("Create material take-off error:", error);
      throw error;
    }
  }

  /**
   * Update an existing material take-off record
   */
  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        rate: Number(data.rate || 0),
        wastagePercent: Number(data.wastagePercent || 0),
        totalCost: Number(data.totalCost || 0),
      };
      const res = await API.put(`/material-takeoff/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update material take-off error:", error);
      throw error;
    }
  }

  /**
   * Delete a material take-off record
   */
  static async delete(id: string) {
    try {
      const res = await API.delete(`/material-takeoff/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete material take-off error:", error);
      throw error;
    }
  }
}

export default MaterialTakeOffService;