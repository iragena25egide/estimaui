import API from "../context/axios";

class RateAnalysisService {
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/rate-analyses/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get rate analysis error:", error);
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const res = await API.get(`/rate-analyses/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get rate analysis record error:", error);
      throw error;
    }
  }

  static async create(data: any) {
    try {
      const payload = {
        ...data,
        materialCost: Number(data.materialCost) || 0,
        laborCost: Number(data.laborCost) || 0,
        equipmentCost: Number(data.equipmentCost) || 0,
        wastage: Number(data.wastage) || 0,
        overheads: Number(data.overheads) || 0,
        profitPercent: Number(data.profitPercent) || 0,
      };
      const res = await API.post("/rate-analyses/create", payload);
      return res.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Create rate analysis error response:", error.response.data);
      }
      throw error;
    }
  }

  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        materialCost: Number(data.materialCost) || 0,
        laborCost: Number(data.laborCost) || 0,
        equipmentCost: Number(data.equipmentCost) || 0,
        wastage: Number(data.wastage) || 0,
        overheads: Number(data.overheads) || 0,
        profitPercent: Number(data.profitPercent) || 0,
      };
      const res = await API.patch(`/rate-analyses/${id}`, payload);
      return res.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Update rate analysis error response:", error.response.data);
      }
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      const res = await API.delete(`/rate-analyses/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete rate analysis error:", error);
      throw error;
    }
  }
}

export default RateAnalysisService;