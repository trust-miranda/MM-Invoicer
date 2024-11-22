"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";
import { RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import LineChartComponent from "./LineChart"; // Line chart component
import axios from "axios";

interface SalesGridProps {
  salesData: { week_start: string; u_ftcir_0: number; u_ftcir_1: number }[];
}

export function SalesGrid({ salesData }: SalesGridProps) {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    async function fetchSalesDetailsData() {
      try {
        const response = await axios.get("/api/sales-details");
        const { allWeeksData } = response.data;

        // Transform data to the format required by charts
        const chartData = transformData(allWeeksData);
        setCharts(chartData);
      } catch (error) {
        console.error("Error fetching sales details data:", error);
      }
    }

    fetchSalesDetailsData();
  }, []);

  // Transformation to fit into the LineChart component
  const transformData = (allWeeksData) => {
    const groupedData = {};

    allWeeksData.forEach((entry) => {
      const {
        week_start,
        nome2,
        total_sales_per_week_per_nome2_per_type,
        u_ftcir,
      } = entry;

      // Create a new group for each client (nome2)
      if (!groupedData[nome2]) {
        groupedData[nome2] = {};
      }

      // Create a new entry for each week_start
      if (!groupedData[nome2][week_start]) {
        groupedData[nome2][week_start] = {
          week_start,
          u_ftcir_0: 0, // default value for non-surgical
          u_ftcir_1: 0, // default value for surgical
        };
      }

      // Proper comparison for 'u_ftcir'
      if (u_ftcir === "0" || u_ftcir === false) {
        groupedData[nome2][week_start].u_ftcir_0 =
          total_sales_per_week_per_nome2_per_type;
      } else if (u_ftcir === "1" || u_ftcir === true) {
        groupedData[nome2][week_start].u_ftcir_1 =
          total_sales_per_week_per_nome2_per_type;
      }
    });

    // Convert the grouped data into a format suitable for the chart
    const chartData = Object.keys(groupedData).map((clientName, index) => {
      const data = Object.values(groupedData[clientName]); // Array of weeks with data
      return {
        id: index,
        nome2: clientName.trim(), // Trim any whitespace around the client name
        data, // Data for each week
      };
    });

    return chartData;
  };

  return (
    <section className="charts-carousel">
      <header>
        <h1 className="charts-carousel-title text-24 font-semibold mt-6 pb-4">
          EVOLUÇÃO DAS VENDAS
        </h1>
      </header>
      <Carousel opts={{ align: "start" }} className="w-full max-w-full ">
        <CarouselContent className="carousel-content">
          {charts.map((chart) => (
            <CarouselItem
              key={chart.id}
              className="md:basis-1/2 lg:basis-1/3 p-2"
            >
              <Card className="bg-white pt-8 pb-2 pl-2 pr-2">
                <CardHeader className="flex items-start pb-2">
                  <div className="gap-2">
                    <CardTitle className="text-18 font-medium pl-1 m-2">
                      {chart.nome2}
                    </CardTitle>
                    <CardDescription className=" text-[12px] pl-1 m-2">
                      Evolução Semanal (em K/€)
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-start justify-start">
                  <div className="text-start items-start justify-start w-[100%] h-[100%]">
                    {/* Pass the transformed data to the LineChartComponent */}
                    <LineChartComponent
                      data={chart.data}
                      isAgeasChart={chart.nome2 === "AGEAS"}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-1 mt-4 text-xs flex items-center text-muted-foreground">
                  <span className="text-xs font-sans-serif text-gray-600 ml-0 mb-2">
                    Última Atualização em{" "}
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                    .
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <footer>
          <div className="flex justify-center mb-4 mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </footer>
      </Carousel>
    </section>
  );
}
