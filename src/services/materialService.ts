import API from "../context/axios";

class MaterialTakeOffService {
  
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/material-takeoff`, {
        params: { projectId },
      });
      return res.data;
    } catch (error) {
      console.error("Get material take-off error:", error);
      throw error;
    }
  }

 
  static async getById(id: string) {
    try {
      const res = await API.get(`/material-takeoff/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get material take-off record error:", error);
      throw error;
    }
  }

  
  static async create(data: any) {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        rate: Number(data.rate || 0),
        wastagePercent: Number(data.wastagePercent || 0),
        totalCost: Number(data.totalCost || 0),
      };
      const res = await API.post("/material-takeoff/create", payload);
      return res.data;
    } catch (error:any) {
      if (error.response) {
        console.error("Create material take-off error response:", error.response.data);
      } else {
        console.error("Create material take-off error:", error);
      }
      throw error;
    }
  }

 
  static async update(id: string, data: any) {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity || 0),
        rate: Number(data.rate || 0),
        wastagePercent: Number(data.wastagePercent || 0),
        totalCost: Number(data.totalCost || 0),
      };
      const res = await API.patch(`/material-takeoff/${id}`, payload);
      return res.data;
    } catch (error:any) {
      if (error.response) {
        console.error("Update material take-off error response:", error.response.data);
      } else {
        console.error("Update material take-off error:", error);
      }
      throw error;
    }
  }

 
  static async delete(id: string) {
    try {
      const res = await API.delete(`/material-takeoff/${id}`);
      return res.data;
    } catch (error:any) {
      console.error("Delete material take-off error:", error);
      throw error;
    }
  }
}

export default MaterialTakeOffService;