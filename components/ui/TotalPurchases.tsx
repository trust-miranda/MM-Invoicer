import React from "react";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChartPurchases from "./DoughnutChartPurchases";

interface TotalPurchasesProps {
  totalCurrentWeek: number;
  avgTotalPurchasesPerWeek: number;
  purchasesData: { nome2: string; total_purchases: number }[];
}

const TotalPurchases = ({
  totalCurrentWeek,
  avgTotalPurchasesPerWeek,
  purchasesData,
}: TotalPurchasesProps) => {
  console.log("Total Purchases Props - Purchases Data:", purchasesData);

  return (
    <section className="total-balance bg-white">
      <div className="flex flex-col gap-2">
        <h2 className="header-2 text-xl text-center">Compras</h2>
        <div className="total-balance-chart">
          <DoughnutChartPurchases accounts={purchasesData} />{" "}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="total-balance-label">Última semana</div>
        <div className="total-balance-amount flex-center">
          <AnimatedCounter amount={totalCurrentWeek} suffix="k €" />
        </div>
        <div className="total-balance-label">Média semanal:</div>
        <div className="total-balance-amount flex-center">
          <AnimatedCounter amount={avgTotalPurchasesPerWeek} suffix="k €" />
        </div>
      </div>
    </section>
  );
};

export default TotalPurchases;
