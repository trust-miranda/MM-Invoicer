WITH
    TODOS
    AS
    (
        SELECT d.*, en.nomeExterno as nomeExterno, pes.estadoSinistro as estadoSinistro, pec.estadoClinico as estadoClinico
        FROM predataset d WITH (NOLOCK)
            LEFT JOIN processoclinico pc WITH (NOLOCK) on d.idprocesso=pc.idprocesso
            LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON d.idProcessoEstadoSinistro=pes.idProcessoEstadoSinistro
            LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON d.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
            LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idCliente = cl.idCliente
            LEFT JOIN entidade en WITH (NOLOCK) ON d.idEntidadeSeguradora=en.idEntidade
            LEFT JOIN estabelecimentos est WITH (NOLOCK) ON pc.idEstabelecimento = est.idEstabelecimento
        WHERE pc.idEntidadeSeguradora IN ('91','32203','32355','32493')
            AND pc.numProcSeguradora IS NOT NULL
            AND pc.numProcSeguradora > ''
            AND pc.idProcessoEstadoClinico = 3
            AND pc.idProcessoEstadoSinistro NOT IN (5, 7)
            AND (pc.processoAdministrativo = 0 OR pc.processoAdministrativo IS NULL OR pc.processoAdministrativo LIKE '')
            AND (pc.ePensionista = 0 OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')
            AND pc.idRamo = 'AT'
            AND pc.dataAdmissao >= '2022-01-01'
            AND pc.idProcesso <> 387894
            AND DATEDIFF(DAY, d.dataPrimeiraConsulta, d.dataUltimaConsulta) <= 60
            AND d.dataUltimaConsulta <= GETDATE() - 2
            AND d.NrParceirosConsultas=1
            AND d.NrRequisicoesDentaria=0
            AND d.NrRequisicoesEnfermagem = 0
            AND d.nrConsultasEspecialidadesForaAvenca=0
            AND d.NrRequisicoesRX<=1
            AND d.nrRequisicoes<=1
            AND d.NrRequisicoesFisioterapia = 0
            AND d.NrRequisicoesPorExecutar = 0
            AND d.NrConsultasPorExecutar = 0
            AND d.nrRequisicoesCirurgia=0
            AND d.nrRequisicoesAnalises=0
            AND d.nrRequisicoes=d.nrRequisicoesRX
            AND d.NrRequisicoesImagiologiaAExcluir = 0
            AND d.temRecaida = 0
            AND d.temTransferencia=0
            AND d.NrConsultasEspecialidadesForaAvenca = 0
            AND d.processoFaturado=0
    ),

    UNAGENERALI
    AS
    (
        SELECT d.*, en.nomeExterno as nomeExterno, pes.estadoSinistro as estadoSinistro, pec.estadoClinico as estadoClinico
        FROM predataset d WITH (NOLOCK)
            LEFT JOIN processoclinico pc WITH (NOLOCK) on d.idprocesso=pc.idprocesso
            LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON d.idProcessoEstadoSinistro=pes.idProcessoEstadoSinistro
            LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON d.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
            LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idCliente = cl.idCliente
            LEFT JOIN entidade en WITH (NOLOCK) ON d.idEntidadeSeguradora=en.idEntidade
            LEFT JOIN estabelecimentos est WITH (NOLOCK) ON pc.idEstabelecimento = est.idEstabelecimento
        WHERE pc.idEntidadeSeguradora IN ('32412','32015')
            AND pc.numProcSeguradora IS NOT NULL
            AND pc.numProcSeguradora > ''
            AND pc.idProcessoEstadoClinico = 3
            AND d.nrConsultas>2
            AND pc.idProcessoEstadoSinistro NOT IN (5, 7)
            AND (pc.processoAdministrativo = 0 OR pc.processoAdministrativo IS NULL OR pc.processoAdministrativo LIKE '')
            AND (pc.ePensionista = 0 OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')
            AND pc.idRamo = 'AT'
            AND pc.dataAdmissao >= '2022-01-01'
            AND pc.idProcesso <> 387894
            AND DATEDIFF(DAY, d.dataPrimeiraConsulta, d.dataUltimaConsulta) <= 60
            AND d.dataUltimaConsulta <= GETDATE() - 2
            AND d.NrParceirosConsultas=1
            AND d.NrRequisicoesDentaria=0
            AND d.NrRequisicoesEnfermagem = 0
            AND d.NrRequisicoesRX<=1
            AND d.nrRequisicoes<=1
            AND d.NrRequisicoesFisioterapia = 0
            AND d.NrRequisicoesPorExecutar = 0
            AND d.NrConsultasPorExecutar = 0
            AND d.nrRequisicoesCirurgia=0
            AND d.nrRequisicoesAnalises=0
            AND d.nrRequisicoes=d.nrRequisicoesRX
            AND d.NrRequisicoesImagiologiaAExcluir = 0
            AND d.temRecaida = 0
            AND d.temTransferencia=0
            AND d.NrConsultasEspecialidadesForaAvenca = 0
            AND d.processoFaturado=0
    ),

    AGEAS
    AS
    (
        SELECT d.*, en.nomeExterno as nomeExterno, pes.estadoSinistro as estadoSinistro, pec.estadoClinico as estadoClinico
        FROM predataset d WITH (NOLOCK)
            LEFT JOIN processoclinico pc WITH (NOLOCK) on d.idprocesso=pc.idprocesso
            LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON d.idProcessoEstadoSinistro=pes.idProcessoEstadoSinistro
            LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON d.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
            LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idCliente = cl.idCliente
            LEFT JOIN entidade en WITH (NOLOCK) ON d.idEntidadeSeguradora=en.idEntidade
            LEFT JOIN estabelecimentos est WITH (NOLOCK) ON pc.idEstabelecimento = est.idEstabelecimento
        WHERE pc.idEntidadeSeguradora IN ('32048','32204')
            AND pc.numProcSeguradora IS NOT NULL
            AND pc.numProcSeguradora > ''
            AND pc.idProcessoEstadoClinico = 3
            AND pc.idProcessoEstadoSinistro NOT IN (5, 7)
            AND (pc.processoAdministrativo = 0 OR pc.processoAdministrativo IS NULL OR pc.processoAdministrativo LIKE '')
            AND (pc.ePensionista = 0 OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')
            AND pc.idRamo = 'AT'
            AND pc.dataAdmissao >= '2022-01-01'
            AND pc.idProcesso <> 387894
            AND DATEDIFF(DAY, d.dataPrimeiraConsulta, d.dataUltimaConsulta) <= 60
            AND d.dataUltimaConsulta <= GETDATE() - 2
            AND d.NrParceirosConsultas=1
            AND d.NrRequisicoesDentaria=0
            AND d.NrRequisicoesEnfermagem = 0
            AND d.nrConsultasEspecialidadesForaAvenca=0
            AND d.NrRequisicoesRX<=1
            AND d.NrRequisicoesFisioterapia = 0
            AND d.NrRequisicoesPorExecutar = 0
            AND d.NrConsultasPorExecutar = 0
            AND d.nrRequisicoesCirurgia=0
            AND d.nrRequisicoesAnalises=0
            AND d.nrRequisicoes=d.nrRequisicoesRX
            AND d.NrRequisicoesImagiologiaAExcluir = 0
            AND d.temRecaida = 0
            AND d.temTransferencia=0
            AND d.NrConsultasEspecialidadesForaAvenca = 0
            AND d.processoFaturado=0
    ),


    GROUPED
    AS
    (
                            SELECT *
            FROM TODOS
        UNION
            SELECT *
            FROM UNAGENERALI
        UNION
            SELECT *
            FROM AGEAS
    ),

    RECORDS
    AS
    (
        SELECT *
        FROM GROUPED
    ),

    Headers
    AS
    (
        SELECT NEWID() as id,
            RECORDS.identidadeseguradora as identidade,
            RECORDS.nomeExterno as seguradora,
            RECORDS.nomesinistrado as nomesinistrado,
            RECORDS.idramo as idRamo,
            RECORDS.estadoSinistro as estadoSinistro,
            RECORDS.estadoClinico as estadoClinico,
            RECORDS.ePensionista as pensionista,
            RECORDS.dataAdmissao as dataadmissao,
            RECORDS.dataAlta as dataalta,
            RECORDS.idprocesso as idprocesso,
            RECORDS.numApolice as numapolice,
            RECORDS.numProcSeguradora as numprocseguradora
        FROM RECORDS
    ),

    ResultLinhas
    AS
    (
                    SELECT
                RECORDS.idProcesso as idProcesso,
                '' as idLinha,
                '29.00.01.00.' as ref,
                'Avença' as descricao,
                '1' as qtt,
                '' as valorunit,
                '0' as idrequisicao,
                '' as idrequisicaoactomedico,
                '1723849200' as datafinal,
                '1718665200' as dataopen,
                'nao' as texto,
                null as idavenca
            FROM RECORDS
        UNION
            SELECT
                RECORDS.idProcesso as idProcesso,
                '' as idLinha,
                '01.00.01.10' as ref,
                'Avaliação Clínica' as descricao,
                '1' as qtt,
                '' as valorunit,
                '0' as idrequisicao,
                '' as idrequisicaoactomedico,
                '1723849200' as datafinal,
                '1718665200' as dataopen,
                'nao' as texto,
                null as idavenca
            FROM RECORDS
    ),

    PREINVOICE
    AS
    (
        SELECT h.*, l.idLinha, l.ref, l.descricao, l.qtt,
            CASE
WHEN t.idEntidadeSeguradora=91 and l.ref='29.00.01.00.' THEN '103'
WHEN t.idEntidadeSeguradora=32015 and l.ref='29.00.01.00.' THEN '103'
WHEN t.idEntidadeSeguradora=32355 and l.ref='29.00.01.00.' THEN '99.28'
WHEN t.idEntidadeSeguradora=32412 and l.ref='29.00.01.00.' THEN '110'
WHEN t.idEntidadeSeguradora=32048 AND t.idEntidadePrestador='45' and l.ref='29.00.01.00.' THEN '45.48'
WHEN t.idEntidadeSeguradora=32204 AND t.idEntidadePrestador='45' and l.ref='29.00.01.00.' THEN '45.48'
WHEN t.idEntidadeSeguradora=32048 AND t.idEstabelecimento='14764' and l.ref='29.00.01.00.' THEN '45.48'
WHEN t.idEntidadeSeguradora=32204 AND t.idEstabelecimento='14764' and l.ref='29.00.01.00.' THEN '45.48'
WHEN t.idEntidadeSeguradora IN (32048,32204) AND t.idEstabelecimento<>'14764' AND t.idEntidadePrestador<>'45' and l.ref='29.00.01.00.' THEN '101.06'
WHEN t.idEntidadeSeguradora=91 and l.ref='01.00.01.10' THEN '36.37'
WHEN t.idEntidadeSeguradora=32015 and l.ref='01.00.01.10' AND t.idEntidadePrestador<>'44' THEN '26.5'
WHEN t.idEntidadeSeguradora=32015 and l.ref='01.00.01.10' AND t.idEntidadePrestador='44' THEN '0'
WHEN t.idEntidadeSeguradora=32355 and l.ref='01.00.01.10'  THEN '32.92'
WHEN t.idEntidadeSeguradora=32412 and l.ref='01.00.01.10'  THEN '37'
WHEN t.idEntidadeSeguradora=32048 AND t.idEntidadePrestador='45' and l.ref='01.00.01.10'  THEN '25.53'
WHEN t.idEntidadeSeguradora=32204 AND t.idEntidadePrestador='45' and l.ref='01.00.01.10'  THEN '25.53'
WHEN t.idEntidadeSeguradora=32048 AND t.idEstabelecimento='14764' and l.ref='01.00.01.10'  THEN '25.53'
WHEN t.idEntidadeSeguradora=32204 AND t.idEstabelecimento='14764' and l.ref='01.00.01.10'  THEN '25.53'
WHEN t.idEntidadeSeguradora IN (32048,32204) AND t.idEstabelecimento<>'14764' AND t.idEntidadePrestador<>'45' and l.ref='01.00.01.10'  THEN '25.53'
END AS valorunit,
            l.idrequisicao, l.idrequisicaoactomedico, l.datafinal, l.dataopen, l.texto, l.idavenca
        FROM Headers h, ResultLinhas l, RECORDS t
        WHERE h.idprocesso=l.idProcesso
            AND t.idProcesso=h.idprocesso
            AND t.idProcesso=l.idProcesso
            AND NOT EXISTS (SELECT prv.idProcesso
            FROM processoRegistoVendas prv
            WHERE prv.idProcesso=t.idProcesso)
            AND NOT EXISTS (SELECT prv.idProcesso
            FROM vendasMMInvoicer prv
            WHERE prv.idProcesso=t.idProcesso)
    )

SELECT *
FROM PREINVOICE
WHERE valorunit>'0'
ORDER BY idprocesso, ref;