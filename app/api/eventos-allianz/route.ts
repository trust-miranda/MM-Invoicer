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
WITH DATASET AS (
        SELECT 
            newid() as id, 
            1 as idlinha, 
            '01.00.01.10' as ref, 
            'Avaliacao Clinica' as descricao, 
            1 as qtt, 
            21 as valorunit, 
            '' as idrequisicao, 
            '' as u_facturatmpstamp, 
            '' as datafinal, 
            '' as dataopen, 
            '' as bistamp, 
            '' as idavenca, 
			pc.idRamo,
			pc.ePensionista,
			pc.dataAdmissao,
			pc.dataAlta,
            pc.idprocesso as idprocesso, 
            pc.identidadeseguradora, 
            pc.numprocseguradora, 
            pc.numApolice, 
            cl.nome as nomesinistrado,
			pec.estadoclinico, 
			pes.estadoSinistro
        FROM processoclinico pc WITH (NOLOCK)
		LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idCliente=cl.idCliente
        LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON pc.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
		LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON pc.idProcessoEstadoSinistro=pes.idProcessoEstadoSinistro
		WHERE pc.idprocessoestadoclinico=3
            AND pc.idprocessoestadosinistro=2
            AND pc.identidadeseguradora=32493
            AND (
                pc.processoadministrativo=0 
                OR pc.processoadministrativo IS NULL 
                OR pc.processoadministrativo LIKE ''
            )
            ),

    FINAL AS (
        SELECT 
            DATASET.*, 
            (SELECT top 1 1 
            FROM PHC..ft 
            WHERE
                ft.anulado=0 
                AND ft.ndoc='74' 
                AND ft.tipodoc='1' 
                AND CAST(DATASET.idprocesso as varchar)=LTRIM(RTRIM(ft.u_sinistro))) Faturado
            FROM DATASET
    ),

Headers AS (
SELECT NEWID() as id,
FINAL.identidadeseguradora as identidade,
'COMPANHIA DE SEGUROS ALLIANZ PORTUGAL, S.A.' as seguradora,
FINAL.nomesinistrado as nomesinistrado,
FINAL.idRamo as idRamo,
FINAL.estadoSinistro as estadoSinistro,
FINAL.estadoClinico as estadoClinico,
FINAL.ePensionista as pensionista,
FINAL.dataAdmissao as dataadmissao,
FINAL.dataAlta as dataalta,
FINAL.idprocesso as idprocesso,
FINAL.numApolice as numapolice,
FINAL.numProcSeguradora as numprocseguradora
FROM FINAL
),

ResultLinhas as (
		SELECT 
		FINAL.idprocesso as idProcesso,
		'' as idLinha, 
        FINAL.ref, 
        FINAL.descricao, 
        FINAL.qtt, 
        FINAL.valorunit, 
        FINAL.idrequisicao, 
        FINAL.u_facturatmpstamp, 
        FINAL.datafinal, 
        FINAL.dataopen, 
        FINAL.bistamp, 
        FINAL.idavenca
    FROM FINAL 
    WHERE FINAL.Faturado IS NULL),

	PREINVOICE AS (
SELECT h.*, l.idLinha, l.ref, l.descricao, l.qtt, l.valorunit, l.idrequisicao, l.u_facturatmpstamp, l.datafinal, l.dataopen, l.bistamp, l.idavenca
	FROM Headers h, ResultLinhas l, FINAL f
	WHERE h.idprocesso=l.idProcesso 
	AND f.idProcesso=h.idprocesso
	AND f.idProcesso=l.idProcesso
	AND NOT EXISTS (SELECT prv.idProcesso FROM processoRegistoVendas prv WHERE prv.idProcesso=f.idProcesso)
	AND NOT EXISTS (SELECT prv.idProcesso FROM vendasMMInvoicer prv WHERE prv.idProcesso=f.idProcesso))

	SELECT * FROM PREINVOICE
	WHERE valorunit>'0'
	AND numprocseguradora>''
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
