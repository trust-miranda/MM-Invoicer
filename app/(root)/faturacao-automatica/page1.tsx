"use client";
import "./faturacaoAutomatica.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import ControlPanel from "@/components/ui/controlPanel";
import { Atom } from "react-loading-indicators";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface Invoice {
  id: string;
  identidade: number;
  seguradora: string;
  idRamo: string;
  estadoSinistro: string;
  estadoClinico: string;
  pensionista: string;
  dataadmissao: string;
  dataalta: string;
  nomesinistrado: string;
  idprocesso: string;
  numapolice: string;
  numprocseguradora: string;
  ResultLinhas: Array<{
    idlinha: number;
    ref: string;
    descricao: string;
    qtt: number;
    valorunit: number;
    idrequisicao: string | null;
    datafinal: string | null;
    dataopen: number | null;
  }>;
}

interface PriceItem {
  ref: string;
  descricao: string;
  valorunit: number;
}

export default function InvoicePreview() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modifiedLines, setModifiedLines] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceTableData, setPriceTableData] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);

  const currentInvoice = invoices[currentIndex];

  useEffect(() => {
    if (currentInvoice) {
      setModifiedLines(currentInvoice.ResultLinhas);
    }
  }, [currentInvoice]);

  const fetchPriceTableData = async () => {
    try {
      const response = await axios.get("/api/tabelaPrecos"); // Adjust endpoint as needed
      setPriceTableData(response.data);
    } catch (error) {
      console.error("Error fetching price table data:", error);
    }
  };

  const handleLineChange = (index, key, value) => {
    const updatedLines = [...modifiedLines];
    updatedLines[index] = { ...updatedLines[index], [key]: value };
    setModifiedLines(updatedLines);
  };

  const handleAddLine = () => {
    fetchPriceTableData(); // Fetch data when opening the modal
    setIsModalOpen(true);
  };

  const handleSelectPriceItem = (item: PriceItem) => {
    setModifiedLines([
      ...modifiedLines,
      {
        idlinha: modifiedLines.length > 0 ? modifiedLines.length + 1 : 1,
        ref: item.ref,
        descricao: item.descricao,
        qtt: 1, // Default value, modify as needed
        valorunit: item.valorunit,
        idrequisicao: null,
        datafinal: null,
        dataopen: null,
      },
    ]);
    setIsModalOpen(false); // Close modal after selection
  };

  const handleDeleteLine = (index) => {
    const updatedLines = modifiedLines.filter((_, i) => i !== index);
    setModifiedLines(updatedLines);
  };

  // Other existing handlers...

  return (
    <section className="faturacao-automatica h-screen max-h-screen flex flex-col">
      <Toaster richColors />
      <div
        className={`flex h-fit max-h-screen overflow-hidden ${isAnimating ? "fade-out" : "fade-in"}`}
      >
        {/* Your existing layout and components */}
        <div className="flex flex-col w-[30%] h-screen max-h-screen gap-4">
          {/* Left panel */}
          <Card className="relative bg-white flex-1 items-center justify-center my-2 mx-2 overflow-x-hidden">
            {/* Content */}
          </Card>
        </div>
        <div className="flex flex-col h-fit max-h-screen w-[70%]">
          {/* Main content */}
          <Card className="relative h-full bg-white flex-1 items-center justify-center my-2 mx-2 overflow-x-hidden">
            <main className="flex-1 py-2 px-2">
              {/* Render current invoice data */}
              <div className="flex-[1_1_0%] justify-start">
                <table className="w-full table-auto mt-5">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 text-left">Código</th>
                      <th className="px-2 py-1 text-left">Descrição</th>
                      <th className="px-2 py-1 text-center">Quantidade</th>
                      <th className="px-2 py-1 text-center">Valor Unitário</th>
                      <th className="px-2 py-1 text-center">Id Requisição</th>
                      <th className="px-2 py-1 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modifiedLines.map((line, index) => (
                      <tr key={line.idlinha}>
                        <td className="px-2 py-1">
                          <input
                            type="text"
                            value={line.ref}
                            onChange={(e) =>
                              handleLineChange(index, "ref", e.target.value)
                            }
                            className="border p-1"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="text"
                            value={line.descricao}
                            onChange={(e) =>
                              handleLineChange(
                                index,
                                "descricao",
                                e.target.value
                              )
                            }
                            className="border p-1"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="number"
                            value={line.qtt}
                            onChange={(e) =>
                              handleLineChange(
                                index,
                                "qtt",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="border p-1 text-center"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="number"
                            value={line.valorunit}
                            onChange={(e) =>
                              handleLineChange(
                                index,
                                "valorunit",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="border p-1 text-center"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            value={line.idrequisicao}
                            onChange={(e) =>
                              handleLineChange(
                                index,
                                "idrequisicao",
                                e.target.value
                              )
                            }
                            className="border p-1 text-center"
                          />
                        </td>
                        <td className="px-2 text-center">
                          <Button
                            className="text-xs text-red-600 hover:underline hover:font-medium"
                            onClick={() => handleDeleteLine(index)}
                            size="xs"
                          >
                            Remover
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button
                  className="text-xs m-2 border-gray-400 text-[#000000] hover:bg-gray-200 hover:border-gray-300"
                  onClick={handleAddLine}
                  variant="outline"
                  size="sm"
                >
                  Adicionar Linha
                </Button>
              </div>
            </main>
          </Card>
        </div>
      </div>

      {/* Modal for selecting a price item */}
      {isModalOpen && (
        <Button onClick={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-lg font-bold">Selecione um Item</h2>
            <table className="w-full table-auto mt-2">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Referência</th>
                  <th className="px-2 py-1 text-left">Descrição</th>
                  <th className="px-2 py-1 text-center">Preço Unitário</th>
                  <th className="px-2 py-1 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {priceTableData.map((item) => (
                  <tr key={item.ref}>
                    <td className="px-2 py-1">{item.ref}</td>
                    <td className="px-2 py-1">{item.descricao}</td>
                    <td className="px-2 py-1 text-center">{item.valorunit}</td>
                    <td className="px-2 py-1 text-center">
                      <Button
                        onClick={() => handleSelectPriceItem(item)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Selecionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Button>
      )}
    </section>
  );
}
