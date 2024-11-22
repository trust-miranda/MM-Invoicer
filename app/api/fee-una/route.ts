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

        WITH TODOS AS (
            SELECT pc.*, cl.nome as nomesinistrado, en.nomeExterno as nomeExterno, pes.estadoSinistro as estadoSinistro, pec.estadoClinico as estadoClinico
            FROM processoclinico pc WITH (NOLOCK)
            LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON pc.idProcessoEstadoSinistro=pes.idProcessoEstadoSinistro
            LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON pc.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
            LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idCliente = cl.idCliente
            LEFT JOIN entidade en WITH (NOLOCK) ON pc.idEntidadeSeguradora=en.idEntidade
            LEFT JOIN estabelecimentos est WITH (NOLOCK) ON pc.idEstabelecimento = est.idEstabelecimento
            WHERE pc.idProcesso IN ('528360',
            '544105',
            '545753',
            '545976',
            '545977',
            '545979',
            '546950',
            '547214',
            '547403',
            '547613',
            '547889',
            '548163',
            '548166',
            '548438',
            '548441',
            '549406',
            '549890',
            '549893',
            '550112',
            '550116',
            '551151',
            '551832',
            '333816',
            '347002',
            '356113',
            '356905',
            '357808',
            '358994',
            '359071',
            '379606',
            '386804',
            '405149',
            '409108',
            '415912',
            '422335',
            '424451',
            '424522',
            '542251',
            '543206',
            '544779',
            '545665',
            '547510',
            '547616',
            '547683',
            '547686',
            '548700',
            '549475',
            '551831',
            '420338',
            '548958')),
            
            GROUPED AS (
            SELECT * FROM TODOS),
            
            RECORDS AS
            (
            SELECT *
            FROM GROUPED
            ),
            
            Headers AS 
            (SELECT NEWID() as id,
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
            
            ResultLinhas AS (
            SELECT 
            RECORDS.idProcesso as idProcesso,
            '' as idLinha,
            '01.00.01.10' as ref,
            'Avaliação Clínica' as descricao,
            '1' as qtt,
            '15' as valorunit,
            '' as idrequisicao,
            '' as idrequisicaoactomedico,
            '1723849200' as datafinal,
            '1718665200' as dataopen,
            'nao' as texto,
            null as idavenca
            FROM RECORDS
            ),
            
            PREINVOICE AS
            (
            SELECT h.*, l.idLinha, l.ref, l.descricao, l.qtt, valorunit, 
            l.idrequisicao, l.idrequisicaoactomedico, l.datafinal, l.dataopen, l.texto, l.idavenca
            FROM Headers h, ResultLinhas l, RECORDS t
            WHERE h.idprocesso=l.idProcesso 
            AND t.idProcesso=h.idprocesso
            AND t.idProcesso=l.idProcesso
            AND NOT EXISTS (SELECT prv.idProcesso FROM processoRegistoVendas prv WHERE prv.idProcesso=t.idProcesso)
            AND NOT EXISTS (SELECT prv.idProcesso FROM vendasMMInvoicer prv WHERE prv.idProcesso=t.idProcesso))
            
            SELECT * FROM PREINVOICE
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
