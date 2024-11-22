"use client";
import "./faturacaoAutomatica.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import ControlPanel from "@/components/ui/controlPanel";

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
    idrequisicao: string | null;
    datafinal: string | null;
    dataopen: number | null;
  }>;
}

export default function InvoicePreview() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get<Invoice[]>("/api/motor-ageas");
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const currentInvoice = invoices[currentIndex];

  const handleSendToERP = async () => {
    setIsSending(true);

    try {
      const soapRequest = {
        action: "CreateInvoice",
        invoiceDetails: currentInvoice,
      };

      await axios.post("/api/send-to-erp", soapRequest);
      toast.success("Invoice sent successfully!");

      // Navigate to the next invoice
      if (currentIndex < invoices.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } catch (error) {
      toast.error("Failed to send invoice.");
      console.error("Error sending to ERP:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="faturacao-automatica">
      <Toaster richColors />
      <div className="flex h-fit max-h-screen overflow-hidden">
        <Card className="relative bg-white flex-1">
          <header className="border-b-[1px] text-primary-foreground py-2 px-2">
            <div className="container w-full flex justify-between items-center">
              <h1 className="text-sm font-bold uppercase">
                {currentInvoice?.nomesinistrado || "No invoices"}
              </h1>
              <Button
                className="text-xs bg-green-500 hover:bg-green-600 text-white"
                onClick={handleSendToERP}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send to ERP"}
              </Button>
            </div>
          </header>

          <main className="flex-1 py-2 px-2">
            <div className="container text-xs max-w-5xl">
              {currentInvoice ? (
                <>
                  <div className="mt-2 mb-1">
                    <p>
                      <strong>Invoice ID:</strong> {currentInvoice.id}
                    </p>
                    <p>
                      <strong>Process ID:</strong> {currentInvoice.idprocesso}
                    </p>
                    <p>
                      <strong>Policy No:</strong> {currentInvoice.numapolice}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full table-auto mt-5">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 text-left">Code</th>
                          <th className="px-2 py-1 text-left">Description</th>
                          <th className="px-2 py-1 text-center">Qty</th>
                          <th className="px-2 py-1 text-center">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.ResultLinhas.map((line, index) => (
                          <tr key={index}>
                            <td className="px-2 py-1">{line.ref}</td>
                            <td className="px-2 py-1">{line.descricao}</td>
                            <td className="px-2 py-1 text-center">
                              {line.qtt}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {line.valorunit}€
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p>No invoices available.</p>
              )}
            </div>
          </main>
          <div className="flex justify-between p-2">
            <Button
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentIndex((i) => Math.min(i + 1, invoices.length - 1))
              }
              disabled={currentIndex === invoices.length - 1}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
