"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "./badge";
import { Task } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusVariant =
        {
          "Por Tratar": "portratar",
          "Em Progresso": "emprogresso",
          Concluido: "concluido",
          Cancelado: "cancelado",
          Backlog: "backlog",
        }[status] || "portratar";

      return <Badge variant={statusVariant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return <span>{priority}</span>;
    },
  },
  {
    accessorKey: "nrDossier",
    header: "Nº Contrato",
    cell: ({ row }) => <span>{row.getValue("nrDossier")}</span>,
  },
  {
    accessorKey: "Cliente",
    header: "Cliente",
    cell: ({ row }) => <span>{row.getValue("Cliente")}</span>,
  },
  {
    accessorKey: "nomeFornecedor",
    header: "Fornecedor",
    cell: ({ row }) => <span>{row.getValue("nomeFornecedor")}</span>,
  },
  {
    accessorKey: "ref",
    header: "Referência",
    cell: ({ row }) => <span>{row.getValue("ref")}</span>,
  },
  {
    accessorKey: "Descricao",
    header: "Descrição",
    cell: ({ row }) => <span>{row.getValue("Descricao")}</span>,
  },
  {
    accessorKey: "precoCompra",
    header: "PC",
    cell: ({ row }) => <span>{row.getValue("precoCompra")}</span>,
  },
  {
    accessorKey: "precoCompraAnterior",
    header: "PC Anterior",
    cell: ({ row }) => <span>{row.getValue("precoCompraAnterior")}</span>,
  },
  {
    accessorKey: "precoVendaCliente",
    header: "PV",
    cell: ({ row }) => <span>{row.getValue("precoVendaCliente")}</span>,
  },
  {
    accessorKey: "ValorExcecao",
    header: "PV Excecao",
    cell: ({ row }) => <span>{row.getValue("ValorExcecao")}</span>,
  },
  {
    accessorKey: "UltimaAtualizacao",
    header: "Última Atualização",
    cell: ({ row }) => (
      <span>{row.getValue("UltimaAtualizacao").toLocaleString()}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Task> }) => <DataTableRowActions row={row} />,
  },
];
