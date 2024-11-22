"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export const description = "Gráfico de Barras de Proveitos - Prestação Própria";

const chartConfig = {
  ProveitoExpectavelAvenca: {
    label: "Avenca",
    color: "#4196AC",
  },
  ProveitoExpectavelRenovacao: {
    label: "Renovação",
    color: "#51BCD7",
  },
  ProveitoExpectavelConsultas: {
    label: "Consultas",
    color: "#10f5e2",
  },
};

const formatValue = (value: number) => {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
};

const formatNome = (nome: string) => {
  if (nome.includes("Lisboa - TRUST HCVP")) return "Lisboa HCVP";
  if (nome.includes("Torres Vedras - TRUST")) return "Torres Vedras";
  if (nome.includes("Santarém - TRUST")) return "Santarém";
  if (nome.includes("Penafiel - TRUST")) return "Penafiel";
  if (nome.includes("Porto - TRUST Porto Baixa")) return "Porto";
  if (nome.includes("Lisboa - TRUST")) return "Lisboa";
  return nome;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <p>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${chartConfig[entry.dataKey].label}: ${formatValue(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function BarChartPp() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/proveitos-avencas-consultas-pp");
        const data = await response.json();

        if (response.ok && data?.data) {
          const formattedData = data.data.map((entry: any) => ({
            nome: formatNome(entry.nome),
            ProveitoExpectavelAvenca: Number(entry.ProveitoExpectavelAvenca),
            ProveitoExpectavelRenovacao: Number(
              entry.ProveitoExpectavelRenovacao
            ),
            ProveitoExpectavelConsultas: Number(
              entry.ProveitoExpectavelConsultas
            ),
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="charts-carousel">
      <h1 className="charts-carousel-title text-24 font-semibold mt-6 pb-4">
        ACRÉSCIMOS E DIFERIMENTOS
      </h1>
      <Card className="bg-white pt-8 pb-2 pl-2 pr-2 w-full max-w-full">
        <CardHeader className="flex items-start pb-2">
          <div className="gap-2">
            <CardTitle className="text-18 font-medium pl-1 m-2">
              Proveitos - Prestação Própria
            </CardTitle>
            <CardDescription className=" text-[12px] pl-1 m-2">
              Valores por Unidade (em K/€)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-start justify-start">
          <div className="text-start items-start justify-start w-[100%] h-[100%]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%" aspect={2}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="nome"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    tickFormatter={(value) => formatNome(value)}
                  />
                  <YAxis
                    axisLine={false}
                    tickFormatter={(value) => formatValue(value)}
                    tick={{ fontSize: "10px", className: "text-xs" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#000" }} />
                  <Bar
                    dataKey="ProveitoExpectavelAvenca"
                    fill={chartConfig.ProveitoExpectavelAvenca.color}
                    name={chartConfig.ProveitoExpectavelAvenca.label}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="ProveitoExpectavelRenovacao"
                    fill={chartConfig.ProveitoExpectavelRenovacao.color}
                    name={chartConfig.ProveitoExpectavelRenovacao.label}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="ProveitoExpectavelConsultas"
                    fill={chartConfig.ProveitoExpectavelConsultas.color}
                    name={chartConfig.ProveitoExpectavelConsultas.label}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-1 mt-4 text-xs flex items-center text-muted-foreground">
          <span className="text-xs font-sans-serif text-gray-600 ml-0 mb-2">
            Última Atualização em{" "}
            {new Date().toLocaleDateString("pt-pt", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
            .
          </span>
        </CardFooter>
      </Card>
    </section>
  );
}
