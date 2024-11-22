WITH
    CTE
    AS
    (
        SELECT
            pd.idProcesso,
            c.idConsulta,
            c.data,
            am.codigo,
            em.especialidade,
            est.nome,
            pd.idEntidadeSeguradora,
            en.nomeInterno,
            pd.processoFaturado,
            up.valorunit,
            up.incluidoAvenca,
            up.DuracaoAvenca,
            up.DuracaoRenovacao,
            ROW_NUMBER() OVER (PARTITION BY pd.idProcesso ORDER BY c.data) AS rn,
            CASE 
            WHEN up.incluidoAvenca = 1 THEN 
                SUM(CASE WHEN up.incluidoAvenca = 1 THEN 1 ELSE 0 END) OVER (PARTITION BY pd.idProcesso ORDER BY c.data ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
            ELSE 0
        END AS avenca_group
        FROM preDataset pd WITH (NOLOCK)
            LEFT JOIN consulta c WITH (NOLOCK) ON pd.idProcesso=c.idProcesso
            LEFT JOIN especialidadeMedica em WITH (NOLOCK) ON c.idEspecialidade=em.idEspecialidade
            LEFT JOIN estabelecimentos est WITH (NOLOCK) ON c.idEstabelecimento=est.idEstabelecimento
            LEFT JOIN entidade en WITH (NOLOCK) ON pd.idEntidadeSeguradora=en.idEntidade
            LEFT JOIN actoMedico am WITH (NOLOCK) ON em.idActoMedico=am.idActoMedico
            LEFT JOIN UnitPrices up WITH (NOLOCK) ON pd.idEntidadeSeguradora=up.identidadeseguradora
        WHERE c.idEstadoConsulta=6
            AND pd.processoFaturado=0
            AND up.datainicio<=GETDATE()
            AND up.datafim>=GETDATE()
            AND LTRIM(RTRIM(am.codigo))=LTRIM(RTRIM(up.ref)) COLLATE SQL_Latin1_General_CP1_CI_AI
            AND pd.idEntidadeSeguradora <> '32203'
    ),
    CTE2
    AS
    (
        SELECT
            CTE.*,
            MIN(CASE WHEN CTE.incluidoAvenca = 1 THEN CTE.data ELSE NULL END) OVER (PARTITION BY CTE.idProcesso ORDER BY CTE.data ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS min_data_incluidoAvenca
        FROM CTE
    ),
    CTE3
    AS
    (
        SELECT
            CTE2.*,
            CASE 
            WHEN CTE2.incluidoAvenca = 0 THEN 0
            ELSE 
                DENSE_RANK() OVER (PARTITION BY CTE2.idProcesso ORDER BY 
                    CASE 
                        WHEN CTE2.data = CTE2.min_data_incluidoAvenca THEN 1
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 90 THEN 1
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 90 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 120 THEN 2
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 120 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 150 THEN 3
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 150 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 180 THEN 4
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 180 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 210 THEN 5
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 210 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 240 THEN 6
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 240 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 270 THEN 7
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 270 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 300 THEN 8
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 300 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 330 THEN 9
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 330 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 360 THEN 10
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 360 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 390 THEN 11
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 390 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 420 THEN 12
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 420 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 450 THEN 13
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 450 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 480 THEN 14
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 480 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 510 THEN 15
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 510 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 540 THEN 16
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 540 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 570 THEN 17
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 570 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 600 THEN 18
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 600 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 630 THEN 19
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 630 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 660 THEN 20
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 660 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 690 THEN 21
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 690 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 720 THEN 22
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 720 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 750 THEN 23
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 750 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 780 THEN 24
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 780 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 810 THEN 25
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 810 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 840 THEN 26
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 840 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 870 THEN 27
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 870 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 900 THEN 28
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 900 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 930 THEN 29
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 930 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 960 THEN 30
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 960 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 990 THEN 31
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 990 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1020 THEN 32
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1020 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1050 THEN 33
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1050 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1080 THEN 34
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1080 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1110 THEN 35
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1110 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1140 THEN 36
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1140 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1170 THEN 37
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1170 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1200 THEN 38
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1200 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1230 THEN 39
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1230 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1260 THEN 40
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1260 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1290 THEN 41
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1290 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1320 THEN 42
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1320 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1350 THEN 43
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1350 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1380 THEN 44
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1380 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1410 THEN 45
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1410 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1440 THEN 46
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1440 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1470 THEN 47
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1470 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1500 THEN 48
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1500 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1530 THEN 49
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1530 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1560 THEN 50
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1560 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1590 THEN 51
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1590 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1620 THEN 52
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1620 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1650 THEN 53
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1650 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1680 THEN 54
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1680 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1710 THEN 55
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1710 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1740 THEN 56
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1740 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1770 THEN 57
                        WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) > 1770 AND DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= 1800 THEN 58
                        ELSE 0
                    END
                ) 
        END AS nr_avenca
        FROM CTE2
    )
SELECT
    CTE3.idProcesso,
    CTE3.idConsulta,
    CTE3.data,
    CTE3.codigo,
    CTE3.especialidade,
    CTE3.nome,
    CTE3.idEntidadeSeguradora,
    CTE3.nomeInterno,
    CTE3.processoFaturado,
    CTE3.valorunit,
    CTE3.incluidoAvenca,
    CTE3.DuracaoAvenca,
    CTE3.DuracaoRenovacao,
    MAX(CTE3.nr_avenca) AS max_nr_avenca,
    CASE
        WHEN ROW_NUMBER() OVER (PARTITION BY CTE3.idProcesso, MAX(CTE3.nr_avenca) ORDER BY CTE3.data) = 1
        THEN (MAX(CTE3.nr_avenca) * up.valorunit)
        ELSE 0
    END AS ProveitoExpectavelAvenca
FROM CTE3
    JOIN UnitPrices up
    ON up.idEntidadeSeguradora = CTE3.idEntidadeSeguradora
        AND up.ref = '29.00.01.00.'
        AND up.datainicio <= GETDATE()
        AND up.datafim >= GETDATE()
GROUP BY 
    CTE3.idProcesso, 
    CTE3.idConsulta, 
    CTE3.data, 
    CTE3.codigo, 
    CTE3.especialidade, 
    CTE3.nome, 
    CTE3.idEntidadeSeguradora, 
    CTE3.nomeInterno, 
    CTE3.processoFaturado, 
    CTE3.valorunit, 
    CTE3.incluidoAvenca, 
    CTE3.DuracaoAvenca, 
    CTE3.DuracaoRenovacao,
    up.valorunit
ORDER BY CTE3.idProcesso, CTE3.data;
