import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { taskSchema } from "./data/schema";

export const metadata: Metadata = {
  title: "Alterações a Contratos",
  description: "Lista de atos médicos com PC superior ao PV",
};

const nameMapping: Record<string, string> = {
  "VICTORIA Seguros SA": "Victoria",
  "Zurich Insurance Europe AG, Sucursal em Portugal": "Zurich",
  "Generali Seguros y Reaseguros, S.A. – Sucursal em PT": "Generali",
  "AGEAS PORTUGAL - COMPANHIA SEGUROS SA": "AGEAS",
  "Aon Portugal, S.A.": "AON",
  "CREDITO AGRICOLA SEGUROS - COMPANHIA DE SEGUROS DE RAMO": "CA Seguros",
  "JERONIMO MARTINS SGPS S A": "Grupo JM",
  "UNA Seguros": "UNA",
  "COMPANHIA DE SEGUROS ALLIANZ PORTUGAL, S.A.": "Allianz",
};

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/files/data.json")
  );

  const tasksObject = JSON.parse(data.toString());
  const tasks = Object.values(tasksObject);

  console.log("Tasks data:", tasks);

  if (!Array.isArray(tasks)) {
    throw new Error("Tasks data is not an array");
  }

  const tasksWithDefaults = tasks.map((task: any) => ({
    id: task.id || "",
    status: task.status || "Por Tratar",
    label: task.label || "", // Ensure label is a string, fallback to ""
    priority: task.priority || "Baixa",
    nrDossier: task.nrDossier || 0,
    Cliente: nameMapping[task.Cliente] || task.Cliente || "",
    nomeFornecedor: task.nomeFornecedor || "",
    ref: task.ref || "",
    Descricao: task.Descricao || "",
    precoCompra: task.precoCompra || 0,
    precoVendaCliente: task.precoVendaCliente || 0,
    ValorExcecao: task.ValorExcecao || 0,
    UltimaAtualizacao: task.UltimaAtualizacao
      ? new Date(task.UltimaAtualizacao)
      : new Date(),
    precoCompraAnterior:
      task.precoCompraAnterior !== null ? task.precoCompraAnterior : 0,
    bistamp: task.bistamp || "",
  }));

  return z.array(taskSchema).parse(tasksWithDefaults);
}

export default async function TaskPage() {
  const tasks = await getTasks();

  return (
    <section className="pedidos p-4 font-sans">
      <div className="flex h-full text-xs">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Alterações a Contratos
              </h2>
              <p className="text-muted-foreground text-12">
                Lista de atos médicos com PC {">"} PV.
              </p>
            </div>
          </div>
          <Card className="bg-white p-4 flex-grow overflow-x-hidden">
            <DataTable data={tasks} columns={columns} />
          </Card>
        </div>
      </div>
    </section>
  );
}
