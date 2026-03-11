import API from "../context/axios";

class SpecificationService {
  // Get all specifications for a project
  static async getByProject(projectId: string) {
    try {
      const res = await API.get(`/specifications/project/${projectId}`);
      return res.data;
    } catch (error) {
      console.error("Get specifications error:", error);
      throw error;
    }
  }

  // Get single specification by ID
  static async getById(id: string) {
    try {
      const res = await API.get(`/specifications/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get specification error:", error);
      throw error;
    }
  }

  // Create a new specification
  static async create(data: any) {
    try {
      const { projectId, ...rest } = data;
      const res = await API.post(`/specifications/project/${projectId}`, rest);
      return res.data;
    } catch (error) {
      console.error("Create specification error:", error);
      throw error;
    }
  }

  // Update an existing specification
  static async update(id: string, data: any) {
    try {
      const { projectId, ...rest } = data; // projectId not needed for update but keep for payload
      const res = await API.put(`/specifications/${id}`, rest);
      return res.data;
    } catch (error) {
      console.error("Update specification error:", error);
      throw error;
    }
  }

  // Delete a specification
  static async delete(id: string) {
    try {
      const res = await API.delete(`/specifications/${id}`);
      return res.data;
    } catch (error) {
      console.error("Delete specification error:", error);
      throw error;
    }
  }
}

export default SpecificationService;