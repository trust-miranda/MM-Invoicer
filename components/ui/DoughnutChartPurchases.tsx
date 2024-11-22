"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect } from "react";

// Register the ArcElement for the doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  accounts: { nome2: string; total_purchases: number }[];
}

const DoughnutChartPurchases = ({ accounts }: DoughnutChartProps) => {
  useEffect(() => {
    console.log("Purchases data for Doughnut chart:", accounts);
  }, [accounts]);

  if (!accounts || accounts.length === 0) {
    return <div>Sem dados disponíveis para esta semana.</div>;
  }
  const data = {
    datasets: [
      {
        label: "Total",
        data: accounts.map((account) => account.total_purchases),
        backgroundColor: [
          "#4196AC",
          "#49AAC4",
          "#51BCDA",
          "#51BCD7",
          "#30D9DD",
          "#1FE8E0",
          "#18EEE1",
          "#10F5E2",
        ],
      },
    ],
    labels: accounts.map((account) => account.nome2),
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChartPurchases;
