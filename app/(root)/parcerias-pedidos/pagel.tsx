"use client";
import { UserNav } from "./components/user-nav";
import { Card } from "@/components/ui/card";
import { DataTable } from "./components/data-table";
import { z } from "zod";
import { columns } from "./components/columns";
import { useEffect, useState } from "react";

const taskSchema = z.object({
  "Nº Pedido": z.string(),
  "Nº Processo TRUST": z.string(),
  "Código Ato Médico": z.string(),
  "Nível de Urgência": z.string(),
  Anexos: z.string(),
  Observações: z.string(),
  "Data Prevista para Realização": z.string(),
  "Tipo de Pedido": z.string(),
  Seguradora: z.string(),
  Prestador: z.string(),
  Descrição: z.string(),
  "Estado do Pedido": z.string(),
  "Data de Conclusão": z.string(),
  "Data de Criação": z.string(),
});

export default function ParceriasPedidos() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/app/api/pedidos/route");
        if (response.ok) {
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            // Process the JSON data
          } else {
            // Handle non-JSON responses (e.g., HTML)
            console.error("Received non-JSON response:", response);
          }
        } else {
          // Handle errors
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="pedidos p-4">
      <div className="flex h-full">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                PARCERIAS - PEDIDOS
              </h2>
              <p className="text-muted-foreground text-12">
                Lista de pedidos de parcerias.
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
