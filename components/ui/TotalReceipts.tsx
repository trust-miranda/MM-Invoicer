import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import DoughnutChartReceipts from "./DoughnutChartReceipts";
import AnimatedCounter from "./AnimatedCounter";

interface TotalReceiptsProps {
  totalCurrentWeek: number;
  avgTotalRecebidoPerWeek: number;
  receiptsData: { nome2: string; total_recebido: number }[];
}

const TotalReceipts = ({
  totalCurrentWeek,
  avgTotalRecebidoPerWeek,
  receiptsData,
}: TotalReceiptsProps) => {
  console.log("Total Receipts Props - Receipts Data:", receiptsData); // Log data passed to Doughnut chart

  return (
    <section className="total-balance bg-white">
      <div className="flex flex-col gap-2">
        <h2 className="header-2">Recebimentos</h2>
        <div className="total-balance-chart">
          <DoughnutChartReceipts accounts={receiptsData} />{" "}
          {/* Use currentWeekData directly */}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="total-balance-label">Última semana:</div>
        <div className="total-balance-amount flex-center">
          <AnimatedCounter amount={totalCurrentWeek} suffix="k €" />
        </div>
        <div className="total-balance-label">Média semanal:</div>
        <div className="total-balance-amount flex-center">
          <AnimatedCounter amount={avgTotalRecebidoPerWeek} suffix="k €" />
        </div>
      </div>
    </section>
  );
};

export default TotalReceipts;
