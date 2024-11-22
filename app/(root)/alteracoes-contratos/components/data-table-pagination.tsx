import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import axios from "axios";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { RefreshCcw } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface DataWithUpdate {
  UltimaAtualizacao: string;
}

interface DataTablePaginationProps<TData extends DataWithUpdate> {
  table: Table<TData>;
  onRefresh: () => void;
}

export function DataTablePagination<TData extends DataWithUpdate>({
  table,
  onRefresh,
}: DataTablePaginationProps<TData>) {
  const mostRecentUpdate = useMemo(() => {
    const rows = table.getFilteredRowModel().rows;
    if (rows.length === 0) return null;

    const mostRecent = rows.reduce((latest, row) => {
      const currentUpdate = row.original.UltimaAtualizacao;
      return currentUpdate > latest ? currentUpdate : latest;
    }, rows[0].original.UltimaAtualizacao);

    return mostRecent;
  }, [table]);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Retrieve the last update time from local storage when the component mounts
    const storedLastUpdate = localStorage.getItem("lastUpdate");
    if (storedLastUpdate) {
      setLastUpdated(storedLastUpdate);
    }
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await axios.get("/api/run-python");
      const currentTime = new Date().toLocaleString();
      setLastUpdated(currentTime);
      localStorage.setItem("lastUpdate", currentTime);
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error executing script:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-xs text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} registo(s) selecionado(s).
      </div>
      <div className="flex-1 text-xs flex items-center text-muted-foreground">
        <RefreshCcw
          className={`cursor-pointer mr-4 w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          onClick={handleRefresh}
        />
        {mostRecentUpdate ? (
          <span>
            Última Atualização em {lastUpdated ? lastUpdated : "N/A"}.
          </span>
        ) : (
          <span>Sem atualizações recentes.</span>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium">Registos por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} -{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Início</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Página Anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Próxima Página</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Fim</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
