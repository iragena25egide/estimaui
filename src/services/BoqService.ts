import API from "../context/axios";

class BoqService {

  
  static async getProjectBoqItems(projectId: string) {
    try {
      const res = await API.get(`/boq-items/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get BOQ items error:", error);
      throw error;
    }
  }

  
  static async getBoqItem(id: string) {
    try {
      const res = await API.get(`/boq-items/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get BOQ item error:", error);
      throw error;
    }
  }

  
  static async createBoqItem(projectId: string, data: any) {
    try {
      const res = await API.post(
        `/boq-items/project/${projectId}`,
        {
          ...data,
          quantity: Number(data.quantity),
          materialRate: Number(data.materialRate || 0),
          laborRate: Number(data.laborRate || 0),
          equipmentRate: Number(data.equipmentRate || 0),
          totalRate: Number(data.totalRate || 0),
          amount: Number(data.amount || 0)
        }
      );

      return res.data;
    } catch (error) {
      console.error("Create BOQ item error:", error);
      throw error;
    }
  }

 
  static async updateBoqItem(id: string, data: any) {
    try {
      const res = await API.put(`/boq-items/${id}`, {
        ...data,
        quantity: Number(data.quantity),
        materialRate: Number(data.materialRate || 0),
        laborRate: Number(data.laborRate || 0),
        equipmentRate: Number(data.equipmentRate || 0),
        totalRate: Number(data.totalRate || 0),
        amount: Number(data.amount || 0)
      });

      return res.data;
    } catch (error) {
      console.error("Update BOQ item error:", error);
      throw error;
    }
  }

  
  static async deleteBoqItem(id: string) {
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