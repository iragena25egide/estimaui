import API from "../context/axios";

class RateAnalysisService {

  // ============================
  // GET RATE ANALYSIS BY PROJECT
  // ============================
  static async getProjectRateAnalysis(projectId: string) {
    try {
      const res = await API.get(`/rate-analysis/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get rate analysis error:", error);
      throw error;
    }
  }

  // ============================
  // GET SINGLE RATE ANALYSIS
  // ============================
  static async getRateAnalysis(id: string) {
    try {
      const res = await API.get(`/rate-analysis/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get rate analysis error:", error);
      throw error;
    }
  }

  // ============================
  // CREATE RATE ANALYSIS
  // ============================
  static async createRateAnalysis(projectId: string, data: any) {
    try {

      const materialCost = Number(data.materialCost || 0);
      const laborCost = Number(data.laborCost || 0);
      const equipmentCost = Number(data.equipmentCost || 0);

      const subtotal = materialCost + laborCost + equipmentCost;

      const overheadPercent = Number(data.overheadPercent || 0);
      const profitPercent = Number(data.profitPercent || 0);

      const overheadAmount = (subtotal * overheadPercent) / 100;
      const profitAmount = (subtotal * profitPercent) / 100;

      const totalRate = subtotal + overheadAmount + profitAmount;

      const payload = {
        ...data,
        projectId,
        materialCost,
        laborCost,
        equipmentCost,
        overheadPercent,
        profitPercent,
        totalRate
      };

      const res = await API.post("/rate-analysis", payload);
      return res.data;

    } catch (error) {
      console.error("Create rate analysis error:", error);
      throw error;
    }
  }

 
  static async updateRateAnalysis(id: string, data: any) {
    try {

      const materialCost = Number(data.materialCost || 0);
      const laborCost = Number(data.laborCost || 0);
      const equipmentCost = Number(data.equipmentCost || 0);

      const subtotal = materialCost + laborCost + equipmentCost;

      const overheadPercent = Number(data.overheadPercent || 0);
      const profitPercent = Number(data.profitPercent || 0);

      const totalRate =
        subtotal +
        (subtotal * overheadPercent) / 100 +
        (subtotal * profitPercent) / 100;

      const res = await API.put(`/rate-analysis/${id}`, {
        ...data,
        materialCost,
        laborCost,
        equipmentCost,
        totalRate
      });

      return res.data;

    } catch (error) {
      console.error("Update rate analysis error:", error);
      throw error;
    }
  }

  
  static async deleteRateAnalysis(id: string) {
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