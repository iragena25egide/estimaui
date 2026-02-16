import React, { useState, useEffect } from "react";
import { BarChart, LineChart, PieChart, DollarSign, FileText, Users, Briefcase } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProjectsChart from "@/components/dashboard/ProjectsChart";
import CostBreakdownChart from "@/components/dashboard/CostBreakdownChart";
import RecentProjects from "@/components/dashboard/RecentProjects";

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEstimations: number;
  reportsGenerated: number;
  teamMembers: number;
  totalProjectValue: number;
  monthlyProjectsData: { month: string; count: number }[];
  costBreakdown: { label: string; value: number }[];
  recentProjects: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 24,
    activeProjects: 8,
    totalEstimations: 156,
    reportsGenerated: 42,
    teamMembers: 12,
    totalProjectValue: 2450000,
    monthlyProjectsData: [
      { month: "Jan", count: 3 },
      { month: "Feb", count: 5 },
      { month: "Mar", count: 2 },
      { month: "Apr", count: 7 },
      { month: "May", count: 4 },
      { month: "Jun", count: 6 },
      { month: "Jul", count: 5 },
      { month: "Aug", count: 8 },
      { month: "Sep", count: 3 },
      { month: "Oct", count: 4 },
      { month: "Nov", count: 2 },
      { month: "Dec", count: 0 },
    ],
    costBreakdown: [
      { label: "Material", value: 45 },
      { label: "Labor", value: 30 },
      { label: "Equipment", value: 15 },
      { label: "Overhead", value: 10 },
    ],
    recentProjects: [
      {
        id: "1",
        name: "Residential Complex - Phase 1",
        client: "Urban Developers Ltd",
        amount: 850000,
        status: "In Progress",
        completion: 65,
      },
      {
        id: "2",
        name: "Commercial Mall Extension",
        client: "Metro Building Co",
        amount: 1200000,
        status: "In Progress",
        completion: 45,
      },
      {
        id: "3",
        name: "Office Tower Renovation",
        client: "Corporate Spaces Inc",
        amount: 550000,
        status: "Completed",
        completion: 100,
      },
      {
        id: "4",
        name: "Hospital Wing Construction",
        client: "HealthCare Systems",
        amount: 2100000,
        status: "Planning",
        completion: 20,
      },
      {
        id: "5",
        name: "Bridge Infrastructure",
        client: "Municipal Authority",
        amount: 3500000,
        status: "In Progress",
        completion: 72,
      },
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-blue-600";
      case "Completed":
        return "text-green-600";
      case "Planning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50";
      case "Completed":
        return "bg-green-50";
      case "Planning":
        return "bg-yellow-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your estimation project overview.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Briefcase className="w-6 h-6" />}
          color="bg-blue-50"
          iconColor="text-blue-600"
          change="+2.5%"
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<BarChart className="w-6 h-6" />}
          color="bg-green-50"
          iconColor="text-green-600"
          change="+1.2%"
        />
        <DashboardCard
          title="Estimations"
          value={stats.totalEstimations}
          icon={<FileText className="w-6 h-6" />}
          color="bg-purple-50"
          iconColor="text-purple-600"
          change="+5.8%"
        />
        <DashboardCard
          title="Reports"
          value={stats.reportsGenerated}
          icon={<PieChart className="w-6 h-6" />}
          color="bg-orange-50"
          iconColor="text-orange-600"
          change="+3.2%"
        />
        <DashboardCard
          title="Project Value"
          value={`$${(stats.totalProjectValue / 1000000).toFixed(2)}M`}
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-pink-50"
          iconColor="text-pink-600"
          change="+12.5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Projects Over Time - Full Width on Left */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Projects Monthly Overview</h2>
            <ProjectsChart data={stats.monthlyProjectsData} />
          </div>
        </div>

        {/* Cost Breakdown */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Cost Breakdown</h2>
            <CostBreakdownChart data={stats.costBreakdown} />
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Projects</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Project Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Completion</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-4 px-4 text-slate-900 font-medium">{project.name}</td>
                  <td className="py-4 px-4 text-slate-600">{project.client}</td>
                  <td className="py-4 px-4 text-slate-900 font-semibold">
                    ${(project.amount / 1000).toFixed(0)}K
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(
                        project.status
                      )} ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 w-10">{project.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Team Members</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.teamMembers}</p>
          <p className="text-xs text-slate-500 mt-2">Active collaborators</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Avg Project Value</h3>
          <p className="text-3xl font-bold text-slate-900">
            ${(stats.totalProjectValue / stats.totalProjects / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-500 mt-2">Per project</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-slate-900">87%</p>
          <p className="text-xs text-slate-500 mt-2">All-time average</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
