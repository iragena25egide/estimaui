import API from "../context/axios";

export interface Project {
  id: string;
  name: string;
  client: string;
  amount?: number;
  status?: string;
  completion?: number;
}

class ProjectService {
  static async createProject(data: any) {
    try {
      const res = await API.post("/projects/create", data);
      return res.data;
    } catch (error: any) {
      console.error("Create project error:", error);
      throw error;
    }
  }

  
  static async getMyProjects() {
    try {
      const res = await API.get("/projects/my");
      
      return res.data;
    } catch (error: any) {
      console.error("Get projects error:", error);
      throw error;
    }
  }

  
  static async getRecentProjects(limit: number = 5) {
    try {
      const res = await API.get(`/projects/recent?limit=${limit}`);
      
      return res.data;
      
    } catch (error: any) {
      console.error("Recent projects error:", error);
      throw error;
    }
  }

  
  static async countProjects() {
    try {
      const res = await API.get("/projects/count");
      return res.data;
    } catch (error: any) {
      console.error("Count projects error:", error);
      throw error;
    }
  }

  static async getProjectById(id: string) {
    try {
      const res = await API.get(`/projects/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Get project error:", error);
      throw error;
    }
  }

  
  static async updateProject(id: string, data: any) {
    try {
      const res = await API.put(`/projects/${id}`, data);
      return res.data;
    } catch (error: any) {
      console.error("Update project error:", error);
      throw error;
    }
  }

  
  static async deleteProject(id: string) {
    try {
      const res = await API.delete(`/projects/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Delete project error:", error);
      throw error;
    }
  }
}

export default ProjectService;