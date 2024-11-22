"use client";
import React from "react";
import HeaderBox from "@/components/ui/HeaderBox";
import AirtableForm from "@/components/ui/AirTableForm";
import NewRecordForm from "../parcerias-pedidos/components/novoPedidoForm";

const PedidosValorizacao = () => {
  return (
    <section className="pedidos p-4 h-screen flex flex-col">
      <div className="pedidos-content p-4 ">
        <header className="pedidos-header">
          <HeaderBox type="title" title="PARCERIAS - PEDIDOS" subtext="" />
        </header>
        <div className="items-center justify-center">
          <NewRecordForm />
          {/* <AirtableForm /> */}
        </div>
      </div>
    </section>
  );
};

export default PedidosValorizacao;
