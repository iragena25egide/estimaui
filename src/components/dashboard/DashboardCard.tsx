import React from "react";
import { TrendingUp } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
  change?: string;
  loading?: boolean;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50/60 border-blue-100/80 hover:border-blue-200",
  green: "bg-emerald-50/60 border-emerald-100/80 hover:border-emerald-200",
  amber: "bg-amber-50/60 border-amber-100/80 hover:border-amber-200",
  purple: "bg-purple-50/60 border-purple-100/80 hover:border-purple-200",
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  iconColor,
  change,
  loading = false,
}) => {
  const cardBgClass = colorMap[color] || "bg-white border-slate-100 hover:border-slate-200";

  if (loading) {
    return (
      <div className={`${cardBgClass} rounded-2xl shadow-sm border p-4 transition-all hover:shadow-md`}>
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="w-10 h-10 rounded-xl bg-slate-200" />
          <Skeleton className="w-12 h-4 rounded" />
        </div>
        <Skeleton className="w-3/4 h-3 rounded mb-2" />
        <Skeleton className="w-1/2 h-8 rounded" />
      </div>
    );
  }

  return (
    <div className={`${cardBgClass} rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconColor} p-3 rounded-xl bg-white/50`}>{icon}</div>
        {change && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            {change}
          </div>
        )}
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default DashboardCard;
