import React from "react";
import { Card } from "./card";
import { Button } from "./button";

interface Invoice {
  id: string;
  cliente: string;
  estado: string;
  nrFatura: number;
  dataFatura: string;
  idProcesso: string;
}

interface InvoiceTabsProps {
  pendentes: Invoice[];
  aprovadas: Invoice[];
  recusadas: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

const InvoiceTabs: React.FC<InvoiceTabsProps> = ({
  pendentes,
  aprovadas,
  recusadas,
  onSelectInvoice,
}) => {
  const [activeTab, setActiveTab] = React.useState("Pendentes");

  const invoices = {
    Pendentes: pendentes,
    Aprovadas: aprovadas,
    Recusadas: recusadas,
  };

  return (
    <Card className="bg-white p-4 w-full">
      <div className="tabs">
        {["Pendentes", "Aprovadas", "Recusadas"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </Button>
        ))}
      </div>
      <div className="invoice-list">
        {invoices[activeTab].map((invoice) => (
          <div
            key={invoice.id}
            onClick={() => onSelectInvoice(invoice)}
            className="invoice-item cursor-pointer"
          >
            <p>{invoice.cliente}</p>
            <p>Fatura Nº {invoice.nrFatura}</p>
            <p>{invoice.dataFatura}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InvoiceTabs;
