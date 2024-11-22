"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

// Utility function to convert Excel serial dates to JavaScript Date format
function excelDateToJSDate(excelDate: number) {
  const excelEpoch = new Date(1899, 11, 30); // Excel epoch
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000); // Convert to JS date
  return jsDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
}

export default function MotoresFaturacao() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/motores-faturacao");
        const result = await response.json();

        if (response.ok) {
          setExcelData(result.data);
          setLoading(false);
        } else {
          setError(result.error || "Failed to load data");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch data from the server");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return (
        <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
      );
    }
    return null;
  };

  // Filter and sort data based on the search query and sorting
  const filteredData = excelData.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  if (loading) {
    return <p>A carregar...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <Card className="relative bg-white flex-1 display-flex items-center justify-center my-2 mx-2 md:mx-4 md:my-4 overflow-x-hidden">
        <header className="border-b-[1px] border-b-gray-200 text-primary-foreground py-2 px-2 md:px-4 md:py-4">
          <div className="container w-[100%] flex items-center justify-between">
            <h1 className="text-xl font-bold">Tabela de Faturação</h1>
          </div>
        </header>
        <main className="flex-1 py-4 px-2 md:px-3">
          <div className="overflow-x-auto">
            <div className="mb-4 flex items-center space-x-4">
              <label htmlFor="search" className="text-xs font-semibold">
                Procurar:
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="text-xs border rounded p-2 w-[40%]"
                placeholder="Procurar nos dados"
              />
            </div>

            <table className="w-full table-auto mt-5">
              <thead>
                <tr className="bg-gray-100 text-muted-foreground">
                  {Object.keys(excelData[0]).map((key) => (
                    <th
                      key={key}
                      className="px-2 py-1 text-xs text-left cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {key} {renderSortIcon(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-gray-100">
                    {Object.entries(row).map(([key, value], colIndex) => (
                      <td
                        key={colIndex}
                        className="px-2 py-1 text-xs text-left"
                      >
                        {/* Check if the value is a potential date */}
                        {
                          typeof value === "number" &&
                          (key.toLowerCase().includes("data") ||
                            key.toLowerCase().includes("dta"))
                            ? excelDateToJSDate(value) // Convert serial number to date
                            : value || "" // Show N/A for empty fields
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </Card>
    </div>
  );
}
