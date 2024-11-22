import { NextResponse } from "next/server";
import sql from "mssql";

const config = {
  server: "192.168.1.240",
  database: "TRUST_GESTAO_CLINICA_PROD",
  user: "5033",
  password: "manel123456",
  options: {
    encrypt: false,
    enableArithAbort: true,
    requestTimeout: 600000,
  },
};

export async function GET() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
WITH Headers AS (       
SELECT NEWID() as id,
pc.identidadeseguradora as identidade,
en.nomeExterno as seguradora,
cl.nome as nomesinistrado,
pc.idRamo as idRamo,
pes.estadoSinistro as estadoSinistro,
pec.estadoClinico as estadoClinico,
pc.ePensionista as pensionista,
pc.dataAdmissao as dataadmissao,
pc.dataalta as dataalta,
pc.idprocesso as idprocesso,
pc.numapolice as numapolice,
pc.numprocseguradora as numprocseguradora
FROM processoClinico pc WITH (NOLOCK)
LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idcliente = cl.idcliente
LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON pc.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON pc.idProcessoEstadoClinico=pes.idProcessoEstadoSinistro
LEFT JOIN entidade en WITH (NOLOCK) ON pc.idEntidadeSeguradora=en.idEntidade
WHERE pc.idEntidadeSeguradora='32204'
AND pc.idProcessoEstadoClinico=3
AND pc.idRamo IN ('AT', 'AV')
AND EXISTS (SELECT LTRIM(RTRIM(u.nutente)) from PHC..u_facturatmp u
WHERE u.facturado='0'
AND (NOT(u.facturado='1' AND u.ref='01.00.01.10'))
AND u.facturar='1'
AND u.valor>'0'
AND u.tipo='ModeloGeral22_252')),

ResultLinhas AS (
SELECT 
LTRIM(RTRIM(u.nutente)) as idProcesso,
'' as idLinha,
u.ref as ref,
u.design as descricao,
u.qtt as qtt,
u.valor as valorunit,
bi.lobs2 as idrequisicao,
u.u_facturatmpstamp as u_facturatmpstamp,
'1723849200' as datafinal,
'1718665200' as dataopen,
bi.bistamp as bistamp,
null as idavenca,
isnull((select isnull(bi.obrano,0) as obrano from PHC..bi bi2 WITH (NOLOCK) LEFT JOIN PHC..bo bo2 WITH (NOLOCK) ON bo2.bostamp=bi2.bostamp  where bi2.bistamp=u.stampo and bo2.ndos=47),0) as NrAp,
bi.u_vendida as ApVendida,
bi.u_isentaft as ApIsenta,
bo.no as nrFornecedor,
bo.estab as nrEstabelecimento,
bo.nome2 as Prestador,
c.idMedico,
u.facturado as linhaFaturada,
u.isentaft as linhaIsenta
FROM PHC..u_facturatmp u WITH (NOLOCK)
LEFT JOIN PHC..bi (NOLOCK) ON LTRIM(RTRIM(u.stampo)) = LTRIM(RTRIM(bi.bistamp))
LEFT JOIN PHC..bo (NOLOCK) ON bi.bostamp=bo.bostamp
LEFT JOIN consulta c WITH (NOLOCK) ON LTRIM(RTRIM(bi.lobs2))=CAST(c.idConsulta as Varchar) 
LEFT JOIN requisicao r WITH (NOLOCK) ON LTRIM(RTRIM(bi.lobs2))=CAST(r.idRequisicao as Varchar) 
LEFT JOIN processoClinico pc WITH (NOLOCK) ON LTRIM(RTRIM(u.nutente))=CAST(pc.idprocesso as varchar)
WHERE u.ref NOT IN ('70.10.00.97','01.00.00.82','38.00.00.00')
AND LEFT(u.ref,1) <> '3'
AND LEFT(u.ref,2) <>'98'
AND (bi.u_vendida=0 OR bi.u_vendida IS NULL)
AND (bi.u_isentaft=0 OR bi.u_isentaft IS NULL)
AND u.facturado='0'
AND (NOT(u.facturado='1' AND u.ref='01.00.01.10'))
AND (NOT(u.isentaft='1' AND u.ref='01.00.01.10'))
AND u.facturar='1'
AND u.valor>'0'
AND u.tipo='ModeloGeral22_252'
AND pc.idEntidadeSeguradora='32204'
AND pc.idProcessoEstadoClinico=3
AND pc.idRamo IN ('AT', 'AV')),

RankedRows AS (
    SELECT 
        h.*, 
        l.idLinha, 
        l.ref, 
		LEFT(l.ref,2) as start_ref,
        l.descricao, 
        l.qtt, 
        l.valorunit,
        l.idrequisicao, 
        l.NrAp, 
        l.bistamp, 
        l.ApVendida, 
        l.ApIsenta, 
		l.nrFornecedor,
		l.nrEstabelecimento,
		l.Prestador,
		l.idMedico,
        l.linhaFaturada, 
        l.linhaIsenta, 
        l.u_facturatmpstamp,  
        l.datafinal, 
        l.dataopen, 
        l.idavenca,
        ROW_NUMBER() OVER (PARTITION BY h.idprocesso, LEFT(l.ref,2) ORDER BY LEFT(l.ref,2) ASC) AS ref_rank
    FROM Headers h
    JOIN ResultLinhas l ON h.idprocesso = l.idProcesso
    WHERE l.valorunit > 0
      AND l.qtt > 0
      AND h.numprocseguradora > ''
)
SELECT 
DISTINCT CAST ((CAST(idprocesso AS varchar) + '_' + ref + '_' + idrequisicao + '_' + bistamp + '_' + CAST(u_facturatmpstamp AS varchar)) as varchar) as chave,
    id, 
    identidade, 
    seguradora, 
    nomesinistrado, 
    idRamo, 
    estadoSinistro, 
    estadoClinico, 
    pensionista, 
    dataadmissao, 
    dataalta, 
    idprocesso, 
    numapolice, 
    numprocseguradora, 
    idLinha, 
    ref, 
	start_ref,
    ref_rank,
    descricao, 
    qtt, 
    CASE 
        WHEN ref_rank = 1 and start_ref='60' THEN 0 
		WHEN ref='01.00.00.81' AND nrFornecedor='32' THEN 0
		WHEN ref='01.00.00.82' THEN 0
		WHEN LEFT(ref,2)='38' THEN 0
		WHEN ref='01.00.00.72' AND idMedico='2384' THEN 0
		WHEN ref='01.00.00.71' AND idMedico='3788' THEN 0
		WHEN ref='01.00.00.81' AND idMedico='1637' THEN 0
		WHEN ref='01.00.01.13' AND idMedico IN ('468', '2146') THEN 25.27
		WHEN ref='70.10.00.97' THEN 0
        ELSE valorunit 
    END AS valorunit,
    idrequisicao, 
	nrFornecedor,
	nrEstabelecimento,
	Prestador,
	idMedico,
    NrAp, 
    bistamp, 
    ApVendida, 
    ApIsenta, 
    linhaFaturada, 
    linhaIsenta, 
    u_facturatmpstamp, 
    datafinal, 
    dataopen, 
    idavenca
FROM RankedRows
ORDER BY idprocesso, ref;
        `);

    // Group by idProcesso and add row index for idLinha
    const groupedResult = result.recordset.reduce((acc, row) => {
      const idProcesso = row.idprocesso ? row.idprocesso.toString().trim() : "";

      if (!acc[idProcesso]) {
        acc[idProcesso] = {
          id: row.id ? row.id.toString().trim() : "",
          identidade: row.identidade ? parseInt(row.identidade, 10) : null,
          seguradora: row.seguradora ? row.seguradora.trim() : "",
          nomesinistrado: row.nomesinistrado
            ? row.nomesinistrado.toString().trim()
            : "",
          idRamo: row.idRamo ? row.idRamo.toString().trim() : "",
          estadoSinistro: row.estadoSinistro
            ? row.estadoSinistro.toString().trim()
            : "",
          estadoClinico: row.estadoClinico
            ? row.estadoClinico.toString().trim()
            : "",
          pensionista: row.pensionista ? row.pensionista.toString().trim() : "",
          dataadmissao: row.dataadmissao
            ? row.dataadmissao.toString().trim()
            : null,
          dataalta: row.dataalta ? row.dataalta.toString().trim() : null,
          idprocesso: idProcesso,
          numapolice: row.numapolice ? row.numapolice.toString().trim() : "",
          numprocseguradora: row.numprocseguradora
            ? row.numprocseguradora.toString().trim()
            : "",
          ResultLinhas: [],
          idLinhaCounter: 1,
        };
      }

      acc[idProcesso].ResultLinhas.push({
        idlinha: acc[idProcesso].idLinhaCounter,
        ref: row.ref ? row.ref.toString().trim() : "",
        descricao: row.descricao ? row.descricao.toString().trim() : "",
        qtt: row.qtt || 0,
        valorunit: row.valorunit ? parseFloat(row.valorunit) : 0,
        idrequisicao: row.idrequisicao
          ? row.idrequisicao.toString().trim()
          : "0",
        bistamp: row.bistamp ? row.bistamp.toString().trim() : "",
        u_facturatmpstamp: row.u_facturatmpstamp
          ? row.u_facturatmpstamp.toString().trim()
          : "",
        datafinal: row.datafinal ? row.datafinal.toString().trim() : "",
        dataopen: row.dataopen ? row.dataopen.toString().trim() : "",
        idavenca: row.idavenca || null,
      });

      acc[idProcesso].idLinhaCounter += 1;

      return acc;
    }, {});

    const formattedResult = Object.values(groupedResult).map(
      ({ idLinhaCounter, ...rest }) => rest
    );

    return NextResponse.json(formattedResult, { status: 200 });
  } catch (err) {
    console.error("Database query error:", err);
    return NextResponse.json(
      { error: "Database query error" },
      { status: 500 }
    );
  }
}
