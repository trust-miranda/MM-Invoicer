"use client";

import "./styles.css";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Skeleton } from "@/components/ui/skeleton";

// Define the interface for the new data
interface SupplierData {
  flstamp: string; // Primary key
  inactivo: boolean;
  nome2: string;
  no: number;
  estab: number;
  u_tipifica: string;
  morada: string;
  local: string;
  u_distrito: string;
  u_grupo: string;
  u_catprest: string;
  telefone: string;
  c3email: string;
  u_tele2: string;
  u_email2: string;
  c2tele: string;
  c2email: string;
  u_c1tele2: string;
  u_c1email2: string;
  c3tele: string;
  u_email3: string;
  u_c1tele3: string;
  u_c1email3: string;
  u_tele3: string;
  email: string;
  u_c2tele2: string;
  u_c2email2: string;
  u_c2tele3: string;
  u_c2email3: string;
  u_urgd: boolean;
  u_urgc: boolean;
  u_ambd: boolean;
  u_ambc: boolean;
  u_circ: boolean;
  u_cird: boolean;
  u_internd: boolean;
  u_internc: boolean;
  u_mfrd: boolean;
  u_mfrc: boolean;
  u_rxd: boolean;
  u_rxc: boolean;
  u_ecod: boolean;
  u_ecoc: boolean;
  u_tacd: boolean;
  u_tacc: boolean;
  u_rmnd: boolean;
  u_rmnc: boolean;
  u_dentd: boolean;
  u_dentc: boolean;
  u_segundai: string;
  u_segundaf: string;
  u_tercai: string;
  u_tercaf: string;
  u_quartai: string;
  u_quartaf: string;
  u_quintai: string;
  u_quintaf: string;
  u_sextai: string;
  u_sextaf: string;
  u_sabadoi: string;
  u_sabadof: string;
  u_domingoi: string;
  u_domingof: string;
}

// Format a date string for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SupplierPage() {
  const [data, setData] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>(""); // Track the sorted column
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Track sorting direction
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 10; // Number of rows to display per page

  useEffect(() => {
    // Simulating data fetching
    console.log("Fetching data..."); // Debugging log

    setLoading(true); // Set loading to true while fetching
    // Fetch data from the new API endpoint
    fetch("../api/datanet")
      .then((response) => response.json())
      .then((data: SupplierData[]) => {
        console.log("Data fetched:", data); // Debugging log to check if data is received
        setData(data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  // Search and filter the data based on user input
  const filteredData = data.filter(
    (item) =>
      item.nome2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.u_catprest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.u_tipifica.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.u_grupo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.u_distrito.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.telefone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sorting
  const handleSort = (column: keyof SupplierData) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return (
        <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
      );
    }
    return null;
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Render the skeleton while loading
  if (loading) {
    console.log("Loading state triggered..."); // Debugging log

    // Render the skeletons during loading
    return (
      <div className="container text-xs text-nowrap p-4 w-full">
        <Card className="relative bg-white flex-1 display-flex items-center justify-center my-2 mx-2 md:mx-4 md:my-4 overflow-x-hidden">
          <header className="border-b-[1px] border-b-gray-200 text-primary-foreground py-2 px-2 md:px-4 md:py-4">
            <div className="container w-[100%] flex items-center justify-between">
              <h1 className="text-xl font-bold">Informações de Parceiros</h1>
              <div className="relative ml-auto"></div>
            </div>
          </header>
          <main className="flex-1 py-4 px-2 md:px-3 flex items-center justify-center">
            <div className="overflow-x-auto">
              <table className="w-full table-auto mt-5">
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center align-middle space-x-4">
                        {Array.from({ length: 1 }).map((_, index) => (
                          <div
                            key={index}
                            className="items-center align-middle flex flex-col p-4 gap-4 space-y-3"
                          >
                            <Skeleton className="items-center h-[300px] w-full p-4 rounded-xl" />
                            <div className="items-center space-y-2">
                              <Skeleton className="items-center h-8 w-[500px]" />
                              <Skeleton className="items-center h-8 w-[500px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </Card>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container text-xs text-nowrap p-4 w-full">
      <Card className="relative bg-white flex-1 display-flex items-center justify-center my-2 mx-2 md:mx-4 md:my-4 overflow-x-hidden">
        <header className="border-b-[1px] border-b-gray-200 text-primary-foreground py-2 px-2 md:px-4 md:py-4">
          <div className="container w-[100%] flex items-center justify-between">
            <h1 className="text-xl font-bold">Informações de Fornecedores</h1>
            <div className="relative ml-auto"></div>
          </div>
        </header>
        <main className="flex-1 py-4 px-2 md:px-3">
          <div className="mb-4 flex items-center space-x-4">
            <label htmlFor="search" className="text-xs font-semibold">
              Procurar:
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border rounded p-2 w-[40%]"
              placeholder="Procurar por Nome, Tipificação, Grupo, Distrito ou Contactos"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto mt-5">
              <thead>
                <tr className="bg-gray-100 text-muted-foreground">
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("nome2")}
                  >
                    Nome
                    {renderSortIcon("nome2")}
                  </th>
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("u_catprest")}
                  >
                    Categoria
                    {renderSortIcon("u_catprest")}
                  </th>
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("u_tipifica")}
                  >
                    Tipificação
                    {renderSortIcon("u_tipifica")}
                  </th>
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("u_grupo")}
                  >
                    Grupo
                    {renderSortIcon("u_grupo")}
                  </th>
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("u_distrito")}
                  >
                    Distrito
                    {renderSortIcon("u_distrito")}
                  </th>
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("telefone")}
                  >
                    Telefone
                    {renderSortIcon("telefone")}
                  </th>
                  <th
                    className="px-2 py-1 text-xs text-left cursor-pointer"
                    onClick={() => handleSort("c3email")}
                  >
                    Email
                    {renderSortIcon("c3email")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item) => (
                  <tr key={item.flstamp} className="border-b hover:bg-gray-100">
                    <td className="px-2 py-1 text-xs">{item.nome2}</td>
                    <td className="px-2 py-1 text-xs">{item.u_catprest}</td>
                    <td className="px-2 py-1 text-xs">{item.u_tipifica}</td>
                    <td className="px-2 py-1 text-xs">{item.u_grupo}</td>
                    <td className="px-2 py-1 text-xs">{item.u_distrito}</td>
                    <td className="px-2 py-1 text-xs">{item.telefone}</td>
                    <td className="px-2 py-1 text-xs">{item.c3email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded"
            >
              Anterior
            </button>
            <span className="px-4">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded"
            >
              Próxima
            </button>
          </div>
        </main>
      </Card>
    </div>
  );
}
