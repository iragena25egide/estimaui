import API from "../context/axios";

class LaborProductivityService {
  /**
   * Get all labor productivity records for a project
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/labor-productivity/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get labor productivity error:", error);
      throw error;
    }
  }

  /**
   * Get a single labor productivity record by ID
   */
  static async getById(id: string) {
    try {
      const res = await API.get(`/labor-productivity/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get labor productivity record error:", error);
      throw error;
    }
  }

  /**
   * Create a new labor productivity record
   */
  static async create(data: any) {
    try {
      const payload = {
        ...data,
        productivityRate: Number(data.productivityRate || 0),
        wageRate: Number(data.wageRate || 0),
        workingHours: Number(data.workingHours || 0),
        outputPerDay: Number(data.outputPerDay || 0),
      };
      const { projectId, ...rest } = payload;
      const res = await API.post(`/labor-productivity/project/${projectId}`, rest);
      return res.data;
    } catch (error) {
      console.error("Create labor productivity error:", error);
      throw error;
    }
  }

  /**
   * Update an existing labor productivity record
   */
  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        productivityRate: Number(data.productivityRate || 0),
        wageRate: Number(data.wageRate || 0),
        workingHours: Number(data.workingHours || 0),
        outputPerDay: Number(data.outputPerDay || 0),
      };
      const res = await API.put(`/labor-productivity/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update labor productivity error:", error);
      throw error;
    }
  }

  /**
   * Delete a labor productivity record
   */
  static async delete(id: string) {
    try {
      const res = await API.delete(`/labor-productivity/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete labor productivity error:", error);
      throw error;
    }
  }
}

export default LaborProductivityService;