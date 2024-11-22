"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A mixed bar chart";

const chartData = [
  { browser: "chrome", visitors: 90, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 173, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 200, fill: "var(--color-edge)" },
  { browser: "other", visitors: 275, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Total",
  },
  chrome: {
    label: "HSM",
    color: "#4196AC",
  },
  safari: {
    label: "SANFIL",
    color: "#49AAC4",
  },
  firefox: {
    label: "GRUPO CUF",
    color: "#51BCDA",
  },
  edge: {
    label: "LUSÍADAS",
    color: "#51BCD7",
  },
  other: {
    label: "GRUPO HPA",
    color: "#30D9DD",
  },
  victoria: {
    label: "GRUPO LUZ",
    color: "#1FE8E0",
  },
  generali: {
    label: "SAMS",
    color: "#10F5E2",
  },
} satisfies ChartConfig;

export function AgingChartSuppliers() {
  return (
    <section className="aging-chart">
      <header>
        <h2 className="aging-chart-header text-18 font-medium mt-2 pb-1">
          Aging Fornecedores
        </h2>
        <h5 className="aging-chart-header-subtitle text-[12px] text-[#66615b] pb-2">
          Total acumulado desde 2022 (valores em K/€)
        </h5>
      </header>
      <Card className="bg-white">
        <div className="aging-chart-content p-4">
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="browser"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <XAxis dataKey="visitors" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="visitors" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </div>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
        </CardFooter>
      </Card>
    </section>
  );
}
