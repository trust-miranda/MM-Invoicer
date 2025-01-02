SELECT CAST(pc.idprocesso as varchar) as processId, CAST(LTRIM(RTRIM(cl2.no)) as varchar) as insuranceCompanyId, LTRIM(RTRIM(en.nomeinterno)) as insuranceCompanyName, LTRIM(RTRIM(cl.nome)) as patientName
FROM processoclinico pc WITH (NOLOCK)
    LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idcliente=cl.idcliente
    LEFT JOIN entidade en WITH (NOLOCK) ON pc.identidadeseguradora=en.identidade
    LEFT JOIN PHC..cl cl2 WITH (NOLOCK) ON en.identidade=cl2.u_noportal
WHERE pc.idProcessoEstadoSinistro NOT IN (5, 7)
    AND pc.idProcessoEstadoClinico IN (2, 3)
    AND ((pc.dataAdmissao >= '2022-01-01' AND (pc.ePensionista='0' OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')) OR pc.ePensionista='1')
    AND en.identidade IN ('91','248','32015','32048','32202','32203','32204','32355','32381','32412','32493')
    AND( pc.processoadministrativo = 0 OR pc.processoadministrativo IS NULL OR pc.processoadministrativo LIKE '')
    AND cl2.no IS NOT NULL
    AND cl2.inactivo='0'
ORDER BY pc.idprocesso
