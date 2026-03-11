import API from "../context/axios";

class BoqService {
  /**
   * Fetch all BOQ items for a specific project
   */
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/boq-items/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get BOQ items error:", error);
      throw error;
    }
  }

  /**
   * Fetch a single BOQ item by ID
   */
  static async getById(id: string) {
    try {
      const res = await API.get(`/boq-items/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get BOQ item error:", error);
      throw error;
    }
  }

  /**
   * Create a new BOQ item
   * Expects data object containing projectId and all fields
   */
  static async create(data: any) {
    try {
      // Ensure numeric fields are numbers
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        materialRate: Number(data.materialRate || 0),
        laborRate: Number(data.laborRate || 0),
        equipmentRate: Number(data.equipmentRate || 0),
        totalRate: Number(data.totalRate || 0),
        amount: Number(data.amount || 0),
      };

      // The backend expects projectId in the URL, so we extract it
      const { projectId, ...rest } = payload;
      const res = await API.post(`/boq-items/project/${projectId}`, rest);
      return res.data;
    } catch (error) {
      console.error("Create BOQ item error:", error);
      throw error;
    }
  }

  /**
   * Update an existing BOQ item
   */
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

      const res = await API.put(`/boq-items/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Update BOQ item error:", error);
      throw error;
    }
  }

  /**
   * Delete a BOQ item by ID
   */
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