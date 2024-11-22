"use client";

import { Column, ColumnDef, Row } from "@tanstack/react-table";

import { Badge } from "./badge";
import { Checkbox } from "./checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "bistamp",
  //   header: ({ column }: { column: Column<Task, unknown> }) => (
  //     <DataTableColumnHeader column={column} title="" />
  //   ),
  //   cell: ({ row }: { row: Row<Task> }) => (
  //     <div className="w-[10px] text-[0px]">{row.getValue("bistamp")}</div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "status",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }: { row: Row<Task> }) => {
      const status = row.getValue("status") as string;

      // Map each status to the correct Badge variant
      const statusVariant =
        {
          "Por Tratar": "portratar",
          "Em Progresso": "emprogresso",
          Concluido: "concluido",
          Cancelado: "cancelado",
          Backlog: "backlog",
        }[status] || "portratar";

      return (
        <Badge variant={statusVariant} className="text-nowrap">
          {status}
        </Badge>
      );
    },
    filterFn: (
      row: { getValue: (arg0: any) => any },
      id: any,
      value: string | any[]
    ) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "priority",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }: { row: Row<Task> }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) return null;

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (
      row: { getValue: (arg0: any) => any },
      id: any,
      value: string | any[]
    ) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "nrDossier",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Nº Contrato" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("nrDossier")}</div>
    ),
  },
  {
    accessorKey: "Cliente",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }: { row: Row<Task> }) => <div>{row.getValue("Cliente")}</div>,
  },
  {
    accessorKey: "nomeFornecedor",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("nomeFornecedor")}</div>
    ),
  },
  {
    accessorKey: "ref",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Ref" />
    ),
    cell: ({ row }: { row: Row<Task> }) => <div>{row.getValue("ref")}</div>,
  },
  {
    accessorKey: "Descricao",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Descricao" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("Descricao")}</div>
    ),
  },
  {
    accessorKey: "precoCompra",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="PC" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("precoCompra")}</div>
    ),
  },
  {
    accessorKey: "precoCompraAnterior",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="PC Anterior" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("precoCompraAnterior")}</div>
    ),
  },
  {
    accessorKey: "precoVendaCliente",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="PV" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("precoVendaCliente")}</div>
    ),
  },
  {
    accessorKey: "ValorExcecao",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="PV Excecao" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{row.getValue("ValorExcecao")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Task> }) => <DataTableRowActions row={row} />,
  },
];
