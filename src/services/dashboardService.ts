/// <reference types="vite/client" />


const BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000/api";

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEstimations: number;
  reportsGenerated: number;
  teamMembers: number;
  totalProjectValue: number;
  monthlyProjectsData: { month: string; count: number }[];
  costBreakdown: { label: string; value: number }[];
  recentProjects: Project[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  amount: number;
  status: "Planning" | "In Progress" | "Completed";
  completion: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class DashboardService {
  private static headers = {
    "Content-Type": "application/json",
  };

  /**
   * Get total project statistics
   */
  static async getProjectStats() {
    try {
      const response = await fetch(`${BASE_URL}/projects/stats`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching project stats:", error);
      throw error;
    }
  }

  /**
   * Get monthly project creation data
   */
  static async getMonthlyProjects() {
    try {
      const response = await fetch(`${BASE_URL}/projects/monthly`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching monthly projects:", error);
      throw error;
    }
  }

  /**
   * Get cost breakdown data for the selected time period
   */
  static async getCostBreakdown(projectId?: string) {
    try {
      const url = projectId
        ? `${BASE_URL}/projects/${projectId}/cost-analysis`
        : `${BASE_URL}/projects/cost-analysis`;
      
      const response = await fetch(url, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching cost breakdown:", error);
      throw error;
    }
  }

  /**
   * Get recent projects
   */
  static async getRecentProjects(limit: number = 5) {
    try {
      const response = await fetch(`${BASE_URL}/projects/recent?limit=${limit}`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching recent projects:", error);
      throw error;
    }
  }

  /**
   * Get all projects (paginated)
   */
  static async getProjects(page: number = 1, limit: number = 10) {
    try {
      const response = await fetch(
        `${BASE_URL}/projects?page=${page}&limit=${limit}`,
        { headers: this.headers }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Get reports statistics
   */
  static async getReportsStats() {
    try {
      const response = await fetch(`${BASE_URL}/reports/stats`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching reports stats:", error);
      throw error;
    }
  }

  /**
   * Get BOQ items statistics
   */
  static async getBoqStats() {
    try {
      const response = await fetch(`${BASE_URL}/boq-items/stats`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching BOQ stats:", error);
      throw error;
    }
  }

  /**
   * Get team members count
   */
  static async getTeamMembersCount() {
    try {
      const response = await fetch(`${BASE_URL}/teams/members/count`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching team members count:", error);
      throw error;
    }
  }

  /**
   * Get all dashboard data (composite endpoint - optional)
   * This is useful if you want to fetch all data in a single request
   */
  static async getAllDashboardData(): Promise<DashboardStats> {
    try {
      const [
        projectStats,
        monthlyProjects,
        costBreakdown,
        recentProjects,
        reportsStats,
        boqStats,
        teamCount,
      ] = await Promise.all([
        this.getProjectStats(),
        this.getMonthlyProjects(),
        this.getCostBreakdown(),
        this.getRecentProjects(5),
        this.getReportsStats(),
        this.getBoqStats(),
        this.getTeamMembersCount(),
      ]);

      return {
        totalProjects: projectStats.data?.totalProjects || 0,
        activeProjects: projectStats.data?.activeProjects || 0,
        totalEstimations: boqStats.data?.totalEstimations || 0,
        reportsGenerated: reportsStats.data?.totalReports || 0,
        teamMembers: teamCount.data?.count || 0,
        totalProjectValue: projectStats.data?.totalProjectValue || 0,
        monthlyProjectsData: monthlyProjects.data || [],
        costBreakdown: costBreakdown.data || [],
        recentProjects: recentProjects.data || [],
      };
    } catch (error) {
      console.error("Error fetching all dashboard data:", error);
      throw error;
    }
  }

  /**
   * Get specific project details
   */
  static async getProjectDetails(projectId: string) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  }

  /**
   * Get project BOQ items
   */
  static async getProjectBoqItems(projectId: string) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/boq-items`, {
        headers: this.headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching BOQ items:", error);
      throw error;
    }
  }

  /**
   * Get project material takeoffs
   */
  static async getProjectMaterials(projectId: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/projects/${projectId}/materials`,
        { headers: this.headers }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw error;
    }
  }

  /**
   * Get project labor costs
   */
  static async getProjectLabor(projectId: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/projects/${projectId}/labor`,
        { headers: this.headers }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching labor data:", error);
      throw error;
    }
  }

  /**
   * Get project equipment costs
   */
  static async getProjectEquipment(projectId: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/projects/${projectId}/equipment`,
        { headers: this.headers }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching equipment data:", error);
      throw error;
    }
  }
}

export default DashboardService;
