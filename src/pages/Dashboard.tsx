import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, FileText, Users, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RecentProjects from "@/components/dashboard/RecentProjects";
import ProjectService from "@/services/projectService";

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEstimations: number;
  reportsGenerated: number;
  teamMembers: number;
  totalProjectValue: number;
  costBreakdown: { label: string; value: number }[];
  recentProjects: any[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalEstimations: 0,
    reportsGenerated: 0,
    teamMembers: 0,
    totalProjectValue: 0,
    costBreakdown: [],
    recentProjects: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [projectStats, recentProjects] = await Promise.all([
        ProjectService.countProjects(),
        ProjectService.getRecentProjects(),
      ]);

      setStats({
        totalProjects: projectStats.totalProjects || 0,
        activeProjects: projectStats.activeProjects || 0,
        totalEstimations: projectStats.totalEstimations || 0,
        reportsGenerated: projectStats.reportsGenerated || 0,
        teamMembers: projectStats.teamMembers || 0,
        totalProjectValue: projectStats.totalProjectValue || 0,
        costBreakdown: projectStats.costBreakdown || [],
        recentProjects: recentProjects || [],
      });
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your projects and estimates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/reports")}
            className="border-gray-200 rounded-xl"
          >
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button
            onClick={() => navigate("/dashboard/projects")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Briefcase className="w-6 h-6" />}
          loading={loading}
          color="blue"
          iconColor="text-blue-600"
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Users className="w-6 h-6" />}
          loading={loading}
          color="green"
          iconColor="text-green-600"
        />
        <DashboardCard
          title="Estimations"
          value={stats.totalEstimations}
          icon={<FileText className="w-6 h-6" />}
          loading={loading}
          color="amber"
          iconColor="text-amber-600"
        />
        <DashboardCard
          title="Project Value"
          value={formatCurrency(stats.totalProjectValue)}
          icon={<DollarSign className="w-6 h-6" />}
          loading={loading}
          color="purple"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Projects */}
      <RecentProjects  />

      {/* Team & Reports Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team & Reports
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Team Members
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                stats.teamMembers
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Reports Generated
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                stats.reportsGenerated
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;