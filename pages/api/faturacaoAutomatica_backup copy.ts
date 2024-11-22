import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API route hit");
  if (req.method === "GET") {
    try {
      console.log("Handling GET request");

      interface Filter {
        value: string;
        operator: string;
      }

      const filters: { [key: string]: Filter } = JSON.parse(
        req.query.filters as string
      );

      console.log("Filters:", filters);

      const whereClause: any = {
        processoFaturado: 0,
        numProcSeguradora: {
          not: "",
        },
      };

      for (const [key, filter] of Object.entries(filters)) {
        const { value, operator } = filter;

        if (value && value !== "") {
          const parsedValue = isNaN(Number(value)) ? value : Number(value);

          switch (operator) {
            case "=":
              whereClause[key] = parsedValue;
              break;
            case ">":
              whereClause[key] = { gt: parsedValue };
              break;
            case "<":
              whereClause[key] = { lt: parsedValue };
              break;
            case ">=":
              whereClause[key] = { gte: parsedValue };
              break;
            case "<=":
              whereClause[key] = { lte: parsedValue };
              break;
            case "!=":
              whereClause[key] = { not: parsedValue };
              break;
            case "contains":
              if (key === "idEstabelecimento") {
                whereClause[key] = {
                  in: value.split(",").map(Number),
                };
              } else {
                whereClause[key] = { contains: parsedValue };
              }
              break;
            case "not_contains":
              whereClause[key] = { NOT: { contains: parsedValue } };
              break;
            case "starts_with":
              whereClause[key] = { startsWith: parsedValue };
              break;
            case "ends_with":
              whereClause[key] = { endsWith: parsedValue };
              break;
            default:
              throw new Error(`Unsupported operator: ${operator}`);
          }
        }
      }

      const records = await prisma.preDataset.findMany({
        where: whereClause,
        select: {
          idProcesso: true,
          numProcSeguradora: true,
          tipoProcesso: true,
          dataAdmissao: true,
          dataAcidente: true,
          idRamo: true,
          numApolice: true,
          idProcessoEstadoClinico: true,
          idProcessoEstadoSinistro: true,
          nomeSinistrado: true,
          dataPrimeiraConsulta: true,
          dataAlta: true,
          dataUltimaConsulta: true,
          idEntidadeSeguradora: true,
        },
      });

      const processoEstadoClinicoIds = records.map(
        (record) => record.idProcessoEstadoClinico
      );
      const processoEstadoSinistroIds = records.map(
        (record) => record.idProcessoEstadoSinistro
      );
      const entidadeIds = records.map((record) => record.idEntidadeSeguradora);

      const validProcessoEstadoClinicoIds = processoEstadoClinicoIds.filter(
        (id) => id !== null
      );
      const processoEstadoClinicoRecords =
        await prisma.processoEstadoClinico.findMany({
          where: {
            idProcessoEstadoClinico: { in: validProcessoEstadoClinicoIds },
          },
          select: { idProcessoEstadoClinico: true, estadoClinico: true },
        });

      const validProcessoEstadoSinistroIds = processoEstadoSinistroIds.filter(
        (id) => id !== null
      );
      const processoEstadoSinistroRecords =
        await prisma.processoEstadoSinistro.findMany({
          where: {
            idProcessoEstadoSinistro: { in: validProcessoEstadoSinistroIds },
          },
          select: { idProcessoEstadoSinistro: true, estadoSinistro: true },
        });

      const validEntidadeIds = entidadeIds.filter((id) => id !== null);
      const entidadeRecords = await prisma.entidade.findMany({
        where: { idEntidade: { in: validEntidadeIds } },
        select: { idEntidade: true, nomeInterno: true, nomeExterno: true },
      });

      const combinedRecords = records.map((record) => {
        const processoEstadoClinico = processoEstadoClinicoRecords.find(
          (item) =>
            item.idProcessoEstadoClinico === record.idProcessoEstadoClinico
        );
        const processoEstadoSinistro = processoEstadoSinistroRecords.find(
          (item) =>
            item.idProcessoEstadoSinistro === record.idProcessoEstadoSinistro
        );
        const entidade = entidadeRecords.find(
          (item) => item.idEntidade === record.idEntidadeSeguradora
        );

        return {
          ...record,
          processoEstadoClinico: processoEstadoClinico
            ? processoEstadoClinico.estadoClinico
            : null,
          processoEstadoSinistro: processoEstadoSinistro
            ? processoEstadoSinistro.estadoSinistro
            : null,
          entidade: entidade
            ? {
                nomeInterno: entidade.nomeInterno,
                nomeExterno: entidade.nomeExterno,
              }
            : null,
        };
      });

      console.log("Combined Records fetched:", combinedRecords);

      const filteredRecords = combinedRecords.filter((record) => {
        const dateDiff =
          record.dataUltimaConsulta && record.dataPrimeiraConsulta
            ? (new Date(record.dataUltimaConsulta).getTime() -
                new Date(record.dataPrimeiraConsulta).getTime()) /
              (1000 * 3600 * 24)
            : 0;

        return dateDiff <= 60;
      });

      const recordsWithStringifiedBigInt = combinedRecords.map(
        (record: any) => {
          return Object.fromEntries(
            Object.entries(record).map(([key, value]) => {
              if (typeof value === "bigint") {
                return [key, value.toString()];
              } else if (key.includes("data") && value) {
                const date = new Date(value as string | Date);
                return [key, isNaN(date.getTime()) ? null : date.toISOString()];
              } else {
                return [key, value];
              }
            })
          );
        }
      );

      const filePath = path.join(process.cwd(), "data.json");
      fs.writeFileSync(
        filePath,
        JSON.stringify(recordsWithStringifiedBigInt, null, 2)
      );

      res.status(200).json(recordsWithStringifiedBigInt);
    } catch (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error connecting to database");
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
