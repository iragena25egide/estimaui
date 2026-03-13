import API from "../context/axios";

class BoqService {
  
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/boq-items/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get BOQ items error:", error);
      throw error;
    }
  }

 
  static async getById(id: string) {
    try {
      const res = await API.get(`/boq-items/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get BOQ item error:", error);
      throw error;
    }
  }


  static async create(data: any) {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        materialRate: Number(data.materialRate || 0),
        laborRate: Number(data.laborRate || 0),
        equipmentRate: Number(data.equipmentRate || 0),
        totalRate: Number(data.totalRate || 0),
        amount: Number(data.amount || 0),
      };
      const res = await API.post("/boq-items/create", payload);
      return res.data;
    } catch (error) {
      console.error("Create BOQ item error:", error);
      throw error;
    }
  }

 
  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        materialRate: Number(data.materialRate || 0),
        laborRate: Number(data.laborRate || 0),
        equipmentRate: Number(data.equipmentRate || 0),
        totalRate: Number(data.totalRate || 0),
        amount: Number(data.amount || 0),
      };
     
      const res = await API.patch(`/boq-items/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update BOQ item error:", error);
      throw error;
    }
  }

  
  static async delete(id: string) {
    try {
      const res = await API.delete(`/boq-items/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete BOQ item error:", error);
      throw error;
    }
  }
}

export default BoqService;