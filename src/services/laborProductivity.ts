import API from "../context/axios";

class LaborProductivityService {
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/labor-productivity/project/${projectId}`);
      return res.data;
    } catch (error:any) {
      console.error("Get labor productivity error:", error);
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const res = await API.get(`/labor-productivity/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get labor productivity record error:", error);
      throw error;
    }
  }

  static async create(data: any) {
    try {
      const payload = {
        ...data,
        productivityRate: Number(data.productivityRate || 0),
        wageRate: Number(data.wageRate || 0),
        workingHours: Number(data.workingHours || 0),
        outputPerDay: Number(data.outputPerDay || 0),
        totalLaborCost: Number(data.totalLaborCost || 0), 
      };
      const res = await API.post("/labor-productivity/create", payload);
      return res.data;
    } catch (error:any) {
      if (error.response) {
        console.error("Create labor productivity error response:", error.response.data);
      } else {
        console.error("Create labor productivity error:", error);
      }
      throw error;
    }
  }

  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        productivityRate: Number(data.productivityRate || 0),
        wageRate: Number(data.wageRate || 0),
        workingHours: Number(data.workingHours || 0),
        outputPerDay: Number(data.outputPerDay || 0),
        totalLaborCost: Number(data.totalLaborCost || 0),
      };
      const res = await API.patch(`/labor-productivity/${id}`, payload);
      return res.data;
    } catch (error:any) {
      if (error.response) {
        console.error("Update labor productivity error response:", error.response.data);
      }
      throw error;
    }
  }

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