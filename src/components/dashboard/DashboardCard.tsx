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

const bgMap: Record<string, string> = {
  blue: "bg-blue-50",
  green: "bg-emerald-50",
  amber: "bg-amber-50",
  purple: "bg-purple-50",
};

const textMap: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-emerald-600",
  amber: "text-amber-600",
  purple: "text-purple-600",
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  iconColor, // Not used strictly now since we use textMap[color]
  change,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-full bg-slate-100" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
        <Skeleton className="w-1/2 h-8 rounded mb-2" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>
    );
  }

  const isPositive = change?.startsWith("+");
  const changeBg = isPositive ? "bg-emerald-50" : change?.startsWith("-") ? "bg-red-50" : "bg-slate-50";
  const changeText = isPositive ? "text-emerald-600" : change?.startsWith("-") ? "text-red-600" : "text-slate-600";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgMap[color] || "bg-slate-50"} ${textMap[color] || "text-slate-600"}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${changeBg} ${changeText}`}>
            {isPositive || change?.startsWith("-") ? (
              <TrendingUp className={`w-3 h-3 ${!isPositive ? "rotate-180" : ""}`} />
            ) : null}
            {change} <span className="text-slate-500 font-normal hidden xl:inline">from last month</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    </div>
  );
};

export default DashboardCard;
