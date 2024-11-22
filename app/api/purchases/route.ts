import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@internal/prisma-phc/client";
import dotenv from "dotenv";

dotenv.config();

const db_Phc = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching purchases data...");

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
-- Summarize purchases by week and nome2, with ranking
ranked_purchases_by_week AS (
    SELECT
        fo.no,
        fo.nome2,
        DATEADD(WEEK, DATEDIFF(WEEK, 0, fo.data), 0) AS week_start,
        SUM(fn.etiliquido) / 1000 AS TotalComprado,
        ROW_NUMBER() OVER (PARTITION BY DATEADD(WEEK, DATEDIFF(WEEK, 0, fo.data), 0) ORDER BY SUM(fn.etiliquido) DESC) AS row_num
    FROM fo WITH (NOLOCK)
    LEFT JOIN fn WITH (NOLOCK) ON fo.fostamp = fn.fostamp
    LEFT JOIN fl WITH (NOLOCK) ON fo.no = fl.no AND fo.estab = fl.estab
    WHERE fo.data >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)  -- Filter data from the start of the year
    AND fl.tipo='Prestador de Rede'
    GROUP BY fo.no, fo.nome2, DATEADD(WEEK, DATEDIFF(WEEK, 0, fo.data), 0)
),
-- Summarize the total for rows greater than rank 9 (i.e., from row 10 onward)
restantes_purchases_by_week AS (
    SELECT
        week_start,
        9999 AS no,
        'Restantes' AS nome2,
        SUM(TotalComprado) AS TotalComprado
    FROM ranked_purchases_by_week
    WHERE row_num > 9  -- All rows after the top 9
    GROUP BY week_start
),
-- Combine the top 9 results with the 'Restantes' row
final_purchases_by_week AS (
    SELECT 
        no,
        nome2,
        week_start,
        TotalComprado
    FROM ranked_purchases_by_week
    WHERE row_num <= 9
    UNION ALL
    SELECT 
        no,
        nome2,
        week_start,
        TotalComprado
    FROM restantes_purchases_by_week
),
-- Calculate the total per week for all nome2s
total_purchases_per_week AS (
    SELECT
        week_start,
        SUM(TotalComprado) AS total_purchases_per_week
    FROM final_purchases_by_week
    GROUP BY week_start
),
-- Calculate the overall average total across all weeks
average_total_purchases_per_week AS (
    SELECT AVG(total_purchases_per_week) AS avg_total_purchases_per_week
    FROM total_purchases_per_week
)
-- Final query combining totals, the overall average, and the week number
SELECT 
    aw.week_start,
    fpb.nome2,
    
    -- Use DENSE_RANK() to assign sequential week numbers based on week_start
    DENSE_RANK() OVER (ORDER BY aw.week_start ASC) AS week_number,
    
    -- Total sales per week per nome2 (which now includes 'Restantes')
    ISNULL(SUM(fpb.TotalComprado), 0) AS total_purchases_per_week_per_nome2,
    
    -- Total sales per week for all nome2s combined
    ISNULL(tp.total_purchases_per_week, 0) AS total_purchases_per_week,
    
    -- The overall average total across all weeks (constant)
    (SELECT avg_total_purchases_per_week FROM average_total_purchases_per_week) AS avg_total_purchases_per_week
    
FROM 
    all_weeks aw
LEFT JOIN 
    final_purchases_by_week fpb ON aw.week_start = fpb.week_start
LEFT JOIN 
    total_purchases_per_week tp ON aw.week_start = tp.week_start
WHERE 
    aw.week_start >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)  -- Limit to data from the start of the year
    AND aw.week_start < DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)  -- Exclude the current week
GROUP BY 
    aw.week_start, fpb.nome2, tp.total_purchases_per_week
ORDER BY 
    aw.week_start, fpb.nome2, total_purchases_per_week_per_nome2
OPTION (MAXRECURSION 100);
  `;

    console.log("SQL Query Result:", result);

    if (result.length === 0) {
      return NextResponse.json({ message: "No purchases data found" });
    }

    // Convert BigInt to regular numbers or strings
    const resultWithFixedBigInt = result.map((entry: any) => ({
      week_start: entry.week_start,
      nome2: entry.nome2.trim(),
      week_number: Number(entry.week_number), // Convert BigInt to number
      total_purchases_per_week_per_nome2:
        entry.total_purchases_per_week_per_nome2,
      total_purchases_per_week: entry.total_purchases_per_week,
      avg_total_purchases_per_week: entry.avg_total_purchases_per_week,
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
        sum + Number(entry.total_purchases_per_week_per_nome2),
      0
    );

    // Extract the overall average total across all weeks
    const avgTotalPurchasesPerWeek =
      resultWithFixedBigInt.length > 0
        ? resultWithFixedBigInt[0].avg_total_purchases_per_week
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
          total_purchases: entry.total_purchases_per_week_per_nome2,
        })),
        totalCurrentWeek,
        avgTotalPurchasesPerWeek: Number(avgTotalPurchasesPerWeek),
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
