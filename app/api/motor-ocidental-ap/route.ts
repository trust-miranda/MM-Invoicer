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
WHERE pc.idprocesso IN ('545056',
'545927',
'546536',
'547603',
'547624',
'548105',
'548120')),

ResultLinhas AS (
SELECT 
LTRIM(RTRIM(u.nutente)) as idProcesso,
'' as idLinha,
u.ref as ref,
u.design as descricao,
u.qtt as qtt,
u.valor as valorunit,
bi.lobs2 as idrequisicao,
'' as idrequisicaoactomedico,
'1723849200' as datafinal,
'1718665200' as dataopen,
'nao' as texto,
null as idavenca
FROM PHC..u_facturatmp u WITH (NOLOCK)
LEFT JOIN PHC..bi (NOLOCK) ON u.stampo = bi.bistamp
WHERE u.u_facturatmpstamp IN ('DR24102153294,6370000-1',
'MA24102161610,463000263',
'MA24102161610,463000267',
'DR24102153295,0290000-1',
'DR24102153295,5210000-1',
'MA24102161610,463000275',
'MA24102161610,463000278',
'DR24102153293,9890000-1',
'MA24102161610,463000279',
'MA24102161610,463000280',
'DR24102153295,3940000-1'))

SELECT h.*, l.idLinha, l.ref, l.descricao, l.qtt, l.valorunit, l.idrequisicao, l.idrequisicaoactomedico, l.datafinal, l.dataopen, l.texto, l.idavenca
FROM Headers h, ResultLinhas l
WHERE h.idprocesso=l.idProcesso 
AND l.valorunit > 0
AND h.numprocseguradora > ''
ORDER BY h.idprocesso, l.ref;
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
        idrequisicaoactomedico: row.idrequisicaoactomedico
          ? row.idrequisicaoactomedico.toString().trim()
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
