import API from "../context/axios";

class RateAnalysisService {
  /**
   * Get all rate analysis records for a project
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/rate-analysis/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get rate analysis error:", error);
      throw error;
    }
  }

  /**
   * Get a single rate analysis record by ID
   */
  static async getById(id: string) {
    try {
      const res = await API.get(`/rate-analysis/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get rate analysis record error:", error);
      throw error;
    }
  }

  /**
   * Create a new rate analysis record
   */
  static async create(data: any) {
    try {
      const payload = {
        ...data,
        materialCost: Number(data.materialCost || 0),
        laborCost: Number(data.laborCost || 0),
        equipmentCost: Number(data.equipmentCost || 0),
        overheadPercent: Number(data.overheadPercent || 0),
        profitPercent: Number(data.profitPercent || 0),
        totalRate: Number(data.totalRate || 0),
      };
      const { projectId, ...rest } = payload;
      const res = await API.post(`/rate-analysis/project/${projectId}`, rest);
      return res.data;
    } catch (error) {
      console.error("Create rate analysis error:", error);
      throw error;
    }
  }

  /**
   * Update an existing rate analysis record
   */
  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        materialCost: Number(data.materialCost || 0),
        laborCost: Number(data.laborCost || 0),
        equipmentCost: Number(data.equipmentCost || 0),
        overheadPercent: Number(data.overheadPercent || 0),
        profitPercent: Number(data.profitPercent || 0),
        totalRate: Number(data.totalRate || 0),
      };
      const res = await API.put(`/rate-analysis/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update rate analysis error:", error);
      throw error;
    }
  }

  /**
   * Delete a rate analysis record
   */
  static async delete(id: string) {
    try {
      const res = await API.delete(`/rate-analysis/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete rate analysis error:", error);
      throw error;
    }
  }
}

export default RateAnalysisService;