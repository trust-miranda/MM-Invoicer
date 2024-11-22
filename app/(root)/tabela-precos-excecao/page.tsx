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
  nrfornecedor: string;
  nrestab: string;
  prestador: string;
  datainicio: string;
  datafim: string;
  ref: string;
  descricao: string;
  valorunit: number;
}

const nameMapping: Record<string, string> = {
  "AGEAS PORTUGAL - COMPANHIA SEGUROS SA": "AGEAS",
  "Aon Portugal, S.A.": "AON",
  "COMPANHIA DE SEGUROS ALLIANZ PORTUGAL, S.A.": "Allianz",
  "CREDITO AGRICOLA SEGUROS - COMPANHIA DE SEGUROS DE RAMO": "CA Seguros",
  "Generali Seguros y Reaseguros, S.A. – Sucursal em PT": "Generali",
  "JERONIMO MARTINS SGPS S A": "Grupo JM",
  "OCIDENTAL COMPANHIA PORTUGUESA SEGUROS SA": "Ocidental",
  "UNA Seguros": "UNA",
  "VICTORIA Seguros SA": "Victoria",
  "Zurich Insurance Europe AG, Sucursal em Portugal": "Zurich",
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
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [datainicio, setDatainicio] = useState<string>("");
  const [datafim, setDatafim] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTabela, setSelectedTabela] = useState<string | null>(null);
  const [selectedNrFornecedor, setSelectedNrFornecedor] = useState<string | "">(
    "0"
  );
  const [selectedNrEstab, setSelectedNrEstab] = useState<string | "">("0");
  const [nrFornecedorOptions, setNrFornecedorOptions] = useState<string[]>([]);
  const [nrEstabOptions, setNrEstabOptions] = useState<string[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [badgeVariant, setBadgeVariant] = useState<"ativo" | "inativo">(
    "ativo"
  );

  useEffect(() => {
    fetch("/api/tabelaPrecosExcecao")
      .then((response) => response.json())
      .then((data: UnitPrice[]) => {
        setData(data);
        setLoading(false);
        if (data.length > 0) {
          setSelectedId(data[0].identidadeseguradora);
          setDatainicio(formatDate(data[0].datainicio));
          setDatafim(formatDate(data[0].datafim));

          const uniqueNrFornecedores = Array.from(
            new Set(data.map((item) => item.nrfornecedor))
          );
          const uniqueNrEstabs = Array.from(
            new Set(data.map((item) => item.nrestab))
          );

          setNrFornecedorOptions(uniqueNrFornecedores);
          setNrEstabOptions(uniqueNrEstabs);

          setSelectedNrFornecedor(uniqueNrFornecedores[0] || "169");
          setSelectedNrEstab(uniqueNrEstabs[0] || "0");
        }
      })
      .catch((error) => {
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
    const filteredByCliente = data.filter(
      (item) => item.identidadeseguradora === selectedId
    );
    const uniqueNrFornecedores = Array.from(
      new Set(filteredByCliente.map((item) => item.nrfornecedor))
    );
    const uniqueNrEstabs = Array.from(
      new Set(filteredByCliente.map((item) => item.nrestab))
    );

    setNrFornecedorOptions(uniqueNrFornecedores);
    setNrEstabOptions(uniqueNrEstabs);

    setSelectedNrFornecedor(uniqueNrFornecedores[0] || "169");
    setSelectedNrEstab(uniqueNrEstabs[0] || "0");
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
    } else {
      setDatainicio("");
      setDatafim("");
    }
  };

  const handleNrFornecedorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedFornecedor = event.target.value;
    setSelectedNrFornecedor(selectedFornecedor);

    const selectedData = data.find(
      (item) =>
        item.nrfornecedor === selectedFornecedor &&
        item.identidadeseguradora === selectedId
    );
    if (selectedData) {
      setDatainicio(formatDate(selectedData.datainicio));
      setDatafim(formatDate(selectedData.datafim));
    } else {
      setDatainicio("");
      setDatafim("");
    }
  };

  const handleNrEstabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEstab = event.target.value;
    setSelectedNrEstab(selectedEstab);

    const selectedData = data.find(
      (item) =>
        item.nrfornecedor === selectedNrFornecedor &&
        item.identidadeseguradora === selectedId &&
        item.nrestab === selectedEstab
    );
    if (selectedData) {
      setDatainicio(formatDate(selectedData.datainicio));
      setDatafim(formatDate(selectedData.datafim));
    } else {
      setDatainicio("");
      setDatafim("");
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
    selectedId !== null &&
    selectedNrFornecedor !== null &&
    selectedNrEstab !== null
      ? data.filter(
          (item) =>
            item.identidadeseguradora === selectedId &&
            item.nrfornecedor === selectedNrFornecedor &&
            item.nrestab === selectedNrEstab &&
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

  const uniqueSortedData = removeDuplicates(sortedData, [
    "identidadeseguradora",
    "nrfornecedor",
    "nrestab",
    "ref",
  ]);

  const copyToClipboard = () => {
    const tableText = sortedData
      .map((item) => `${item.ref}\t${item.descricao}\t${item.valorunit}`)
      .join("\n");
    navigator.clipboard.writeText(tableText);
    alert("Dados da Tabela copiados!");
  };

  const printTable = () => {
    window.print();
  };

  const downloadCSV = () => {
    const filteredData = sortedData.filter(
      (item) =>
        item.identidadeseguradora === selectedId &&
        item.nrfornecedor === selectedNrFornecedor &&
        item.nrestab === selectedNrEstab
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredData
        .map((item) => `${item.ref},${item.descricao},${item.valorunit}`)
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
    const tableHeaders = ["Referência", "Descrição", "Preço"];
    const tableData = uniqueSortedData.map((item) => [
      item.ref,
      item.descricao,
      item.valorunit,
    ]);

    doc.text("Tabela de Preços de Cliente", 14, 22);
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 30,
    });

    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela =
      nameMapping[
        (groupedData[selectedId!][0],
        [selectedNrFornecedor!][0],
        [selectedNrEstab!][0])
      ] || "";
    const badge = badgeVariant || "Estado";

    doc.save(`tabela_precos_excecao_${clientName}_${tabela}_${badge}.pdf`);
    setDropdownVisible(false);
  };

  const handleExportXML = () => {
    const filteredData = sortedData.filter(
      (item) =>
        item.nrfornecedor === selectedNrFornecedor &&
        item.nrestab === selectedNrEstab &&
        item.identidadeseguradora === selectedId
    );
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
  <Prices>
    ${filteredData
      .map((item) => {
        return `
      <Price>
      <Referência>${item.ref}</Referência>
      <Descrição>${item.descricao}</Descrição>
      <Preço>${item.valorunit}</Preço>
    </Price>`;
      })
      .join("\n")}
  </Prices>`;

    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela =
      nameMapping[groupedData[selectedId!][0].identidadeseguradora] || "";
    const badge = badgeVariant || "Estado";

    a.href = url;
    a.download = `tabela_precos_${clientName}_${tabela}_${badge}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownVisible(false);
  };

  const handleExportCSV = () => {
    const filteredData = sortedData.filter(
      (item) =>
        item.nrfornecedor === selectedNrFornecedor &&
        item.nrestab === selectedNrEstab &&
        item.identidadeseguradora === selectedId
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredData
        .map((item) => `${item.ref},${item.descricao},${item.valorunit}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela =
      nameMapping[groupedData[selectedId!][0].identidadeseguradora] || "";
    const badge = badgeVariant || "Estado";

    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `tabela_precos_excecao_${clientName}_${tabela}_${badge}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadXLSX = () => {
    const worksheet = xlsx.utils.json_to_sheet(sortedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data");

    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela =
      nameMapping[groupedData[selectedId!][0].identidadeseguradora] || "";
    const badge = badgeVariant || "Estado";

    xlsx.writeFile(
      workbook,
      `tabela_precos_excecao_${clientName}_${tabela}_${badge}.xlsx`
    );
    setDropdownVisible(false);
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(sortedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const clientName =
      nameMapping[groupedData[selectedId!][0].nome] || "Cliente";
    const tabela =
      nameMapping[groupedData[selectedId!][0].identidadeseguradora] || "";
    const badge = badgeVariant || "Estado";

    a.href = url;
    a.download = `tabela_precos_excecao_${clientName}_${tabela}_${badge}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
              <h1 className="text-xl font-bold">Tabela de Preços de Exceção</h1>
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
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                  className="text-xl font-bold"
                >
                  ...
                </button>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <button
                      onClick={copyToClipboard}
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
                htmlFor="nrfornecedor-select"
                className="text-xs font-semibold"
              >
                Fornecedor:
              </label>
              <select
                id="nrfornecedor-select"
                value={selectedNrFornecedor ?? ""}
                onChange={handleNrFornecedorChange}
                className="text-xs border rounded p-2 w-[20%]"
              >
                {nrFornecedorOptions.map((nrfornecedor) => (
                  <option key={nrfornecedor} value={nrfornecedor}>
                    {nrfornecedor}
                  </option>
                ))}
              </select>
              <label htmlFor="nrestab-select" className="text-xs font-semibold">
                Estabelecimento:
              </label>
              <select
                id="nrestab-select"
                value={selectedNrEstab ?? ""}
                onChange={handleNrEstabChange}
                className="text-xs border rounded p-2 w-[30%]"
              >
                {nrEstabOptions.map((nrestab) => (
                  <option key={nrestab} value={nrestab}>
                    {nrestab}
                  </option>
                ))}
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
            {selectedId !== null &&
              selectedNrFornecedor !== null &&
              selectedNrEstab !== null && (
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
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueSortedData.map((item) => (
                      <tr
                        key={`${item.ref}-${item.nrfornecedor}-${item.nrestab}`}
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
