"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu";
import AddRecordPopover from "@/components/ui/addRecordPopover";

// Ensure AddRecordPopover is correctly typed and imported

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewForm<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  if (!table) {
    throw new Error("Table is required");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Formulário</DropdownMenuLabel>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
