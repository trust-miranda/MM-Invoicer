"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "./button";
import { Input } from "./input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses, clients } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewForm } from "./data-table-view-form";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Procurar por Descrição..."
          value={
            (table.getColumn("Descrição")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("Descrição")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("Estado do Pedido") && (
          <DataTableFacetedFilter
            column={table.getColumn("Estado do Pedido")}
            title="Estado"
            options={statuses}
          />
        )}
        {table.getColumn("Nível de Urgência") && (
          <DataTableFacetedFilter
            column={table.getColumn("Nível de Urgência")}
            title="Urgência"
            options={priorities}
          />
        )}
        {table.getColumn("Seguradora") && (
          <DataTableFacetedFilter
            column={table.getColumn("Seguradora")}
            title="Seguradora"
            options={clients}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
