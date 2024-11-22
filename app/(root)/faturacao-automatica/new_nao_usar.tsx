"use client";
import "./faturacaoAutomatica.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Toaster, toast } from "sonner";
import ControlPanel from "../../../components/ui/controlPanel";
import InvoiceTabs from "../../../components/ui/invoiceTabs";

const formatDate = (dateString: string) => {
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
  ResultLinhas?: Array<{
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

export default function InvoicePreview() {
  const [pendentes, setPendentes] = useState<Invoice[]>([]);
  const [aprovadas, setAprovadas] = useState<Invoice[]>([]);
  const [recusadas, setRecusadas] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [filters, setFilters] = useState<
    Record<string, { value: string; operator: string }>
  >({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const pendenteResponse = await axios.get<Invoice[]>("/api/motor-ageas");
        setPendentes(pendenteResponse.data);

        const statusResponse = await axios.get<Invoice[]>("/api/mminvoicer");
        setAprovadas(
          statusResponse.data.filter((invoice) => invoice.Estado === "Aprovada")
        );
        setRecusadas(
          statusResponse.data.filter((invoice) => invoice.Estado === "Recusada")
        );
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const calculateTotal = () =>
    selectedInvoice?.ResultLinhas?.reduce(
      (sum, item) => sum + item.qtt * item.valorunit,
      0
    );

  const handleOpenProcess = () => {
    if (selectedInvoice?.idprocesso) {
      const url = `https://cm.trustsaude.pt/clinical-processes/${selectedInvoice.idprocesso}/appointments`;
      window.open(url, "_blank");
    }
  };

  const handleSendToERP = () => {
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        setIsSending(true);
        try {
          const soapRequest = {
            action: "CreateInvoice",
            invoiceDetails: {
              id: selectedInvoice?.id,
              identidade: selectedInvoice?.identidade,
              nomesinistrado: selectedInvoice?.nomesinistrado,
              idprocesso: selectedInvoice?.idprocesso,
              numapolice: selectedInvoice?.numapolice,
              numprocseguradora: selectedInvoice?.numprocseguradora,
              ResultLinhas: selectedInvoice?.ResultLinhas?.map((line) => ({
                idlinha: line.idlinha,
                ref: line.ref,
                descricao: line.descricao,
                qtt: line.qtt,
                valorunit: line.valorunit,
                idrequisicao: line.idrequisicao,
                idrequisicaoactomedico: line.idrequisicaoactomedico || "",
                datafinal: line.datafinal,
                dataopen: line.dataopen,
                texto: line.texto || "nao",
                idavenca: line.idavenca || null,
              })),
            },
          };

          await axios.post("/api/send-soap-phc", soapRequest);

          setApprovedTotal((prevTotal) => prevTotal + (calculateTotal() || 0));

          resolve();
        } catch (error) {
          console.error("Erro ao enviar Fatura para o PHC:", error);
          reject(error);
        } finally {
          setIsSending(false);
        }
      }),
      {
        loading: "A processar...",
        success: "Fatura aprovada com Sucesso!",
        error: "Falha ao enviar Fatura",
      }
    );
  };

  const handleRefuse = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    console.log("Recusada com o motivo:", refuseReason);
    toast.error("Fatura Recusada com Sucesso");
    setIsModalOpen(false);
    setRefuseReason("");
  };

  return (
    <section className="faturacao-automatica h-screen flex flex-col">
      <Toaster richColors />
      <div className="flex gap-4 p-2">
        {/* Invoice Tabs Component */}
        <div className=" w-[30%]">
          <InvoiceTabs
            pendentes={pendentes}
            aprovadas={aprovadas}
            recusadas={recusadas}
            onSelectInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 1000);
            }}
          />
        </div>
        {/* Main Invoice Display */}
        <Card
          className={`relative bg-white flex-1 items-center justify-center p-4 ${isAnimating ? "fade-out" : "fade-in"}`}
        >
          {selectedInvoice ? (
            <>
              <header className="border-b-[1px] border-gray-200 py-2 px-2">
                <h1 className="text-sm font-bold uppercase">
                  {selectedInvoice?.seguradora}
                </h1>
                <Button onClick={handleOpenProcess}>Ver Processo</Button>
                <Button onClick={handleRefuse} variant="danger">
                  Recusar
                </Button>
                <Button onClick={handleSendToERP} disabled={isSending}>
                  {isSending ? "A enviar..." : "Aprovar"}
                </Button>
              </header>

              <main className="text-xs py-2 px-2">
                <div>
                  <p>
                    <strong>Sinistrado:</strong>{" "}
                    {selectedInvoice.nomesinistrado}
                  </p>
                  <p>
                    <strong>Processo TRUST:</strong>{" "}
                    {selectedInvoice.idprocesso}
                  </p>
                  <p>
                    <strong>Processo Seguradora:</strong>{" "}
                    {selectedInvoice.numprocseguradora}
                  </p>
                  <p>
                    <strong>Apólice:</strong> {selectedInvoice.numapolice}
                  </p>
                  <p>
                    <strong>Data de Admissão:</strong>{" "}
                    {formatDate(selectedInvoice.dataadmissao)}
                  </p>
                  <p>
                    <strong>Data de Alta:</strong>{" "}
                    {formatDate(selectedInvoice.dataalta)}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full mt-5">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Valor Unitário</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.ResultLinhas?.map((line) => (
                        <tr key={line.idlinha}>
                          <td>{line.ref}</td>
                          <td>{line.descricao}</td>
                          <td>{line.qtt}</td>
                          <td>{line.valorunit}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </main>
            </>
          ) : (
            <p>Selecione uma fatura para ver detalhes</p>
          )}
        </Card>
      </div>

      {/* Refusal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2>Motivo da Recusa</h2>
            <textarea
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
            />
            <Button onClick={handleModalSubmit}>Confirmar Recusa</Button>
          </div>
        </div>
      )}
    </section>
  );
}
