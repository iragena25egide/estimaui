import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, FileText, Users, Briefcase, Plus } from "lucide-react";
import DashboardCard from "../components/dashboard/DashboardCard";
import RecentProjects from "../components/dashboard/RecentProjects";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [stats] = useState<DashboardStats>({
    totalProjects: 24,
    activeProjects: 8,
    totalEstimations: 156,
    reportsGenerated: 42,
    teamMembers: 12,
    totalProjectValue: 2450000,
    costBreakdown: [
      { label: "Material", value: 45 },
      { label: "Labor", value: 30 },
      { label: "Equipment", value: 15 },
      { label: "Overhead", value: 10 },
    ],
    recentProjects: [
      {
        id: "1",
        name: "IPRC NEW LAB FOR Y1 IT",
        client: "RP KIGALI",
        amount: 25000000,
        status: "In Progress",
        completion: 65,
      },
      {
        id: "2",
        name: "Switchiify Headquarters",
        client: "Switchiify Inc",
        amount: 6000000,
        status: "Planning",
        completion: 45,
      },
      {
        id: "3",
        name: "NGORORERO MUSEUM",
        client: "IWACU GROUP",
        amount: 55000000,
        status: "Completed",
        completion: 100,
      },
      {
        id: "4",
        name: "KIGALI HEALTHCARE CENTER",
        client: "KIGALI CITY COUNCIL",
        amount: 21000000,
        status: "Planning",
        completion: 20,
      },
      {
        id: "5",
        name: "Bridge Infrastructure AT MUSANZE",
        client: "MUSANZE DISTRICT",
        amount: 35000000,
        status: "In Progress",
        completion: 72,
      },
    ],
  });

  const currency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  React.useEffect(() => {
    // simulate loading; replace with real data fetch
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500">A concise view of active projects, estimations and team activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm hover:shadow-sm"
            aria-label="Go to reports"
          >
            <FileText className="w-4 h-4 text-slate-700" /> Reports
          </button>
          <button
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            aria-label="Create new project"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Briefcase className="w-6 h-6" />}
          color="bg-white"
          iconColor="text-slate-700"
          change="+6%"
          loading={loading}
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Users className="w-6 h-6" />}
          color="bg-white"
          iconColor="text-slate-700"
          change="-2%"
          loading={loading}
        />
        <DashboardCard
          title="Estimations"
          value={stats.totalEstimations}
          icon={<FileText className="w-6 h-6" />}
          color="bg-white"
          iconColor="text-slate-700"
          change="+12%"
          loading={loading}
        />
        <DashboardCard
          title="Project Value"
          value={currency(stats.totalProjectValue)}
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-white"
          iconColor="text-slate-700"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects projects={stats.recentProjects} />
        </div>

        <div className="lg:col-span-1">
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Team & Reports</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">Team Members</div>
                <div className="text-lg font-semibold text-slate-900">{stats.teamMembers}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">Reports</div>
                <div className="text-lg font-semibold text-slate-900">{stats.reportsGenerated}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2">Cost breakdown</div>
              <div className="space-y-2">
                {stats.costBreakdown.map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-sm">
                    <div className="text-slate-700">{c.label}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-slate-900 font-semibold">{c.value}%</div>
                      <div className="w-24 bg-slate-100 h-2 rounded-full">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${c.value}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Upcoming</h3>
            <p className="text-sm text-slate-500">No critical milestones for the next 7 days.</p>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
