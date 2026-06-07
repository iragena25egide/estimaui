import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, FileText, Users, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RecentProjects from "@/components/dashboard/RecentProjects";
import ProjectService from "@/services/projectService";
import CostBreakdownChart from "@/components/dashboard/CostBreakdownChart";

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
  const { user } = useAuth();

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
      currency: "RWF",
      maximumFractionDigits: 0,
    });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {user?.firstName || "System Admin"} 👋</h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with your projects today.
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

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Briefcase className="w-5 h-5" />}
          loading={loading}
          color="blue"
          iconColor="text-[#10b981]"
          change="+12%"
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Users className="w-5 h-5" />}
          loading={loading}
          color="green"
          iconColor="text-[#10b981]"
          change="+5%"
        />
        <DashboardCard
          title="Total Estimations"
          value={stats.totalEstimations}
          icon={<FileText className="w-5 h-5" />}
          loading={loading}
          color="amber"
          iconColor="text-[#10b981]"
          change="+8%"
        />
        <DashboardCard
          title="Project Value"
          value={formatCurrency(stats.totalProjectValue)}
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
          color="purple"
          iconColor="text-[#10b981]"
          change="+15%"
        />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Cost Valuation Breakdown
            </h3>
            <div className="flex items-center justify-center p-2 min-h-[220px]">
              {loading ? (
                <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-[#10b981] animate-spin" />
              ) : stats.costBreakdown && stats.costBreakdown.length > 0 && stats.costBreakdown.some(c => c.value > 0) ? (
                <div className="w-full max-w-[220px]">
                  <CostBreakdownChart data={stats.costBreakdown} />
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8 text-sm">
                  No estimation data available. Add items to a project BOQ to populate breakdown.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Team & Reports Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Team Members
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
              ) : (
                stats.teamMembers
              )}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Reports Generated
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
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