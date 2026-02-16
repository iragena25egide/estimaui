# EstimaPro Dashboard

A comprehensive project estimation dashboard built with React, TypeScript, and Chart.js.

## Features

### 📊 Dashboard Components

#### 1. **Statistics Cards**
- **Total Projects**: Count of all projects in the system
- **Active Projects**: Currently running/in-progress projects
- **Estimations**: Total BOQ items and estimation entries
- **Reports**: Generated estimation reports
- **Project Value**: Total monetary value of all projects

Each card displays:
- Current metric value
- Trend indicator (% change)
- Color-coded icon for quick recognition

#### 2. **Charts & Visualizations**

**Projects Monthly Overview** (Bar Chart)
- Shows project creation trends over 12 months
- Helps identify peak project periods
- Interactive hover tooltips

**Cost Breakdown** (Doughnut Chart)
- Material costs (45%)
- Labor costs (30%)
- Equipment costs (15%)
- Overhead costs (10%)
- Useful for budget allocation insights

#### 3. **Recent Projects Table**
Displays your most recent projects with:
- Project name
- Client name
- Project amount (in $K format)
- Current status (Planning, In Progress, Completed)
- Completion percentage with visual progress bar

Status color coding:
- 🔵 **Planning** (Yellow)
- 🔵 **In Progress** (Blue) 
- 🟢 **Completed** (Green)

#### 4. **Footer Statistics**
- Team Members count
- Average project value
- Overall completion rate

## Architecture

### Component Structure

```
src/
├── pages/
│   └── Dashboard.tsx          # Main dashboard page
├── components/
│   └── dashboard/
│       ├── DashboardCard.tsx      # Reusable stat card component
│       ├── ProjectsChart.tsx      # Monthly projects bar chart
│       ├── CostBreakdownChart.tsx # Cost breakdown pie chart
│       └── RecentProjects.tsx     # Recent projects table
```

### Key Technologies

- **React 18** with TypeScript
- **Chart.js 4** - Data visualization
- **react-chartjs-2** - React wrapper for Chart.js
- **Tailwind CSS** - Styling
- **Lucide Icons** - UI icons

## Data Structure

### Dashboard Statistics Interface

```typescript
interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEstimations: number;
  reportsGenerated: number;
  teamMembers: number;
  totalProjectValue: number;
  monthlyProjectsData: { month: string; count: number }[];
  costBreakdown: { label: string; value: number }[];
  recentProjects: ProjectType[];
}
```

### Project Interface

```typescript
interface Project {
  id: string;
  name: string;
  client: string;
  amount: number;
  status: "Planning" | "In Progress" | "Completed";
  completion: number; // 0-100
}
```

## API Integration Guide

The dashboard is currently using **mock data**. To connect to your backend, follow these steps:

### 1. Update Dashboard.tsx

Replace the `useState` initialization with API calls:

```typescript
useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      // Call your API endpoints
      const projectsRes = await fetch("/api/projects");
      const projectsData = await projectsRes.json();
      
      const reportsRes = await fetch("/api/reports");
      const reportsData = await reportsRes.json();
      
      // Transform and set state
      setStats({
        totalProjects: projectsData.length,
        activeProjects: projectsData.filter(p => p.status === "In Progress").length,
        // ... map other data
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  fetchDashboardStats();
}, []);
```

### 2. Required API Endpoints

Based on your Prisma schema, implement these endpoints:

**GET /api/projects**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Project Name",
      "client": "Client Name",
      "contractType": "BOQ|LUMP_SUM|COST_PLUS",
      "startDate": "ISO date",
      "completionDate": "ISO date"
    }
  ]
}
```

**GET /api/projects/stats**
```json
{
  "totalProjects": 24,
  "activeProjects": 8,
  "completedProjects": 12,
  "totalProjectValue": 2450000,
  "averageProjectValue": 102083.33
}
```

**GET /api/boq-items/stats**
```json
{
  "totalEstimations": 156,
  "averageItemValue": 3500
}
```

**GET /api/reports/stats**
```json
{
  "totalReports": 42,
  "pendingReports": 5,
  "sentReports": 37
}
```

**GET /api/projects/monthly**
```json
{
  "data": [
    { "month": "Jan", "count": 3 },
    { "month": "Feb", "count": 5 },
    // ... 12 months
  ]
}
```

**GET /api/projects/cost-analysis**
```json
{
  "data": [
    { "label": "Material", "value": 45 },
    { "label": "Labor", "value": 30 },
    { "label": "Equipment", "value": 15 },
    { "label": "Overhead", "value": 10 }
  ]
}
```

**GET /api/projects/recent**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Project Name",
      "client": "Client Name",
      "amount": 850000,
      "status": "In Progress|Planning|Completed",
      "completion": 65
    }
  ]
}
```

**GET /api/teams/members/count**
```json
{
  "count": 12
}
```

### 3. Add Data Fetching Hook

Create a custom hook for data fetching:

```typescript
// src/hooks/useDashboardData.ts
import { useEffect, useState } from "react";

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projects, reports, boq, monthly, costAnalysis, recent, teamCount] = 
          await Promise.all([
            fetch("/api/projects").then(r => r.json()),
            fetch("/api/reports/stats").then(r => r.json()),
            fetch("/api/boq-items/stats").then(r => r.json()),
            fetch("/api/projects/monthly").then(r => r.json()),
            fetch("/api/projects/cost-analysis").then(r => r.json()),
            fetch("/api/projects/recent").then(r => r.json()),
            fetch("/api/teams/members/count").then(r => r.json()),
          ]);

        setStats({
          totalProjects: projects.data.length,
          activeProjects: projects.data.filter(p => p.status === "In Progress").length,
          totalEstimations: boq.data.totalEstimations,
          reportsGenerated: reports.data.totalReports,
          teamMembers: teamCount.data.count,
          totalProjectValue: projects.data.reduce((sum, p) => sum + p.amount, 0),
          monthlyProjectsData: monthly.data,
          costBreakdown: costAnalysis.data,
          recentProjects: recent.data,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading, error };
};
```

### 4. Update Dashboard to Use Hook

```typescript
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboardData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  // Rest of component...
};
```

## Styling

The dashboard uses Tailwind CSS with a professional color scheme:

- **Primary**: Blue (slate-900, blue-600)
- **Success**: Green (green-50, green-600)
- **Warning**: Yellow (yellow-50, yellow-600)
- **Info**: Blue (blue-50, blue-600)
- **Secondary**: Purple, Orange, Pink for accent cards

### Custom Classes Used

- `rounded-2xl` - Modern rounded corners
- `shadow-sm` - Subtle shadows
- `border-slate-100` - Subtle borders
- `bg-slate-50` - Light backgrounds
- `backdrop-blur-sm` - Frosted glass effect

## Performance Considerations

1. **Memoization**: Components are simple and don't require React.memo() yet
2. **Chart Optimization**: Charts are rendered with `maintainAspectRatio: true`
3. **Data Fetching**: Use `useEffect` with dependency array to avoid unnecessary API calls
4. **Pagination**: Consider pagination for tables with large datasets
5. **Caching**: Implement SWR or React Query for better cache management

## Future Enhancements

- [ ] Real-time data updates with WebSockets
- [ ] Export dashboard data to PDF/Excel
- [ ] Customizable date range filters
- [ ] Project filtering and search
- [ ] Advanced analytics and trends
- [ ] Team performance metrics
- [ ] Budget vs actual cost comparison
- [ ] Project forecasting
- [ ] Custom dashboard layouts

## Troubleshooting

### Charts Not Rendering
- Ensure Chart.js is properly registered in component
- Check browser console for validation errors
- Verify data structure matches expected format

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure Tailwind CSS is properly configured
- Check that new breakpoints are defined in tailwind.config.js

### Data Not Loading
- Check network tab in browser DevTools
- Verify API endpoints are correct
- Check for CORS issues
- Ensure authentication tokens are included in requests
