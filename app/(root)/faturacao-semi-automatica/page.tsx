"use client";
import "./faturacaoAutomatica.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import ControlPanel from "@/components/ui/controlPanel";
import Configurator from "@/components/ui/configurator";

interface FaturacaoRecord {
  idProcesso: number;
  numProcSeguradora: string;
  idRamo: string;
  nomeInterno: string;
  nomeExterno: string;
  numApolice: string;
  estadoClinico: string;
  estadosinistro: string;
  nomeSinistrado: string;
  dataAdmissao: string;
  dataAlta: string;
  dataPrimeiraConsulta: string;
  dataUltimaConsulta: string;
  processoEstadoClinico: string;
  processoEstadoSinistro: string;
  entidade: {
    nomeInterno: string;
    nomeExterno: string;
  };
}

interface LineItem {
  ref: string;
  descricao: string;
  qtt: number;
  valorUnit: string;
  valorTotal: string;
}

export default function Component() {
  const [records, setRecords] = useState<FaturacaoRecord[]>([]);
  const [filters, setFilters] = useState<
    Record<string, { value: string; operator: string }>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refuseReason, setRefuseReason] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filter out empty values
        const filteredFilters = Object.fromEntries(
          Object.entries(filters).filter(([, { value }]) => value !== "")
        );

        const response = await axios.get<FaturacaoRecord[]>(
          "/api/faturacaoAutomatica",
          {
            params: {
              filters: JSON.stringify(filteredFilters),
            },
          }
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFiltersChange = (
    newFilters: Record<string, { value: string; operator: string }>
  ) => {
    setFilters(newFilters);
  };

  const handleFieldSelectionChange = (field: string) => {
    setSelectedFields((prevSelectedFields) =>
      prevSelectedFields.includes(field)
        ? prevSelectedFields.filter((f) => f !== field)
        : [...prevSelectedFields, field]
    );
  };

  const currentRecord = records[currentIndex];

  const lineItems: LineItem[] = currentRecord
    ? [
        {
          ref: "01.00.01.10",
          descricao: "Avaliação Clínica",
          qtt: 1,
          valorUnit: "25€",
          valorTotal: "25€",
        },
      ]
    : [];

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleNext = () => {
    if (currentIndex < records.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }, 1000); // Duration of the fade-out animation
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsAnimating(false);
      }, 1000); // Duration of the fade-out animation
    }
  };

  const handleApprove = () => {
    const promise = () =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          // Simulate success or failure
          const success = true; // Change to false to simulate an error
          if (success) {
            resolve({ name: "Fatura Aprovada com Sucesso" });
          } else {
            reject(new Error("Processo já faturado."));
          }
        }, 2000)
      );

    toast.promise(promise, {
      loading: "A processar...",
      success: (data) => {
        handleNext();
        return `${(data as { name: string }).name}`;
      },
      error: (err) => `Erro ao aprovar a fatura: ${err.message}`,
    });
  };

  const handleRefuse = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    // Add your refuse logic here with refuseReason
    console.log("Refused with reason:", refuseReason);
    toast.error("Fatura Recusada com Sucesso");
    setIsModalOpen(false);
    handleNext();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toISOString().split("T")[0].replace(/-/g, "/");
  };

  return (
    <section className="faturacao-automatica">
      <div
        className={`flex h-fit max-h-screen overflow-hidden ${isAnimating ? "fade-out" : "fade-in"}`}
      >
        <div className="flex flex-col flex-nowrap gap-4 w-lg">
          <Card className="relative bg-white flex-1 display-flex items-center justify-center my-2 mx-2 md:mx-4 md:my-4 overflow-x-hidden">
            <main className="text-xs py-2 px-2">
              <div className=" m-1 max-h-screen text-xs">
                {/* <Configurator /> */}
                <ControlPanel
                  onFiltersChange={handleFiltersChange}
                  selectedFields={selectedFields}
                />
              </div>
            </main>
          </Card>
        </div>
        <Card className="relative bg-white flex-1 display-flex items-center justify-center my-2 mx-2 md:mx-4 md:my-4 overflow-x-hidden">
          <header className="border-b-[1px] border-b-gray-200 text-primary-foreground py-2 px-2 md:px-4 md:py-4">
            <div className="container w-[100%] flex items-center justify-between">
              <div className="flex w-[100%] items-center">
                <div className="w-[100%]">
                  <h1 className="text-sm font-bold uppercase">
                    {currentRecord?.entidade.nomeExterno ?? "Sem resultados"}
                  </h1>
                  <h3 className="text-xs font-semibold mt-2">
                    Fatura - G{""}
                    {currentRecord?.entidade.nomeInterno?.slice(0, 3) ?? "N/A"}
                  </h3>
                  <h3 className="text-xs font-semibold">
                    {new Date().toISOString().split("T")[0]}{" "}
                  </h3>
                  <div className="flex justify-end items-center">
                    <div className="flex right-0 gap-2">
                      <Button
                        className="text-xs border-red-600 text-red-600  hover:bg-red-200 hover:border-transparent"
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
                        onClick={handleApprove}
                      >
                        Aprovar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 py-2 px-2 md:px-3">
            <div className="container text-xs max-w-5xl">
              {loading ? (
                <div>A carregar...</div>
              ) : currentRecord ? (
                <>
                  <h2 className="text-sm font-bold bg-gray-100">
                    Dados da Fatura:
                  </h2>
                  <div className="mt-2 mb-1">
                    <p>
                      <strong>Nome:</strong> {currentRecord.nomeSinistrado}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1">Nº Proc. TRUST:</strong>
                        {currentRecord.idProcesso}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Nº Proc. Seguradora:
                        </strong>
                        {currentRecord.numProcSeguradora}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Nº Apólice:
                        </strong>
                        {currentRecord.numApolice}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Ramo:
                        </strong>
                        {currentRecord.idRamo}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Estado Clínico:
                        </strong>
                        {currentRecord.processoEstadoClinico}
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Estado Sinistro:
                        </strong>
                        {currentRecord.processoEstadoSinistro}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Data de Admissão:
                        </strong>
                        {formatDate(currentRecord.dataAdmissao)}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Data da Alta:
                        </strong>
                        {formatDate(currentRecord.dataAlta)}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-left">
                        <strong className="mr-1 whitespace-nowrap">
                          Tempo de Tratamento:
                        </strong>
                        {Math.ceil(
                          (new Date(
                            currentRecord.dataUltimaConsulta
                          ).getTime() -
                            new Date(
                              currentRecord.dataPrimeiraConsulta
                            ).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        dias
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto mt-5">
                      <thead>
                        <tr className="bg-gray-100 text-muted-foreground">
                          <th className="px-2 py-1 text-left">Código</th>
                          <th className="px-2 py-1 text-left">Descrição</th>
                          <th className="px-2 py-1 text-center">Qtt</th>
                          <th className="px-2 py-1 text-center">Valor Unit.</th>
                          <th className="px-2 py-1 text-center">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-2 py-1 text-left">{item.ref}</td>
                            <td className="px-2 py-1 text-left">
                              {item.descricao}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {item.qtt}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {item.valorUnit}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {item.valorTotal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-32 mb-10 relative flex flex-row justify-end">
                    <div className="bg-gray-100 p-2 rounded-lg w-full max-w-md">
                      <div className="flex justify-between">
                        <p>Sub-Total:</p>
                        <p>
                          {lineItems.reduce(
                            (sum, item) =>
                              sum +
                              parseFloat(item.valorTotal.replace("€", "")),
                            0
                          )}
                          €
                        </p>
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
                        <p>
                          {lineItems.reduce(
                            (sum, item) =>
                              sum +
                              parseFloat(item.valorTotal.replace("€", "")),
                            0
                          )}
                          €
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full flex flex-row mb-2 mt-2 items-center justify-between ">
                    <Button
                      className="text-xs text-primary-foreground justify-start rounded font-bold hover:bg-gray-100"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      variant="outline"
                      size="sm"
                    >
                      Anterior
                    </Button>
                    <Button
                      className="text-xs text-primary-foreground justify-end rounded font-bold hover:bg-gray-100"
                      onClick={handleNext}
                      disabled={currentIndex === records.length - 1}
                      variant="outline"
                      size="sm"
                    >
                      Próxima
                    </Button>
                  </div>
                </>
              ) : (
                <div>Nenhum processo encontrado.</div>
              )}
            </div>
          </main>
        </Card>

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
        <Toaster richColors />
      </div>
    </section>
  );
}
