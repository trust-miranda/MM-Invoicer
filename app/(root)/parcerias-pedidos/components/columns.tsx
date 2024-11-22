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
  {
    accessorKey: "Nº Pedido",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="#" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[10px] text-[0px] truncate">
        {row.getValue("Nº Pedido")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Estado do Pedido",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }: { row: Row<Task> }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("Estado do Pedido")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center truncate">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
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
    accessorKey: "Nível de Urgência",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Urgência" />
    ),
    cell: ({ row }: { row: Row<Task> }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("Nível de Urgência")
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center truncate">
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
    accessorKey: "Nº Processo TRUST",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Nº Processo" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[80px] truncate">
        {row.getValue("Nº Processo TRUST")}
      </div>
    ),
  },
  {
    accessorKey: "Seguradora",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Seguradora" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[200px] truncate">{row.getValue("Seguradora")}</div>
    ),
  },
  {
    accessorKey: "Prestador",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Prestador" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[200px] truncate">{row.getValue("Prestador")}</div>
    ),
  },
  {
    accessorKey: "Código Ato Médico",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[80px] truncate">
        {row.getValue("Código Ato Médico")}
      </div>
    ),
  },
  {
    accessorKey: "Descrição",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[200px] truncate">{row.getValue("Descrição")}</div>
    ),
  },
  {
    accessorKey: "Tipo de Pedido",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Tipo Pedido" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[80px] truncate">{row.getValue("Tipo de Pedido")}</div>
    ),
  },
  {
    accessorKey: "Data Prevista para Realização",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Data Marcação" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[120px] truncate">
        {new Date(
          row.getValue("Data Prevista para Realização")
        ).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "Data de Criação",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Data Criação" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[120px] truncate">
        {new Date(row.getValue("Data de Criação")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "Data de Conclusão",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Data Conclusão" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[120px] truncate">
        {new Date(row.getValue("Data de Conclusão")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "SLA",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="SLA" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[80px] truncate">{row.getValue("SLA")}</div>
    ),
  },
  {
    accessorKey: "Anexos",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Anexos" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[80px] truncate">{row.getValue("Anexos")}</div>
    ),
  },
  {
    accessorKey: "Observações",
    header: ({ column }: { column: Column<Task, unknown> }) => (
      <DataTableColumnHeader column={column} title="Observações" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-[80px] truncate">{row.getValue("Observações")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Task> }) => <DataTableRowActions row={row} />,
  },
];
