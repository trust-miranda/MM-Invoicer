import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { DataTable } from "./components/data-table";
import TaskDataTable from "./components/task-data-table";
import { taskSchema } from "./data/schema";

export const metadata: Metadata = {
  title: "Alterações a Contratos",
  description: "Lista de atos médicos com PC superior ao PV",
};

// Function to process and fetch task data
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/files/data.json")
  );
  const tasksObject = JSON.parse(data.toString());
  const tasks = Object.values(tasksObject);

  // Transform tasks to match schema expectations
  const tasksWithDefaults = tasks.map((task: any) => ({
    id: task.id || "",
    status: task.status || "Por Tratar", // Default if missing
    label: task.label || "General", // Default label if missing
    priority: task.priority || "Baixa", // Default priority if missing
    nrDossier: task.nrDossier || 0,
    Cliente: task.Cliente || "",
    nomeFornecedor: task.nomeFornecedor || "",
    ref: task.ref || "",
    Descricao: task.Descricao || "",
    precoCompra: task.precoCompra || 0,
    precoVendaCliente: task.precoVendaCliente || 0,
    ValorExcecao: task.ValorExcecao || 0,
    UltimaAtualizacao: task.UltimaAtualizacao
      ? new Date(task.UltimaAtualizacao)
      : new Date(), // Parse as Date
    precoCompraAnterior: task.precoCompraAnterior || 0,
    bistamp: task.bistamp || "",
  }));

  // Validate data against taskSchema
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
            <TaskDataTable initialTasks={tasks} />
          </Card>
        </div>
      </div>
    </section>
  );
}
