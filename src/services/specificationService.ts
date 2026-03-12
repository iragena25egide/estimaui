import API from "../context/axios";

class SpecificationService {
 
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`specifications/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get specifications error:", error);
      throw error;
    }
  }

  
  static async getById(id: string) {
    try {
      const res = await API.get(`specifications/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get specification error:", error);
      throw error;
    }
  }

  
  static async create(data: any) {
    try {
     
      const res = await API.post("specifications/create", data);
      return res.data;
    } catch (error) {
      console.error("Create specification error:", error);
      throw error;
    }
  }

  
  static async update(id: string, data: any) {
    try {
      const res = await API.patch(`specifications/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Update specification error:", error);
      throw error;
    }
  }

  
  static async delete(id: string) {
    try {
      const res = await API.delete(`specifications/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete specification error:", error);
      throw error;
    }
  }
}

export default SpecificationService;