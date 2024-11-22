import { AgingChart } from "@/components/ui/BarChart";
import { AgingChartSuppliers } from "@/components/ui/BarChartSuppliers";
import DashboardCard from "@/components/ui/dashboardcard";
import HeaderBox from "@/components/ui/HeaderBox";
import { SalesGrid } from "@/components/ui/SalesGrid";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import TotalReceipts from "@/components/ui/TotalReceipts";
import TotalSales from "@/components/ui/TotalSales";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { PrismaClient } from "@internal/prisma-phc/client";
import { JSX, SVGProps } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TotalPurchases from "../../components/ui/TotalPurchases";
import "../globals.css";
import { BarChartPp } from "../../components/ui/barChartMultiple";

const db_Phc = new PrismaClient();

// Helper function to calculate time until next week starts
function getNextWeekRevalidateTime() {
  const now = new Date();
  const daysUntilNextWeek = 7 - now.getDay(); // Calculate remaining days in the week
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + daysUntilNextWeek);
  nextWeek.setHours(0, 0, 0, 0); // Set to the beginning of the next week

  // Calculate seconds until next week
  return Math.floor((nextWeek.getTime() - now.getTime()) / 1000);
}

async function fetchReceiptsData() {
  const res = await fetch("http://localhost:3000/api/receipts", {
    // next: { revalidate: getNextWeekRevalidateTime() }, // Dynamically revalidate at the start of each week
    // next: { revalidate: 604800 }, // Cache for 1 week
    // next: { revalidate: 12000 }, // Cache for 30 minutes
    // next: { revalidate: 43200 }, // Cache for 12 hours
    // cache: "force-cache", // Ensures the browser uses the cached response if available
  });

  if (!res.ok) {
    throw new Error("Failed to fetch receipts data");
  }

  const data = await res.json();

  // Log the fetched data to see if it's correct
  console.log("Fetched Receipts Data:", data);

  // Return the data directly
  return data;
}

async function fetchSalesData() {
  const res = await fetch("http://localhost:3000/api/sales", {
    // next: { revalidate: 43200 }, // Cache for 30 minutes
    // next: { revalidate: 12000 }, // Cache for 30 minutes
    // next: { revalidate: 604800 }, // Cache for 1 week
    // cache: "force-cache", // Ensures the browser uses the cached response if available
    // next: { revalidate: getNextWeekRevalidateTime() }, // Same weekly revalidation
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sales data");
  }

  const data = await res.json();
  return data;
}

async function fetchPurchasesData() {
  const res = await fetch("http://localhost:3000/api/purchases", {
    // next: { revalidate: 43200 }, // Cache for 30 minutes
    // next: { revalidate: 12000 }, // Cache for 30 minutes
    // next: { revalidate: 604800 }, // Cache for 1 week
    // cache: "force-cache", // Ensures the browser uses the cached response if available
    // next: { revalidate: getNextWeekRevalidateTime() }, // Same weekly revalidation
  });

  if (!res.ok) {
    throw new Error("Failed to fetch purchases data");
  }

  const data = await res.json();
  return data;
}

async function fetchSalesDetailsData() {
  const res = await fetch("http://localhost:3000/api/sales-details", {
    // next: { revalidate: 12000 }, // Cache for 30 minutes
    // next: { revalidate: 604800 }, // Cache for 1 week
    // next: { revalidate: 43200 }, // Cache for 30 minutes
    // cache: "force-cache", // Ensures the browser uses the cached response if available
    // next: { revalidate: getNextWeekRevalidateTime() }, // Same weekly revalidation
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sales details data");
  }

  const data = await res.json();
  return data;
}

// New function to fetch data for BarChartPp
async function fetchProveitosData() {
  const res = await fetch(
    "http://localhost:3000/api/proveitos-avencas-consultas-pp",
    {
      // next: { revalidate: 12000 }, // Cache for 30 minutes
      // next: { revalidate: 604800 }, // Cache for 1 week
      // next: { revalidate: 43200 }, // Cache for 30 minutes
      // cache: "force-cache",
      // next: { revalidate: getNextWeekRevalidateTime() }, // Same weekly revalidation
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Proveitos data");
  }

  const data = await res.json();
  return data.data; // Only return the data array
}

function CircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

const Dashboard = async () => {
  // Existing data fetching
  const { currentWeekData, totalCurrentWeek, avgTotalRecebidoPerWeek } =
    await fetchReceiptsData();

  const {
    currentWeekData: salesWeekData,
    totalCurrentWeek: totalSalesCurrentWeek,
    avgTotalSalesPerWeek,
  } = await fetchSalesData();

  const { allWeeksData: salesData } = await fetchSalesDetailsData();

  const {
    currentWeekData: purchasesWeekData,
    totalCurrentWeek: totalPurchasesCurrentWeek,
    avgTotalPurchasesPerWeek,
  } = await fetchPurchasesData();

  // Fetch data specifically for BarChartPp
  const proveitosData = await fetchProveitosData();

  const loggedIn = await getLoggedInUser();

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Bem-Vindo,"
            user={loggedIn?.name || "Guest"}
            subtext="TRUST - Gestão Integrada de Saúde."
          />
          <h1 className="aging-chart-title text-24 font-semibold mt-6">
            INDICADORES GERAIS
          </h1>
          <div className="summary-cards flex flex-row text-nowrap flex-nowrap gap-4 w-lg">
            <TotalReceipts
              className="text-nowrap"
              totalCurrentWeek={totalCurrentWeek}
              avgTotalRecebidoPerWeek={avgTotalRecebidoPerWeek}
              receiptsData={currentWeekData}
            />
            <TotalSales
              className="text-nowrap"
              totalCurrentWeek={totalSalesCurrentWeek}
              avgTotalSalesPerWeek={avgTotalSalesPerWeek}
              salesData={salesWeekData}
            />
            <TotalPurchases
              className="text-nowrap"
              totalCurrentWeek={totalPurchasesCurrentWeek}
              avgTotalPurchasesPerWeek={avgTotalPurchasesPerWeek}
              purchasesData={purchasesWeekData}
            />
          </div>
        </header>
        <div className="sales-charts flex flex-row gap-4">
          <SalesGrid salesData={salesData} />
        </div>
        <section className="indicators flex flex-col h-[550px] gap-4 w-[100%]">
          <div className="aging-chart-content h-full w-[50%]">
            <BarChartPp data={proveitosData} />
          </div>
          {/* <div className="aging-chart-suppliers-content w-[35%] h-full">
              <AgingChartSuppliers />
            </div> */}
          {/* <div className="status-indicator w-[30%] h-full ">
              <header>
                <h2 className="aging-chart-header text-18 font-medium mt-2 pb-1">
                  Estado Alertas PHC
                </h2>
                <h5 className="aging-chart-header-subtitle text-[12px] text-[#66615b] pb-2">
                  Última atualização em {new Date().toISOString().split("T")[0]}
                </h5>
              </header>
              <Card className=" h-[200px] bg-white ">
                <div className="status-indicator-content p-4">
                  <CardContent className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <CircleIcon className="w-4 h-4 text-green-500" />
                      <span>Alertas de Motores:</span>
                      <span className="font-normal">Ok</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CircleIcon className="w-4 h-4 text-red-500" />
                      <span className="font-semibold">
                        Alerta Criação de APs:
                      </span>
                      <span className="font-bold text-red-500">Erro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CircleIcon className="w-4 h-4 text-green-500" />
                      <span>WebService PHC:</span>
                      <span className="font-normal">Ok</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div> */}
        </section>
      </div>
      {/* <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 12685.45 }, { currentBalance: 500.2 }]}
      /> */}
    </section>
  );
};

export default Dashboard;
