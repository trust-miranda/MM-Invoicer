USE TRUST_GESTAO_CLINICA_PROD
SELECT CAST(pc.idprocesso as varchar) as processId, CAST(pc.numprocseguradora as varchar) AS insuProcessId
FROM processoclinico pc WITH (NOLOCK)
WHERE pc.idProcessoEstadoSinistro NOT IN (5, 7)
    AND pc.idProcessoEstadoClinico IN (2, 3)
    AND ((pc.dataAdmissao >= '2022-01-01' AND (pc.ePensionista='0' OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')) OR pc.ePensionista='1')
    AND pc.identidadeseguradora IN ('91','248','32015','32048','32202','32203','32204','32355','32381','32412','32493')
    AND pc.processoadministrativo = 0 OR pc.processoadministrativo IS NULL OR pc.processoadministrativo LIKE ''