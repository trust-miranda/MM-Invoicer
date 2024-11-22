import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { taskSchema } from "./data/schema";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Alterações a Contratos",
  description: "Uma lista de tarefas construída com TanStack.",
};

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/files/pedidos.json")
  );

  const tasksObject = JSON.parse(data.toString());
  console.log("Raw tasks data:", tasksObject);

  // Access the records array
  const tasksArray = tasksObject.records || tasksObject; // Adjust this line based on the actual structure
  if (!Array.isArray(tasksArray)) {
    console.error("Tasks data is not an array:", tasksArray);
    throw new Error("Tasks data is not an array");
  }

  const tasksWithDefaults = tasksArray.map((task: any) => {
    const fields = task.fields || {};
    return {
      "Nº Pedido": fields["Nº Pedido"] || "",
      "Estado do Pedido": fields["Estado do Pedido"] || "Por Tratar",
      "Nível de Urgência": fields["Nível de Urgência"] || "Pouco Urgente",
      "Nº Processo TRUST": fields["Nº Processo TRUST"] || "",
      Seguradora: fields["Seguradora"] || "",
      Prestador: fields["Prestador"] || "",
      "Código Ato Médico": fields["Código Ato Médico"] || "",
      Descrição: fields["Descrição"] || "",
      "Tipo de Pedido": fields["Tipo de Pedido"] || "Ato Médico",
      "Data Prevista para Realização": isValidDate(
        fields["Data Prevista para Realização"]
      )
        ? new Date(fields["Data Prevista para Realização"]).toISOString()
        : "",
      Anexos: Array.isArray(fields["Anexos"])
        ? fields["Anexos"].join(", ")
        : fields["Anexos"] || "",
      Observações: fields["Observações"] || "",
      "Data de Conclusão": isValidDate(fields["Data de Conclusão"])
        ? new Date(fields["Data de Conclusão"]).toISOString()
        : "",
      "Data de Criação": isValidDate(fields["Data de Criação"])
        ? new Date(fields["Data de Criação"]).toISOString()
        : "",
      SLA: fields["SLA"] ? String(fields["SLA"]) : "",
    };
  });

  console.log("Tasks with defaults:", tasksWithDefaults);

  return z.array(taskSchema).parse(tasksWithDefaults);
}

// Helper function to check if a date string is valid
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export default async function TaskPage() {
  const tasks = await getTasks();

  return (
    <section className="pedidos flex min-h-screen w-full flex-col p-4">
      <div className="flex h-full">
        <div className="w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Pedidos de Atos / Médicos
              </h2>
              <p className="text-muted-foreground text-12">
                Lista de pedidos efetuados.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UserNav />
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
