"use client";
import "./creditosAutomaticos.css";
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
    idrequisicao: string;
    idrequisicaoactomedico: string;
    dataFinal: string;
    dataOpen: string;
    texto: string;
    fiStamp: string;
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
  const [approvedCount, setApprovedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [filters, setFilters] = useState<
    Record<string, { value: string; operator: string }>
  >({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [priceTableData, setPriceTableData] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isAutoApproving, setIsAutoApproving] = useState(false);

  const currentInvoice = invoices[currentIndex];

  useEffect(() => {
    if (currentInvoice) {
      setModifiedLines(currentInvoice.ResultLinhas);
    }
  }, [currentInvoice]);

  useEffect(() => {
    // Real-time listener to update the number of approved invoices
    // Could be connected to WebSocket or any other real-time mechanism if applicable
    // Placeholder to simulate real-time updates on invoice approval
    const interval = setInterval(() => {
      // Update logic could be tied to actual data source
      // Simulating with a dummy condition for illustration
      setApprovedCount((prev) => prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLineChange = (index, key, value) => {
    const updatedLines = [...modifiedLines];
    updatedLines[index] = { ...updatedLines[index], [key]: value };
    setModifiedLines(updatedLines);
  };

  const handleAddLine = () => {
    setIsModalOpen(true);
  };

  const handleSelectPriceItem = (item: PriceItem) => {
    setModifiedLines([
      ...modifiedLines,
      {
        idLinha: modifiedLines.length > 0 ? modifiedLines.length + 1 : 1,
        ref: item.ref,
        descricao: item.descricao,
        qtt: 1,
        valorunit: item.valorunit,
        idrequisicao: item.idrequisicao,
        datafinal: item.datafinal,
        dataopen: item.dataopen,
      },
    ]);
    setIsModalOpen(false);
  };

  const handleDeleteLine = (index) => {
    const updatedLines = modifiedLines.filter((_, i) => i !== index);
    setModifiedLines(updatedLines);
  };

  const fetchInvoices = async (endpoint) => {
    setIsLoading(true);
    try {
      const response = await axios.get<Invoice[]>(endpoint);
      setInvoices(response.data);
      setInvoiceCount(response.data.length);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for button clicks
  const handleNotasCreditoAgeas = () => {
    fetchInvoices("/api/notas-credito-ageas");
  };

  const handleOpenProcess = () => {
    if (currentInvoice?.idprocesso) {
      const url = `https://cm.trustsaude.pt/clinical-processes/${currentInvoice.idprocesso}/appointments`;
      window.open(url, "_blank");
    }
  };

  const calculateTotal = () =>
    modifiedLines.reduce((sum, item) => sum + item.qtt * item.valorunit, 0);

  const handleSendToERP = async () => {
    return new Promise<void>(async (resolve, reject) => {
      setIsSending(true);
      try {
        const soapRequest = {
          action: "CreateCreditNote",
          invoiceDetails: {
            id: currentInvoice.id,
            identidade: currentInvoice.identidade,
            nomesinistrado: currentInvoice.nomesinistrado,
            idprocesso: currentInvoice.idprocesso,
            numapolice: currentInvoice.numapolice,
            numprocseguradora: currentInvoice.numprocseguradora,
            ResultLinhas: modifiedLines.map((line) => ({
              idlinha: line.idlinha,
              ref: line.ref,
              descricao: line.descricao,
              qtt: line.qtt,
              valorunit: line.valorunit,
              idrequisicao: line.idrequisicao,
              idrequisicaoactomedico: line.idrequisicaoactomedico,
              datafinal: "",
              dataopen: "",
              texto: line.texto,
              fistamp: line.fistamp,
            })),
          },
        };

        await axios.post("/api/emitir-nota-credito", soapRequest);

        setApprovedCount((prevCount) => prevCount + 1);
        setApprovedTotal((prevTotal) => prevTotal + (calculateTotal() || 0));

        if (currentIndex < invoices.length - 1) {
          setIsAnimating(true);
          setTimeout(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setIsAnimating(false);
          }, 1000);
        }

        resolve();
      } catch (error) {
        console.error("Erro ao enviar Nota de Crédito para o PHC:", error);
        reject(error);
      } finally {
        setIsSending(false);
      }
    });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApprove = () => {
    const promise = () =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          const success = true;
          if (success) {
            resolve({ name: "Nota de Crédito criada com Sucesso" });
          } else {
            reject(new Error("Erro ao emitir Nota de Crédito."));
          }
        }, 2000)
      );

    toast.promise(promise, {
      loading: "A processar...",
      success: (data) => {
        handleNext();
        return `${(data as { name: string }).name}`;
      },
      error: (err) => `Erro ao criar a Nota de Crédito: ${err.message}`,
    });
  };

  const handleRefuse = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    console.log("Recusada com o motivo:", refuseReason);
    toast.error("Nota de Crédito Recusada com Sucesso");
    setIsModalOpen(false);

    if (currentIndex < invoices.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setIsAnimating(false);
      }, 1000);
    }
  };

  const startAutoApproveConfirmation = () => {
    setIsConfirmModalOpen(true);
  };

  const handleNext = () => {
    if (currentIndex < invoices.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setIsAnimating(false);
      }, 1000);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <section className="faturacao-automatica h-screen max-h-screen flex flex-col">
      <Toaster richColors />
      <div
        className={`flex h-fit max-h-screen overflow-hidden ${
          isAnimating ? "fade-out" : "fade-in"
        }`}
      >
        <div className="flex flex-col w-[30%] h-screen max-h-screen gap-4">
          <div className="flex flex-col h-fit w-[100%] gap-4">
            <main className="text-xs py-2 px-2">
              <div className="m-1 max-h-screen text-xs">
                <div className="text-sm font-medium text-center">
                  <Card className="relative bg-white flex-1 items-center justify-center p-4 my-2 mx-2 overflow-x-hidden">
                    <div className="flex flex-row items-center justify-between ">
                      <div className="flex flex-col gap-2 mr-4">
                        <p className="text-sm font-medium text-center mt-2">
                          <strong>Notas de Crédito por Emitir</strong>
                        </p>
                        <p className="text-xl font-normal text-center">
                          {invoiceCount}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <p className="text-sm font-medium text-center mt-2">
                          <strong>Notas de Crédito Emitidas</strong>
                        </p>
                        <p className="text-xl font-normal text-center">
                          {approvedCount}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="relative bg-white flex-1 items-center justify-center p-4 my-2 mx-2 overflow-x-hidden">
                    <p className="text-sm font-medium text-center mt-2">
                      <strong>Total Creditado:</strong>
                    </p>
                    <p className="text-xl font-normal text-center">
                      {approvedTotal.toFixed(2)}€
                    </p>
                  </Card>
                </div>
              </div>
            </main>
          </div>
          <div className="flex flex-col h-auto w-[100%] gap-4">
            <Card className="relative bg-white flex-1 items-center justify-center my-2 mx-2 overflow-x-hidden">
              <main className="text-xs py-2 px-2">
                <div className="m-1 max-h-screen flex flex-col text-xs gap-4">
                  <p className="text-sm font-medium text-center ">
                    <strong>Emissão Automática de Notas de Crédito:</strong>
                  </p>
                  <Button
                    onClick={handleNotasCreditoAgeas} // Call the appropriate handler
                    className="text-xs gap-2 bg-gray-100 border-gray-200 text-black-600 hover:bg-gray-200 hover:border-gray-300"
                    variant="outline"
                    size="sm"
                  >
                    Notas de Crédito AGEAS
                  </Button>
                </div>
              </main>
            </Card>
          </div>
        </div>
        <div className="flex flex-col h-fit max-h-screen w-[70%]">
          {isLoading ? (
            <div className="mt-44 flex text-sm justify-center items-center text-center">
              <Atom
                color="#51BCD7"
                size="large"
                text="A procurar processos para creditar..."
                textColor="#000000"
              />{" "}
            </div>
          ) : (
            <Card className="relative h-full bg-white flex-1 items-center justify-center my-2 mx-2 overflow-x-hidden">
              <header className="border-b-[1px] border-gray-200 text-primary-foreground py-2 px-2">
                <div className="container w-full flex justify-between items-center">
                  <h1 className="text-sm font-bold uppercase">
                    {currentInvoice?.identidade || ""}
                  </h1>
                  <div className="flex gap-2">
                    <Button
                      className="text-xs border-blue-600 text-blue-600 hover:bg-blue-200 hover:border-transparent"
                      variant="outline"
                      size="sm"
                      onClick={handleOpenProcess}
                    >
                      Ver Processo
                    </Button>
                    <Button
                      className="text-xs border-red-600 text-red-600 hover:bg-red-200 hover:border-transparent"
                      variant="outline"
                      size="sm"
                      onClick={handleRefuse}
                    >
                      Recusar
                    </Button>
                    <Button
                      className="text-xs bg-green-100 border-green-200 text-green-600 hover:bg-green-200 hover:border-green-300"
                      variant="outline"
                      size="sm"
                      onClick={handleSendToERP}
                      disabled={isSending}
                    >
                      {isSending ? "A processar..." : "Emitir"}
                    </Button>
                  </div>
                </div>
              </header>
              <main className="flex-1 py-2 px-2">
                <div className="container text-xs max-w-5xl">
                  {currentInvoice ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        <div className="flex flex-col text-nowrap pr-2  w-[120%]">
                          <p>
                            <strong>Sinistrado:</strong>{" "}
                            {currentInvoice.nomesinistrado}
                          </p>
                          <p>
                            <strong>Apólice:</strong>{" "}
                            {currentInvoice.numapolice}
                          </p>
                        </div>
                        <div className="flex flex-col text-nowrap w-[80%] ml-12">
                          <p>
                            <strong>Processo TRUST:</strong>{" "}
                            {currentInvoice.idprocesso}
                          </p>
                        </div>
                        <div className="flex flex-col text-nowrap">
                          <p>
                            <strong>Processo Seguradora:</strong>{" "}
                            {currentInvoice.numprocseguradora}
                          </p>
                        </div>
                      </div>
                      <div className="flex-[1_1_0%] justify-start">
                        <table className="w-full table-auto mt-5">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-2 py-1 text-left">Código</th>
                              <th className="px-2 py-1 text-left">Descrição</th>
                              <th className="px-2 py-1 text-center">
                                Quantidade
                              </th>
                              <th className="px-2 py-1 text-center">
                                Valor Unitário
                              </th>
                              <th className="px-2 py-1 text-center">
                                Id Requisição
                              </th>
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
                                      handleLineChange(
                                        index,
                                        "ref",
                                        e.target.value
                                      )
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
                      <div className="mt-32 mb-10 relative flex flex-row justify-end">
                        <div className="bg-gray-100 p-2 rounded-lg w-full max-w-md">
                          <div className="flex justify-between">
                            <p>Sub-Total:</p>
                            <p>{calculateTotal()?.toFixed(2)}€</p>
                          </div>
                          <div className="flex justify-between">
                            <p>Desconto:</p>
                            <p>0€</p>
                          </div>
                          <div className="flex justify-between">
                            <p>IVA:</p>
                            <p>0€</p>
                          </div>
                          <div className="flex justify-between mt-2 font-bold">
                            <p>Total:</p>
                            <p>{calculateTotal()?.toFixed(2)}€</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full flex flex-row mb-2 mt-2 items-center justify-between">
                        <Button
                          onClick={() => setCurrentIndex(0)} // Navigate to the first invoice
                          disabled={currentIndex === 0}
                          className="text-xs text-[#000000] hover:bg-gray-200 hover:border-gray-300"
                          variant="outline"
                          size="sm"
                        >
                          Primeira
                        </Button>
                        <Button
                          onClick={handlePrevious} // Navigate to the previous invoice
                          disabled={currentIndex === 0}
                          className="text-xs text-[#000000] hover:bg-gray-200 hover:border-gray-300"
                          variant="outline"
                          size="sm"
                        >
                          Anterior
                        </Button>
                        {invoiceCount > 0 && (
                          <div className="text-center font-semibold">
                            <p>
                              Fatura Nº {currentIndex + 1} de {invoiceCount}
                            </p>
                            <input
                              type="number"
                              min="1"
                              max={invoiceCount}
                              value={currentIndex + 1}
                              onChange={(e) => {
                                const newIndex =
                                  parseInt(e.target.value, 10) - 1;
                                if (newIndex >= 0 && newIndex < invoiceCount) {
                                  setCurrentIndex(newIndex);
                                }
                              }}
                              className="border p-1 w-16 text-center"
                            />
                          </div>
                        )}
                        <Button
                          onClick={handleNext} // Navigate to the next invoice
                          disabled={currentIndex === invoices.length - 1}
                          className="text-xs text-[#000000] hover:bg-gray-200 hover:border-gray-300"
                          variant="outline"
                          size="sm"
                        >
                          Próxima
                        </Button>
                        <Button
                          onClick={() => setCurrentIndex(invoices.length - 1)} // Navigate to the last invoice
                          disabled={currentIndex === invoices.length - 1}
                          className="text-xs text-[#000000] hover:bg-gray-200 hover:border-gray-300"
                          variant="outline"
                          size="sm"
                        >
                          Última
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p>Nenhuma nota de crédito encontrada para emissão.</p>
                  )}
                </div>
              </main>
            </Card>
          )}
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirmação</h2>
            <p>
              Tem a certeza que deseja iniciar a emissão automática das faturas?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="bg-gray-100 text-black hover:bg-gray-200"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  handleAutoApprove(); // Start auto-approve
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Motivo da Recusa</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-100 text-black hover:bg-gray-200"
                onClick={handleModalClose}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleModalSubmit}
              >
                Recusar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
