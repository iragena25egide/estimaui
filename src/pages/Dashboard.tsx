import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, FileText, Users, Briefcase, Plus } from "lucide-react";

import DashboardCard from "../components/dashboard/DashboardCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import ProjectService from "../services/projectService";

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

  // =============================
  // Fetch Dashboard Data
  // =============================
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        projectStats,
        recentProjects,
      ] = await Promise.all([
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

  const currency = (n: number) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Overview
          </h1>
          <p className="text-sm text-slate-500">
            Dashboard analytics and project summary
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/reports")}
            className="bg-white border px-3 py-2 rounded-lg text-sm"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Reports
          </button>

          <button
            onClick={() => navigate("/projects/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Briefcase className="w-6 h-6" />}
          loading={loading} color={""} iconColor={""}        />

        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Users className="w-6 h-6" />}
          loading={loading} color={""} iconColor={""}        />

        <DashboardCard
          title="Estimations"
          value={stats.totalEstimations}
          icon={<FileText className="w-6 h-6" />}
          loading={loading} color={""} iconColor={""}        />

        <DashboardCard
          title="Project Value"
          value={currency(stats.totalProjectValue)}
          icon={<DollarSign className="w-6 h-6" />}
          loading={loading} color={""} iconColor={""}        />
      </div>

      {/* RECENT PROJECTS */}
      <RecentProjects
        projects={stats.recentProjects}
        loading={loading}
      />

      {/* SIDE INFO */}
      <div className="bg-white p-4 rounded-2xl border">
        <h3 className="text-sm font-medium mb-3">
          Team & Reports
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded">
            <div className="text-xs text-slate-500">Team Members</div>
            <div className="text-xl font-semibold">
              {stats.teamMembers}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded">
            <div className="text-xs text-slate-500">Reports</div>
            <div className="text-xl font-semibold">
              {stats.reportsGenerated}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;