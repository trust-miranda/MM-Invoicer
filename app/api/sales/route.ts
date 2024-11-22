import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@internal/prisma-phc/client";
import dotenv from "dotenv";

dotenv.config();

const db_Phc = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching sales data...");

    // Query to fetch the sales data
    const result = await db_Phc.$queryRaw`
-- Generate a list of all weeks since the beginning of the year
WITH all_weeks AS (
    SELECT 
        DATEADD(WEEK, DATEDIFF(WEEK, 0, DATEFROMPARTS(YEAR(GETDATE()), 1, 1)), 0) AS week_start
    UNION ALL
    SELECT 
        DATEADD(WEEK, 1, week_start)
    FROM 
        all_weeks
    WHERE 
        week_start < DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)
),
sales_by_week AS (
    SELECT
        ft.no,
        ft.nome2,
        DATEADD(WEEK, DATEDIFF(WEEK, 0, ft.fdata), 0) AS week_start,
        SUM(fi.etiliquido)/1000 AS TotalFaturado
    FROM ft WITH (NOLOCK)
    LEFT JOIN fi WITH (NOLOCK) ON ft.ftstamp=fi.ftstamp
    LEFT JOIN ft2 ON ft.ftstamp=ft2.ft2stamp
    WHERE ft.no IN (9,12,111,246,252,325,394,477,1413,3742)
    AND ft.tipodoc IN (1,3)
    AND ft2.u_ftcir IN ('0','1')
    AND ft.anulado=0
    AND ft.fdata >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
    GROUP BY ft.no, ft.nome2, DATEADD(WEEK, DATEDIFF(WEEK, 0, ft.fdata), 0)
),
total_sales_per_week AS (
    SELECT
        week_start,
        SUM(TotalFaturado) AS total_sales_per_week
    FROM sales_by_week
    GROUP BY week_start
),
average_total_sales_per_week AS (
    SELECT AVG(total_sales_per_week) AS avg_total_sales_per_week
    FROM total_sales_per_week
)
SELECT 
    aw.week_start,
    sbw.nome2,
    DENSE_RANK() OVER (ORDER BY aw.week_start ASC) AS week_number,
    ISNULL(SUM(sbw.TotalFaturado), 0) AS total_sales_per_week_per_nome2,
    ISNULL(ts.total_sales_per_week, 0) AS total_sales_per_week,
    (SELECT avg_total_sales_per_week FROM average_total_sales_per_week) AS avg_total_sales_per_week
FROM 
    all_weeks aw
LEFT JOIN 
    sales_by_week sbw ON aw.week_start = sbw.week_start
LEFT JOIN 
    total_sales_per_week ts ON aw.week_start = ts.week_start
WHERE 
    aw.week_start >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
AND aw.week_start < DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)
GROUP BY 
    aw.week_start, sbw.nome2, ts.total_sales_per_week
ORDER BY 
    aw.week_start, sbw.nome2
OPTION (MAXRECURSION 100);
  `;

    console.log("SQL Query Result:", result);

    if (result.length === 0) {
      return NextResponse.json({ message: "No sales data found" });
    }

    // Convert BigInt to regular numbers or strings
    const resultWithFixedBigInt = result.map((entry: any) => ({
      week_start: entry.week_start,
      nome2: entry.nome2.trim(),
      week_number: Number(entry.week_number), // Convert BigInt to number
      total_sales_per_week_per_nome2: entry.total_sales_per_week_per_nome2,
      total_sales_per_week: entry.total_sales_per_week,
      avg_total_sales_per_week: entry.avg_total_sales_per_week,
    }));

    // Find the highest week_number (current week)
    const maxWeekNumber = Math.max(
      ...resultWithFixedBigInt.map((entry: any) => Number(entry.week_number))
    );

    // Filter to get only the entries with the maximum week_number (current week)
    const currentWeekData = resultWithFixedBigInt.filter(
      (entry: any) => Number(entry.week_number) === maxWeekNumber
    );

    // Calculate total for current week
    const totalCurrentWeek = currentWeekData.reduce(
      (sum: number, entry: any) =>
        sum + Number(entry.total_sales_per_week_per_nome2),
      0
    );

    // Extract the overall average total across all weeks
    const avgTotalSalesPerWeek =
      resultWithFixedBigInt.length > 0
        ? resultWithFixedBigInt[0].avg_total_sales_per_week
        : 0;

    // Set caching headers
    const headers = {
      "Cache-Control": "public, s-maxage=12000, stale-while-revalidate=59",
    };

    // Return the data with caching headers
    return NextResponse.json(
      {
        allWeeksData: resultWithFixedBigInt,
        currentWeekData: currentWeekData.map((entry: any) => ({
          nome2: entry.nome2,
          total_sales: entry.total_sales_per_week_per_nome2,
        })),
        totalCurrentWeek,
        avgTotalSalesPerWeek: Number(avgTotalSalesPerWeek),
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Error fetching sales data" },
      { status: 500 }
    );
  }
}
