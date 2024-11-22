import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const db_Portal = new PrismaClient();

export async function GET(req: NextRequest) {
  const estado = req.nextUrl.searchParams.get("estado");

  try {
    const result = await db_Portal.$queryRaw`
      SELECT 
        vmmi.fistamp as fistamp,
        vmmi.nrCliente as identidade,
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
        pc.numprocseguradora as numprocseguradora,
        '' as idLinha,
        vmmi.ref as ref,
        vmmi.descricao as descricao,
        vmmi.qtt as qtt,
        vmmi.valorUnit as valorunit,
        vmmi.idRequisicao as idrequisicao,
        '' as idrequisicaoactomedico,
        '1723849200' as datafinal,
        '1718665200' as dataopen,
        'nao' as texto,
        null as idavenca,
        vmmi.estado as Estado
      FROM vendasMMInvoicer vmmi WITH (NOLOCK)
      LEFT JOIN processoClinico pc WITH (NOLOCK) ON vmmi.idprocesso=pc.idProcesso
      LEFT JOIN cliente cl WITH (NOLOCK) ON pc.idcliente = cl.idcliente
      LEFT JOIN processoEstadoClinico pec WITH (NOLOCK) ON pc.idProcessoEstadoClinico=pec.idProcessoEstadoClinico
      LEFT JOIN processoEstadoSinistro pes WITH (NOLOCK) ON pc.idProcessoEstadoClinico=pes.idProcessoEstadoSinistro
      LEFT JOIN entidade en WITH (NOLOCK) ON pc.idEntidadeSeguradora=en.idEntidade
      ORDER BY vmmi.idprocesso, vmmi.ref
    `;

    // Convert BigInt values to strings
    const resultWithBigIntFixed = result.map((row: any) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "bigint" ? value.toString() : value,
        ])
      )
    );

    return NextResponse.json(resultWithBigIntFixed);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}
