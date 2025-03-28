
    SELECT CAST(cenas.processId as VARCHAR) as processId, CAST(cenas.requisitionId as VARCHAR) as requisitionId,
        CASE
WHEN cenas.qtt IS NOT NULL AND cenas.qttc IS NOT NULL AND LEFT(cenas.code,1)='7' THEN CAST(cenas.qttc as VARCHAR)
WHEN cenas.qtt IS NULL AND cenas.qttc IS NULL THEN '1'
WHEN cenas.qtt IS NULL AND cenas.qttc IS NOT NULL AND LEFT(cenas.code,1)<>'7' THEN '0'
ELSE CAST(cenas.qtt as VARCHAR)
END as qtt,
        LTRIM(RTRIM(cenas.code)) COLLATE SQL_Latin1_General_CP1_CI_AI AS code,
        LTRIM(RTRIM(cenas.description)) COLLATE SQL_Latin1_General_CP1_CI_AI AS description,
        CAST(cenas.insuranceCompanyId as INT) as insuranceCompanyId,
        CAST(cenas.supplierId as INT) as supplierId,
        CAST(cenas.establishmentId  as INT) as establishmentId,
        LTRIM(RTRIM(cenas.supplierName)) AS supplierName
    FROM
        (
SELECT
            CAST(r.idProcessoRequerente as VARCHAR) as processId,
            CAST(r.idrequisicao as VARCHAR) as requisitionId,
            CAST(ram.quantidadeRealizada as VARCHAR) AS qtt,
            CAST(am.valorc as VARCHAR) AS qttc,
            COALESCE(am.codigo, am2.codigo, am3.codigo) COLLATE SQL_Latin1_General_CP1_CI_AI AS code,
            COALESCE(am.descricao, am2.descricao, am3.descricao) COLLATE SQL_Latin1_General_CP1_CI_AI AS description,
            CAST(bo.u_nentdest as INT) as insuranceCompanyId,
            CAST(bo.no as INT) as supplierId,
            CAST(bo.estab as INT) as establishmentId,
            LTRIM(RTRIM(bo.nome2)) AS supplierName
        FROM requisicao r WITH (NOLOCK)
            LEFT JOIN processoClinico pc WITH (NOLOCK) ON r.idProcessoRequerente = pc.idProcesso
            LEFT JOIN requisicaoActoMedico ram WITH (NOLOCK) ON r.idRequisicao = ram.idRequisicao
            LEFT JOIN requisicaoExame re WITH (NOLOCK) ON r.idRequisicao = re.idRequisicao
            LEFT JOIN requisicaoConsulta rc WITH (NOLOCK) ON r.idRequisicao = rc.idRequisicao
            LEFT JOIN especialidadeMedica em WITH (NOLOCK) ON rc.idEspecialidade = em.idEspecialidade
            LEFT JOIN actoMedico am WITH (NOLOCK) ON ram.idActoMedico = am.idActoMedico
            LEFT JOIN actoMedico am2 WITH (NOLOCK) ON re.idActoMedico = am2.idActoMedico
            LEFT JOIN actoMedico am3 WITH (NOLOCK) ON em.idActoMedico = am3.idActoMedico
            LEFT JOIN PHC..bo WITH (NOLOCK) ON LTRIM(RTRIM(bo.maquina))=CAST (r.idprocessorequerente as VARCHAR)
            LEFT JOIN PHC..bi WITH (NOLOCK) ON bo.bostamp=bi.bostamp
        WHERE pc.idProcessoEstadoSinistro NOT IN (5, 7)
            AND (LTRIM(RTRIM(bi.lobs2))=CAST(r.idrequisicao as VARCHAR) OR LTRIM(RTRIM(bi.lobs2))=CAST(rc.idconsulta as VARCHAR))
            AND (LTRIM(RTRIM(bi.ref))=am.codigo COLLATE SQL_Latin1_General_CP1_CI_AI OR LTRIM(RTRIM(bi.ref))=am2.codigo COLLATE SQL_Latin1_General_CP1_CI_AI OR LTRIM(RTRIM(bi.ref))=am3.codigo COLLATE SQL_Latin1_General_CP1_CI_AI)
            AND pc.idProcessoEstadoClinico IN (2, 3)
            AND r.idtiporequisicao NOT IN (5,15,12,13,14,16,17)
            AND pc.identidadeseguradora IN ('91','248','32015','32048','32202','32203','32204','32355','32381','32412','32493')
            AND r.idrequisicaoEstado=4
            and bo.fechada='0'
            AND LEFT(bi.ref,2)<>'29'
            AND bo.ndos='47'
            AND ((pc.dataAdmissao >= '2022-01-01' AND (pc.ePensionista='0' OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')) OR pc.ePensionista='1')
            AND (pc.processoAdministrativo = '0' OR pc.processoAdministrativo IS NULL)) cenas

UNION ALL


    (SELECT CAST(LTRIM(RTRIM(bo.maquina)) as Varchar) as processId,
        CAST(LTRIM(RTRIM(bo.maquina)) as Varchar) as requisitionId,
        CAST(bi.qtt as VARCHAR) AS qtt,
        LTRIM(RTRIM(bi.ref)) COLLATE SQL_Latin1_General_CP1_CI_AI AS code,
        LTRIM(RTRIM(bi.design)) COLLATE SQL_Latin1_General_CP1_CI_AI AS description,
        CAST(bo.u_nentdest as INT) as insuranceCompanyId,
        CAST(bo.no as INT) as supplierId,
        CAST(bo.estab as INT) as establishmentId,
        LTRIM(RTRIM(bo.nome2)) AS supplierName
    FROM PHC..bo WITH (NOLOCK)
        LEFT JOIN PHC..bi WITH (NOLOCK) ON bo.bostamp=bi.bostamp
        LEFT JOIN processoClinico pc WITH (NOLOCK) ON LTRIM(RTRIM(bo.maquina))=CAST (LTRIM(RTRIM(pc.idprocesso)) as varchar)
    WHERE bo.ndos='47'
        AND bo.fechada='0'
        AND LEFT(bi.ref,2)='29'
        AND ((pc.dataAdmissao >= '2022-01-01' AND (pc.ePensionista='0' OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')) OR pc.ePensionista='1')
        AND (pc.processoAdministrativo = '0' OR pc.processoAdministrativo IS NULL)
        AND pc.identidadeseguradora IN ('91','248','32015','32048','32202','32203','32204','32355','32381','32412','32493')
        AND pc.idProcessoEstadoClinico IN (2, 3)
        AND pc.idProcessoEstadoSinistro NOT IN (5, 7))
ORDER BY processId,requisitionId