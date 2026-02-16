/**
 * Custom Hook for Dashboard Data
 * 
 * Provides easy access to dashboard data with loading and error states
 */

import { useEffect, useState } from "react";
import DashboardService, { DashboardStats } from "@/services/dashboardService";

interface UseDashboardDataReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage dashboard statistics
 * 
 * @returns Object containing stats, loading state, error, and refetch function
 * 
 * @example
 * const { stats, loading, error } = useDashboardData();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return <Dashboard stats={stats} />;
 */
export const useDashboardData = (): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DashboardService.getAllDashboardData();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { stats, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch project statistics only
 * 
 * @returns Object containing project stats, loading state, and error
 */
export const useProjectStats = () => {
  const [projectStats, setProjectStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getProjectStats();
        setProjectStats(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { projectStats, loading, error };
};

/**
 * Hook to fetch monthly projects data for charts
 * 
 * @returns Object containing monthly data, loading state, and error
 */
export const useMonthlyProjects = () => {
  const [monthlyData, setMonthlyData] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getMonthlyProjects();
        setMonthlyData(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch monthly projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { monthlyData, loading, error };
};

/**
 * Hook to fetch cost breakdown data
 * 
 * @param projectId - Optional project ID to get cost breakdown for specific project
 * @returns Object containing cost breakdown, loading state, and error
 */
export const useCostBreakdown = (projectId?: string) => {
  const [costData, setCostData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getCostBreakdown(projectId);
        setCostData(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch cost breakdown");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { costData, loading, error };
};

/**
 * Hook to fetch recent projects
 * 
 * @param limit - Number of recent projects to fetch (default: 5)
 * @returns Object containing recent projects, loading state, and error
 */
export const useRecentProjects = (limit: number = 5) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getRecentProjects(limit);
        setProjects(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch recent projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { projects, loading, error };
};

/**
 * Hook to fetch project details
 * 
 * @param projectId - ID of the project to fetch
 * @returns Object containing project details, loading state, and error
 */
export const useProjectDetails = (projectId: string) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getProjectDetails(projectId);
        setProject(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { project, loading, error };
};

/**
 * Hook to fetch project BOQ items
 * 
 * @param projectId - ID of the project
 * @returns Object containing BOQ items, loading state, and error
 */
export const useProjectBoqItems = (projectId: string) => {
  const [boqItems, setBoqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getProjectBoqItems(projectId);
        setBoqItems(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch BOQ items");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { boqItems, loading, error };
};
