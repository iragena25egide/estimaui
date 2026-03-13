import API from "../context/axios";

class EquipmentCostService {
 
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/equipment-cost/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get equipment costs error:", error);
      throw error;
    }
  }

  
  static async getById(id: string) {
    try {
      const res = await API.get(`/equipment-cost/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get equipment cost error:", error);
      throw error;
    }
  }

 
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
      
      const res = await API.post("/equipment-cost/create", payload);
      return res.data;
    } catch (error) {
      console.error("Create equipment cost error:", error);
      throw error;
    }
  }

 
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
      const res = await API.patch(`/equipment-cost/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update equipment cost error:", error);
      throw error;
    }
  }

  
  static async delete(id: string) {
    try {
      const res = await API.delete(`/equipment-cost/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete equipment cost error:", error);
      throw error;
    }
  }
}

export default EquipmentCostService;