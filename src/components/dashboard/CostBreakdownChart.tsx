import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CostBreakdownChartProps {
  data: { label: string; value: number }[];
}

const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ data }) => {
  const colors = [
    "rgba(59, 130, 246, 0.8)",     // Blue
    "rgba(34, 197, 94, 0.8)",      // Green
    "rgba(245, 158, 11, 0.8)",     // Amber
    "rgba(239, 68, 68, 0.8)",      // Red
  ];

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: colors,
        borderColor: ["white", "white", "white", "white"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: "500" as const,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            return data.labels.map((label: string, index: number) => ({
              text: `${label}: ${data.datasets[0].data[index]}%`,
              fillStyle: data.datasets[0].backgroundColor[index],
              index,
            }));
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options as any} />;
};

export default CostBreakdownChart;
