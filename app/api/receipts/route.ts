import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@internal/prisma-phc/client";
import dotenv from "dotenv";

dotenv.config();

const db_Phc = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching receipts data...");

    // Query to fetch the sales data
    const result = await db_Phc.$queryRaw`
-- Generate a list of all weeks since the beginning of the year
WITH all_weeks AS (
    SELECT 
        DATEADD(WEEK, DATEDIFF(WEEK, 0, DATEFROMPARTS(YEAR(GETDATE()), 1, 1)), 0) AS week_start  -- Start from the first week of the current year
    UNION ALL
    SELECT 
        DATEADD(WEEK, 1, week_start)
    FROM 
        all_weeks
    WHERE 
        week_start < DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)
),
-- Summarize sales by week and nome2
sales_by_week AS (
    SELECT
        re.no,
        re.nome2,
        DATEADD(WEEK, DATEDIFF(WEEK, 0, re.rdata), 0) AS week_start,
        SUM(rl.eval)/1000 AS TotalFaturado
    FROM re
    LEFT JOIN rl ON re.restamp = rl.restamp
    LEFT JOIN tsre ON re.ndoc = tsre.ndoc
    WHERE re.no IN (9,12,111,246,252,325,394,477,1413,3742)
    AND re.ndoc = 1
    AND re.anulado = 0
    AND re.rdata >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)  -- Filter data from the start of the year
    GROUP BY re.no, re.nome2, DATEADD(WEEK, DATEDIFF(WEEK, 0, re.rdata), 0)
),
-- Calculate the total per week for all nome2s
total_per_week AS (
    SELECT
        week_start,
        SUM(TotalFaturado) AS total_per_week
    FROM sales_by_week
    GROUP BY week_start
),
-- Calculate the overall average total across all weeks
average_total_all_weeks AS (
    SELECT AVG(total_per_week) AS avg_total_recebido_all_weeks
    FROM total_per_week
)
-- Final query combining totals, the overall average, and the week number
SELECT 
    CAST(aw.week_start as DATE) AS week_start,
    sbw.nome2,
    
    -- Use DENSE_RANK() to assign sequential week numbers based on week_start
    DENSE_RANK() OVER (ORDER BY aw.week_start ASC) AS week_number,

    -- Total amount for each nome2 per week
    ISNULL(SUM(sbw.TotalFaturado), 0) AS total_recebido_per_week_per_nome2,
    
    -- Total amount received for each week (all nome2s combined)
    ISNULL(tp.total_per_week, 0) AS total_recebido_per_week,
    
    -- The overall average total across all weeks
    (SELECT avg_total_recebido_all_weeks FROM average_total_all_weeks) AS avg_total_recebido_per_week
    
FROM 
    all_weeks aw
LEFT JOIN 
    sales_by_week sbw ON aw.week_start = sbw.week_start
LEFT JOIN 
    total_per_week tp ON aw.week_start = tp.week_start
WHERE 
    aw.week_start >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)  -- Start from the first week of the year
    AND aw.week_start < DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)  -- Exclude the current week
GROUP BY
    aw.week_start, sbw.nome2, tp.total_per_week
ORDER BY
    aw.week_start, sbw.nome2
OPTION (MAXRECURSION 100);

  `;

    console.log("SQL Query Result:", result);

    if (result.length === 0) {
      return NextResponse.json({ message: "No receipts data found" });
    }

    // Convert BigInt to regular numbers or strings
    const resultWithFixedBigInt = result.map((entry: any) => ({
      week_start: entry.week_start,
      nome2: entry.nome2.trim(),
      week_number: Number(entry.week_number), // Convert BigInt to number
      total_recebido_per_week_per_nome2:
        entry.total_recebido_per_week_per_nome2,
      total_recebido_per_week: entry.total_recebido_per_week,
      avg_total_recebido_per_week: entry.avg_total_recebido_per_week,
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
        sum + Number(entry.total_recebido_per_week_per_nome2),
      0
    );

    // Extract the overall average total across all weeks
    const avgTotalRecebidoPerWeek =
      resultWithFixedBigInt.length > 0
        ? resultWithFixedBigInt[0].avg_total_recebido_per_week
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
          total_recebido: entry.total_recebido_per_week_per_nome2,
        })),
        totalCurrentWeek,
        avgTotalRecebidoPerWeek: Number(avgTotalRecebidoPerWeek),
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching receipts data:", error);
    return NextResponse.json(
      { error: "Error fetching receipts data" },
      { status: 500 }
    );
  }
}
