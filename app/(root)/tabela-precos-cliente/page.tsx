"use client";

import "./styles.css";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface UnitPrice {
  identidadeseguradora: number;
  nome: string;
  datainicio: string;
  datafim: string;
  duracaoAvenca: string;
  duracaoRenovacao: string;
  ref: string;
  descricao: string;
  valorunit: number;
  valorunitTrust: number;
  valorunitIlhas: number;
  incluidoAvenca: boolean;
  qttIncluidaNaAvenca: number;
  refProdutoComposto: string;
  tabela: string;
}

const nameMapping: Record<string, string> = {
  "VICTORIA Seguros SA": "Victoria",
  "Zurich Insurance Europe AG, Sucursal em Portugal": "Zurich",
  "Generali Seguros y Reaseguros, S.A. – Sucursal em PT": "Generali",
  "AGEAS PORTUGAL - COMPANHIA SEGUROS SA": "AGEAS",
  "Aon Portugal, S.A.": "AON",
  "CREDITO AGRICOLA SEGUROS - COMPANHIA DE SEGUROS DE RAMO": "CA Seguros",
  "JERONIMO MARTINS SGPS S A": "Grupo JM",
  "UNA Seguros": "UNA",
  "COMPANHIA DE SEGUROS ALLIANZ PORTUGAL, S.A.": "Allianz",
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Page() {
  const [data, setData] = useState<UnitPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTabela, setSelectedTabela] = useState<string | null>(null);
  const [tabelaOptions, setTabelaOptions] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [datainicio, setDatainicio] = useState<string>("");
  const [datafim, setDatafim] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [badgeVariant, setBadgeVariant] = useState<"ativo" | "inativo">(
    "ativo"
  );

  useEffect(() => {
    fetch("/api/tabelaPrecos")
      .then((response) => response.json())
      .then((data: UnitPrice[]) => {
        setData(data);
        setLoading(false);
        if (data.length > 0) {
          setSelectedId(data[0].identidadeseguradora);
          setDatainicio(formatDate(data[0].datainicio));
          setDatafim(formatDate(data[0].datafim));
          const uniqueTabelas: string[] = Array.from(
            new Set(data.map((item) => item.tabela))
          );
          setTabelaOptions(uniqueTabelas);
          setSelectedTabela(uniqueTabelas[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const inicioDate = new Date(datainicio);
    const fimDate = new Date(datafim);

    if (inicioDate < currentDate && fimDate > currentDate) {
      setBadgeVariant("ativo");
    } else {
      setBadgeVariant("inativo");
    }
  }, [datainicio, datafim]);

  const groupedData = data.reduce(
    (acc, item) => {
      if (!acc[item.identidadeseguradora]) {
        acc[item.identidadeseguradora] = [];
      }
      acc[item.identidadeseguradora].push(item);
      return acc;
    },
    {} as Record<number, UnitPrice[]>
  );

  useEffect(() => {
    if (selectedId !== null) {
      const filteredData = data.filter(
        (item) => item.identidadeseguradora === selectedId
      );
      const uniqueTabelas: string[] = Array.from(
        new Set(filteredData.map((item) => item.tabela))
      );
      setTabelaOptions(uniqueTabelas);
      setSelectedTabela(uniqueTabelas[0]);
    }
  }, [selectedId, data]);

  const removeDuplicates = (data: UnitPrice[], keys: (keyof UnitPrice)[]) => {
    const seen = new Set();
    return data.filter((item) => {
      const keyValues = keys.map((key) => item[key]).join("|");
      if (seen.has(keyValues)) {
        return false;
      }
      seen.add(keyValues);
      return true;
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    setSelectedId(selectedId);
    const selectedData = data.find(
      (item) => item.identidadeseguradora === selectedId
    );
    if (selectedData) {
      setDatainicio(formatDate(selectedData.datainicio));
      setDatafim(formatDate(selectedData.datafim));
    }
  };

  const handleTabelaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTabela = event.target.value;
    setSelectedTabela(selectedTabela);
    const selectedData = data.find(
      (item) =>
        item.tabela === selectedTabela &&
        item.identidadeseguradora === selectedId
    );
    if (selectedData) {
      setDatainicio(formatDate(selectedData.datainicio));
      setDatafim(formatDate(selectedData.datafim));
    }
  };

  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData =
    selectedId !== null && selectedTabela !== null
      ? data.filter(
          (item) =>
            item.identidadeseguradora === selectedId &&
            item.tabela === selectedTabela &&
            (item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.descricao.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : [];

  const sortedData = filteredData.sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn as keyof UnitPrice];
      const bValue = b[sortColumn as keyof UnitPrice];
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const uniqueSortedData = removeDuplicates(sortedData, ["ref", "tabela"]);

  const copyToClipboard = () => {
    const tableText = sortedData
      .map(
        (item) =>
          `${item.ref}\t${item.descricao}\t${item.valorunit}\t${item.valorunitTrust}\t${item.valorunitIlhas}\t${item.incluidoAvenca ? "Sim" : "Não"}\t${item.qttIncluidaNaAvenca}\t${item.refProdutoComposto}`
      )
      .join("\n");
    navigator.clipboard.writeText(tableText);
    alert("Dados da Tabela copiados!");
  };

  const printTable = () => {
    window.print();
  };

  const downloadCSV = () => {
    const filteredData = sortedData.filter(
      (item) => item.tabela === selectedTabela
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredData
        .map(
          (item) =>
            `${item.ref},${item.descricao},${item.valorunit},${item.valorunitTrust},${item.valorunitIlhas},${item.incluidoAvenca ? "Sim" : "Não"},${item.qttIncluidaNaAvenca},${item.refProdutoComposto}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p>A carregar...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return (
        <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
      );
    }
    return null;
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCopy = () => {
    copyToClipboard();
    setDropdownVisible(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Define table headers
    const tableHeaders = [
      "Referência",
      "Descrição",
      "Preço",
      "Preço Trust",
      "Preço Ilhas",
      "Incluído Avença",
      "Qtt Incluída",
      "Ref Prod. Composto",
    ];

    // Get the selected table data
    const tableData = uniqueSortedData.map((item) => [
      item.ref,
      item.descricao,
      item.valorunit,
      item.valorunitTrust,
      item.valorunitIlhas,
      item.incluidoAvenca ? "Sim" : "Não",
      item.qttIncluidaNaAvenca,
      item.refProdutoComposto,
    ]);

    // Add a title to the PDF
    doc.text("Tabela de Preços de Cliente", 14, 22);

    // Generate the table using autoTable plugin
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 30,
    });

    // Get the client name from nameMapping or default to "Cliente"
    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela = nameMapping[groupedData[selectedId!][0].tabela] || "";
    const badge = badgeVariant || "Estado";

    // Save the generated PDF with the client's name in the filename
    doc.save(`tabela_precos_${clientName}_${tabela}_${badge}.pdf`);
    setDropdownVisible(false);
  };

  const handleExportXML = () => {
    const filteredData = sortedData.filter(
      (item) => item.tabela === selectedTabela
    );

    // Convert filteredData to XML format
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
  <Prices>
    ${filteredData
      .map((item) => {
        return `
    <Price>
      <Referência>${item.ref}</Referência>
      <Descrição>${item.descricao}</Descrição>
      <Preço>${item.valorunit}</Preço>
      <PreçoTrust>${item.valorunitTrust}</PreçoTrust>
      <PreçoIlhas>${item.valorunitIlhas}</PreçoIlhas>
      <IncluídoAvença>${item.incluidoAvenca ? "Sim" : "Não"}</IncluídoAvença>
      <QttIncluída>${item.qttIncluidaNaAvenca}</QttIncluída>
      <RefProdComposto>${item.refProdutoComposto}</RefProdComposto>
    </Price>`;
      })
      .join("\n")}
  </Prices>`;

    // Create a Blob for the XML content
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    // Get the client name from nameMapping or default to "Cliente"
    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela = nameMapping[groupedData[selectedId!][0].tabela] || "";
    const badge = badgeVariant || "Estado";

    // Set the filename with the client's name
    a.href = url;
    a.download = `tabela_precos_${clientName}_${tabela}_${badge}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownVisible(false);
  };

  const handleExportCSV = () => {
    const filteredData = sortedData.filter(
      (item) => item.tabela === selectedTabela
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredData
        .map(
          (item) =>
            `${item.ref},${item.descricao},${item.valorunit},${item.valorunitTrust},${item.valorunitIlhas},${item.incluidoAvenca ? "Sim" : "Não"},${item.qttIncluidaNaAvenca},${item.refProdutoComposto}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    // Get the client name from nameMapping or default to "Cliente"
    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela = nameMapping[groupedData[selectedId!][0].tabela] || "";
    const badge = badgeVariant || "Estado";

    // Set the filename with the client's name
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `tabela_precos_${clientName}_${tabela}_${badge}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const filteredData = sortedData.filter(
      (item) => item.tabela === selectedTabela
    );

    const json = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    // Get the client name from nameMapping or default to "Cliente"
    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela = nameMapping[groupedData[selectedId!][0].tabela] || "";
    const badge = badgeVariant || "Estado";

    // Set the filename with the client's name
    a.href = url;
    a.download = `tabela_precos_${clientName}_${tabela}_${badge}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownVisible(false);
  };

  const handleDownloadXLSX = () => {
    const filteredData = sortedData.filter(
      (item) => item.tabela === selectedTabela
    );

    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela = nameMapping[groupedData[selectedId!][0].tabela] || "";
    const badge = badgeVariant || "Estado";

    const worksheet = xlsx.utils.json_to_sheet(filteredData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
    xlsx.writeFile(
      workbook,
      `tabela_precos_${clientName}_${tabela}_${badge}.xlsx`
    );
    setDropdownVisible(false);
  };

  const toggleBadgeVariant = () => {
    setBadgeVariant(badgeVariant === "ativo" ? "inativo" : "ativo");
  };

  return (
    <div className="p-4">
      <Card className="relative bg-white flex-1 display-flex items-center justify-center my-2 mx-2 md:mx-4 md:my-4 overflow-x-hidden">
        <header className="border-b-[1px] border-b-gray-200 text-primary-foreground py-2 px-2 md:px-4 md:py-4">
          <div className="container w-[100%] flex items-center justify-between">
            <div className="flex w-[100%] items-center">
              <h1 className="text-xl font-bold">Tabela de Preços de Cliente</h1>
              <div className="relative ml-auto">
                <Badge
                  variant={badgeVariant}
                  className={`badge ${badgeVariant === "ativo" ? "badge-ativo" : "badge-inativo"}`}
                >
                  {badgeVariant === "ativo"
                    ? "Tabela em Vigor"
                    : "Tabela Inativa"}
                </Badge>
              </div>
              <div className="relative ml-20">
                <button
                  onClick={handleDropdownToggle}
                  className="text-xl font-bold"
                >
                  ...
                </button>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <button
                      onClick={handleCopy}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copiar Tabela
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Exportar para PDF
                    </button>
                    <button
                      onClick={handleExportXML}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Exportar para XML
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Exportar para CSV
                    </button>
                    <button
                      onClick={handleDownloadJSON}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Exportar para JSON
                    </button>
                    <button
                      onClick={handleDownloadXLSX}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Exportar para XLSX
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 py-4 px-2 md:px-3">
          <div className="overflow-x-auto">
            <div className="mb-4 flex items-center space-x-4">
              <label
                htmlFor="seguradora-select"
                className="text-xs font-semibold"
              >
                Cliente:
              </label>
              <select
                id="seguradora-select"
                value={selectedId ?? ""}
                onChange={handleSelectChange}
                className="text-xs border rounded p-2 w-[30%]"
              >
                {Object.keys(groupedData).map((id) => (
                  <option key={id} value={id}>
                    {nameMapping[groupedData[Number(id)][0].nome] ||
                      groupedData[Number(id)][0].nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="tabela-select"
                className="text-xs font-semibold text-nowrap"
              >
                Tabela Nº
              </label>
              <select
                id="tabela-select"
                value={selectedTabela ?? ""}
                onChange={handleTabelaChange}
                className="text-xs border rounded p-2 w-[20%]"
              >
                {Array.from(new Set(data.map((item) => item.tabela))).map(
                  (tabela) => (
                    <option key={tabela} value={tabela}>
                      {tabela}
                    </option>
                  )
                )}
              </select>
              <label htmlFor="datainicio" className="text-xs font-semibold">
                Início:
              </label>
              <input
                type="date"
                id="datainicio"
                value={datainicio}
                readOnly
                className="text-xs border rounded p-2 w-[10%]"
              />
              <label htmlFor="datafim" className="text-xs font-semibold">
                Fim:
              </label>
              <input
                type="date"
                id="datafim"
                value={datafim}
                readOnly
                className="text-xs border rounded p-2 w-[10%]"
              />
              <label htmlFor="search" className="text-xs font-semibold">
                Procurar:
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="text-xs border rounded p-2 w-[40%]"
                placeholder="Procurar por Ref ou Descrição"
              />
            </div>
            {selectedId !== null && (
              <table className="w-full table-auto mt-5">
                <thead>
                  <tr className="bg-gray-100 text-muted-foreground">
                    <th
                      className="px-2 py-1 text-xs text-left cursor-pointer"
                      onClick={() => handleSort("ref")}
                    >
                      Referência {renderSortIcon("ref")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-left cursor-pointer"
                      onClick={() => handleSort("descricao")}
                    >
                      Descrição {renderSortIcon("descricao")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-center cursor-pointer"
                      onClick={() => handleSort("valorunit")}
                    >
                      Preço {renderSortIcon("valorunit")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-center cursor-pointer"
                      onClick={() => handleSort("valorunitTrust")}
                    >
                      Preço Trust {renderSortIcon("valorunitTrust")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-center cursor-pointer"
                      onClick={() => handleSort("valorunitIlhas")}
                    >
                      Preço Ilhas {renderSortIcon("valorunitIlhas")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-center cursor-pointer"
                      onClick={() => handleSort("incluidoAvenca")}
                    >
                      Incluído Avença {renderSortIcon("incluidoAvenca")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-center cursor-pointer"
                      onClick={() => handleSort("qttIncluidaNaAvenca")}
                    >
                      Qtt incluída {renderSortIcon("qttIncluidaNaAvenca")}
                    </th>
                    <th
                      className="px-2 py-1 text-xs text-center cursor-pointer"
                      onClick={() => handleSort("refProdutoComposto")}
                    >
                      Ref Prod. Composto {renderSortIcon("refProdutoComposto")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueSortedData.map((item) => (
                    <tr
                      key={`${item.ref}-${item.tabela}`}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="px-2 py-1 text-xs text-left">
                        {item.ref}
                      </td>
                      <td className="px-2 py-1 text-xs text-left">
                        {item.descricao}
                      </td>
                      <td className="px-2 py-1 text-xs text-center">
                        {item.valorunit}
                      </td>
                      <td className="px-2 py-1 text-xs text-center">
                        {item.valorunitTrust}
                      </td>
                      <td className="px-2 py-1 text-xs text-center">
                        {item.valorunitIlhas}
                      </td>
                      <td className="px-2 py-1 text-xs text-center">
                        {item.incluidoAvenca ? "Sim" : "Não"}
                      </td>
                      <td className="px-2 py-1 text-xs text-center">
                        {item.qttIncluidaNaAvenca}
                      </td>
                      <td className="px-2 py-1 text-xs text-center">
                        {item.refProdutoComposto}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </Card>
    </div>
  );
}
