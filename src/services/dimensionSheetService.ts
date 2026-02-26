import API from "../context/axios";

class DimensionSheetService {

  // ===============================
  // GET ALL DIMENSION SHEETS
  // ===============================
  static async getAll(projectId: string) {
    try {
      const res = await API.get(`/dimension-sheets/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get dimension sheets error:", error);
      throw error;
    }
  }

  // ===============================
  // GET SINGLE SHEET
  // ===============================
  static async getById(id: string) {
    try {
      const res = await API.get(`/dimension-sheets/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get sheet error:", error);
      throw error;
    }
  }

  // ===============================
  // CREATE SHEET
  // ===============================
  static async create(projectId: string, data: any) {
    try {
      const res = await API.post(
        `/dimension-sheets/project/${projectId}`,
        {
          ...data,
          rate: Number(data.rate),
          quantity: Number(data.quantity),
          total: Number(data.total),
          length: Number(data.length || 0),
          width: Number(data.width || 0),
          height: Number(data.height || 0),
        }
      );

      return res.data;
    } catch (error) {
      console.error("Create sheet error:", error);
      throw error;
    }
  }

  // ===============================
  // UPDATE SHEET
  // ===============================
  static async update(id: string, data: any) {
    try {
      const res = await API.put(`/dimension-sheets/${id}`, {
        ...data,
        rate: Number(data.rate),
        quantity: Number(data.quantity),
        total: Number(data.total),
      });

      return res.data;
    } catch (error) {
      console.error("Update sheet error:", error);
      throw error;
    }
  }

  // ===============================
  // DELETE SHEET
  // ===============================
  static async delete(id: string) {
    try {
      const res = await API.delete(`/dimension-sheets/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete sheet error:", error);
      throw error;
    }
  }

}

export default DimensionSheetService;