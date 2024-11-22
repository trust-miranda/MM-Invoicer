"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

// Configuration for line chart colors and labels
const chartConfig = {
  u_ftcir_0: {
    label: "Ambulatório",
    color: "#4196AC",
  },
  u_ftcir_1: {
    label: "Cirurgias",
    color: "#10f5e2",
  },
} satisfies ChartConfig;

// Props interface, adjusted to use total sales data instead of 'vendas' and 'compras'
interface LineChartProps {
  data: { week_start: string; u_ftcir_0: number; u_ftcir_1: number }[];
  isAgeasChart?: boolean; // Prop to know if this is AGEAS
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <p className="label">{`Semana de: ${new Date(label).toLocaleDateString("pt-PT")}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${chartConfig[entry.dataKey].label}: ${Math.round(entry.value)}K`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default function LineChartComponent({
  data,
  isAgeasChart = false,
}: LineChartProps) {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        data={data} // Pass the sales data
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />

        {/* XAxis for weekly data, displayed as month names */}
        <XAxis
          dataKey="week_start"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={4} // Adjust based on how often you want ticks (4 means roughly every month)
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleString("default", { month: "short" });
          }}
          // Custom styling for the X-axis label
          tick={{ fontSize: "10px", className: "text-xs" }}
        />

        <YAxis
          axisLine={false}
          tickFormatter={(value) => `${Math.round(value)}K`} // Round values here
          domain={[
            0,
            (dataMax) =>
              isAgeasChart ? Math.max(dataMax + 500) : dataMax + 95,
          ]}
          // Custom styling for the Y-axis label
          tick={{ fontSize: "10px", className: "text-xs" }}
        />
        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} cursor={false} />

        {/* Line for u_ftcir = 0 sales */}
        <Line
          dataKey="u_ftcir_0"
          type="monotone"
          stroke={chartConfig.u_ftcir_0.color}
          strokeWidth={2}
          dot={false}
        />

        {/* Line for u_ftcir = 1 sales */}
        <Line
          dataKey="u_ftcir_1"
          type="monotone"
          stroke={chartConfig.u_ftcir_1.color}
          strokeWidth={2}
          dot={false}
        />

        {/* Legend */}
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
