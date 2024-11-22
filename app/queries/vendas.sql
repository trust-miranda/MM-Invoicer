USE PHC; 

WITH all_months AS (
    SELECT 
        DATEADD(MONTH, -23, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)) AS Ano_Mes
    UNION ALL
    SELECT 
        DATEADD(MONTH, 1, Ano_Mes)
    FROM 
        all_months
    WHERE 
        Ano_Mes < DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)
),

sales_by_month AS (
    SELECT
        cl.nome2,
        cl.no,
        DATEADD(MONTH, DATEDIFF(MONTH, 0, ft.fdata), 0) AS month_start,
        SUM(ft.etotal) / 1000 AS TotalFaturado
    FROM 
        ft
    LEFT JOIN 
        ft2 ON ft.ftstamp = ft2.ft2stamp
    LEFT JOIN 
        cl ON ft.no = cl.no
    WHERE 
        ft.no IN (9,12,111,246,252,325,394,1413,3742)
        AND ft.tipodoc IN (1, 3)
        AND ft2.u_ftcir = '0'
        AND ft.anulado = 0
        AND DATEDIFF(MONTH, ft.fdata, GETDATE()) < 24
        AND DATEDIFF(MONTH, ft.fdata, GETDATE()) > 0
    GROUP BY 
		cl.nome2, cl.no, DATEADD(MONTH, DATEDIFF(MONTH, 0, ft.fdata), 0)
)
SELECT 
    sbm.nome2,
    sbm.no,
    am.Ano_Mes,
    ISNULL(sbm.TotalFaturado, 0) AS totalFaturado
FROM 
    all_months am
LEFT JOIN 
    sales_by_month sbm
ON 
    am.Ano_Mes = sbm.month_start
WHERE 
    DATEDIFF(MONTH, am.Ano_Mes, GETDATE()) < 24  -- Excluir mês atual
    AND DATEDIFF(MONTH, am.Ano_Mes, GETDATE()) > 0 
ORDER BY 
    am.Ano_Mes
OPTION (MAXRECURSION 100);
