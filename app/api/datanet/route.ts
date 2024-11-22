import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@internal/prisma-phc/client";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
const db_Phc = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const records = await db_Phc.fl.findMany({
      distinct: ["nome2"],
      where: {
        nome2: { not: "" },
        tipo: "Prestador de Rede",
        inactivo: false,
      },
      select: {
        nome2: true,
        no: true,
        estab: true,
        tipo: true,
        u_tipifica: true,
        inactivo: true,
        morada: true,
        local: true,
        u_distrito: true,
        u_grupo: true,
        u_catprest: true,
        telefone: true,
        c3email: true,
        u_tele2: true,
        u_email2: true,
        c2tele: true,
        c2email: true,
        u_c1tele2: true,
        u_c1email2: true,
        c3tele: true,
        u_email3: true,
        u_c1tele3: true,
        u_c1email3: true,
        u_tele3: true,
        email: true,
        u_c2tele2: true,
        u_c2email2: true,
        u_c2tele3: true,
        u_c2email3: true,
        u_urgd: true,
        u_urgc: true,
        u_ambd: true,
        u_ambc: true,
        u_circ: true,
        u_cird: true,
        u_internd: true,
        u_internc: true,
        u_mfrd: true,
        u_mfrc: true,
        u_rxd: true,
        u_rxc: true,
        u_ecod: true,
        u_ecoc: true,
        u_tacd: true,
        u_tacc: true,
        u_rmnd: true,
        u_rmnc: true,
        u_dentd: true,
        u_dentc: true,
        u_segundai: true,
        u_segundaf: true,
        u_tercai: true,
        u_tercaf: true,
        u_quartai: true,
        u_quartaf: true,
        u_quintai: true,
        u_quintaf: true,
        u_sextai: true,
        u_sextaf: true,
        u_sabadoi: true,
        u_sabadof: true,
        u_domingoi: true,
        u_domingof: true,
        flstamp: true,
      },
      orderBy: {
        nome2: "asc",
      },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
