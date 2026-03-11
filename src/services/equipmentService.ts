import API from "../context/axios";

class EquipmentCostService {
  /**
   * Get all equipment costs for a project
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/equipment-costs/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get equipment costs error:", error);
      throw error;
    }
  }

  /**
   * Get a single equipment cost by ID
   */
  static async getById(id: string) {
    try {
      const res = await API.get(`/equipment-costs/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get equipment cost error:", error);
      throw error;
    }
  }

  /**
   * Create a new equipment cost entry
   */
  static async create(data: any) {
    try {
      const payload = {
        ...data,
        hireRatePerDay: Number(data.hireRatePerDay || 0),
        durationDays: Number(data.durationDays || 0),
        fuelCost: Number(data.fuelCost || 0),
        operatorCost: Number(data.operatorCost || 0),
        totalCost: Number(data.totalCost || 0),
      };
      const { projectId, ...rest } = payload;
      const res = await API.post(`/equipment-costs/project/${projectId}`, rest);
      return res.data;
    } catch (error) {
      console.error("Create equipment cost error:", error);
      throw error;
    }
  }

  /**
   * Update an existing equipment cost entry
   */
  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        hireRatePerDay: Number(data.hireRatePerDay || 0),
        durationDays: Number(data.durationDays || 0),
        fuelCost: Number(data.fuelCost || 0),
        operatorCost: Number(data.operatorCost || 0),
        totalCost: Number(data.totalCost || 0),
      };
      const res = await API.put(`/equipment-costs/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update equipment cost error:", error);
      throw error;
    }
  }

  /**
   * Delete an equipment cost entry
   */
  static async delete(id: string) {
    try {
      const res = await API.delete(`/equipment-costs/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete equipment cost error:", error);
      throw error;
    }
  }
}

export default EquipmentCostService;