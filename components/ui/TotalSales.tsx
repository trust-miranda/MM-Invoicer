import React from "react";
import DoughnutChartSales from "./DoughnutChartSales";
import AnimatedCounter from "./AnimatedCounter";

interface TotalSalesProps {
  totalCurrentWeek: number;
  avgTotalSalesPerWeek: number;
  salesData: { nome2: string; total_sales: number }[];
}

const TotalSales = ({
  totalCurrentWeek,
  avgTotalSalesPerWeek,
  salesData,
}: TotalSalesProps) => {
  console.log("Total Sales Props - Sales Data:", salesData);

  return (
    <section className="total-balance bg-white">
      <div className="flex flex-col gap-2">
        <h2 className="header-2 text-xl text-center">Vendas</h2>
        <div className="total-balance-chart">
          <DoughnutChartSales accounts={salesData} />{" "}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="total-balance-label">Última semana:</div>
        <div className="total-balance-amount flex-center">
          <AnimatedCounter amount={totalCurrentWeek} suffix="k €" />
        </div>
        <div className="total-balance-label">Média semanal:</div>
        <div className="total-balance-amount flex-center">
          <AnimatedCounter amount={avgTotalSalesPerWeek} suffix="k €" />
        </div>
      </div>
    </section>
  );
};

export default TotalSales;
