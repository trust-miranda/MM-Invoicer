WITH
    CTE AS (
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
            ROW_NUMBER() OVER (PARTITION BY pd.idProcesso, est.nome ORDER BY c.data) AS rn,
            CASE
                WHEN up.incluidoAvenca = 1 THEN
                    SUM(CASE WHEN up.incluidoAvenca = 1 THEN 1 ELSE 0 END) 
                    OVER (PARTITION BY pd.idProcesso, est.nome ORDER BY c.data ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
                ELSE 0
            END AS avenca_group
        FROM preDataset pd WITH (NOLOCK)
        LEFT JOIN consulta c WITH (NOLOCK) ON pd.idProcesso = c.idProcesso
        LEFT JOIN especialidadeMedica em WITH (NOLOCK) ON c.idEspecialidade = em.idEspecialidade
        LEFT JOIN estabelecimentos est WITH (NOLOCK) ON c.idEstabelecimento = est.idEstabelecimento
        LEFT JOIN entidade en WITH (NOLOCK) ON pd.idEntidadeSeguradora = en.idEntidade
        LEFT JOIN actoMedico am WITH (NOLOCK) ON em.idActoMedico = am.idActoMedico
        LEFT JOIN UnitPrices up WITH (NOLOCK) ON pd.idEntidadeSeguradora = up.identidadeseguradora
        WHERE pd.processoFaturado = 0
            AND c.idEstadoConsulta IN (6,7)
			AND pd.temRecaida=0
			AND am.codigo NOT IN ('01.00.00.82','01.00.00.81', '01.00.01.13','01.00.01.32')
            AND up.datainicio <= GETDATE()
			AND pd.idRamo <> 'AD'
            AND up.datafim >= GETDATE()
            AND LTRIM(RTRIM(am.codigo)) = LTRIM(RTRIM(up.ref)) COLLATE SQL_Latin1_General_CP1_CI_AI
    ),
    CTE2 AS (
        SELECT
            CTE.*,
            MIN(CASE WHEN CTE.incluidoAvenca = 1 THEN CTE.data ELSE NULL END) 
            OVER (PARTITION BY CTE.idProcesso, CTE.nome ORDER BY CTE.data ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS min_data_incluidoAvenca
        FROM CTE
    ),
    CTE3 AS (
        SELECT
            CTE2.*,
            CASE
                WHEN CTE2.incluidoAvenca = 0 THEN 0
                WHEN DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) <= CTE2.DuracaoAvenca THEN 1
                ELSE
                    1 + CEILING((DATEDIFF(DAY, CTE2.min_data_incluidoAvenca, CTE2.data) - CTE2.DuracaoAvenca) * 1.0 / CTE2.DuracaoRenovacao)
            END AS nr_avenca
        FROM CTE2
    ),
    CTE4 AS (
        SELECT
            CTE3.*,
            ROW_NUMBER() OVER (PARTITION BY CTE3.idProcesso, CTE3.nome, CTE3.nr_avenca ORDER BY CTE3.data) AS row_num_within_group
        FROM CTE3
    ),
    CTE5 AS (
        SELECT
            CTE4.*,
            CASE
                WHEN CTE4.incluidoAvenca = 0 THEN CTE4.valorunit
                WHEN CTE4.incluidoAvenca = 1 AND CTE4.nr_avenca=1
                     AND CTE4.row_num_within_group = 1 THEN
                     (SELECT valorunit FROM UnitPrices WHERE ref = '29.00.01.00.' AND idEntidadeSeguradora = CTE4.idEntidadeSeguradora
                      AND datainicio <= GETDATE() AND datafim >= GETDATE())
                WHEN CTE4.incluidoAvenca = 1 AND CTE4.nr_avenca>1
                     AND CTE4.row_num_within_group = 1 THEN
                     (SELECT valorunit FROM UnitPrices WHERE LTRIM(RTRIM(ref)) = '29.00.01. 01.' AND idEntidadeSeguradora = CTE4.idEntidadeSeguradora
                      AND datainicio <= GETDATE() AND datafim >= GETDATE())
                ELSE 0
            END AS ProveitoExpectavelAvenca
        FROM CTE4
    ),
    CTE6 AS (
        SELECT
            CTE5.*,
            -- Populate the ProveitoExpectavelRenovacao column
            CASE
                WHEN CTE5.nr_avenca > 1 THEN CTE5.ProveitoExpectavelAvenca
                ELSE 0
            END AS ProveitoExpectavelRenovacao,

            -- Populate the ProveitoExpectavelConsultas column
            CASE
                WHEN CTE5.incluidoAvenca = 0 THEN CTE5.ProveitoExpectavelAvenca
                ELSE 0
            END AS ProveitoExpectavelConsultas
        FROM CTE5
    ),
    CTE7 AS (
        SELECT
            CTE6.*,
            -- Set ProveitoExpectavelAvenca to 0 if either ProveitoExpectavelRenovacao or ProveitoExpectavelConsultas has a value
            CASE
                WHEN CTE6.ProveitoExpectavelRenovacao <> 0 OR CTE6.ProveitoExpectavelConsultas <> 0 THEN 0
                ELSE CTE6.ProveitoExpectavelAvenca
            END AS Final_ProveitoExpectavelAvenca
        FROM CTE6
    )
SELECT
    CTE7.idProcesso,
    CTE7.idConsulta,
    CTE7.data,
    CTE7.codigo,
    CTE7.especialidade,
    CTE7.nome,
    CTE7.idEntidadeSeguradora,
    CTE7.nomeInterno,
    CTE7.processoFaturado,
    CTE7.valorunit,
    CTE7.incluidoAvenca,
    CTE7.DuracaoAvenca,
    CTE7.DuracaoRenovacao,
    CTE7.nr_avenca,
    CTE7.Final_ProveitoExpectavelAvenca AS ProveitoExpectavelAvenca,
    CTE7.ProveitoExpectavelRenovacao,
    CTE7.ProveitoExpectavelConsultas
FROM CTE7
ORDER BY CTE7.idProcesso, CTE7.data;