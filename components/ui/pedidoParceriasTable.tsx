"use client";
import React, { useEffect, useState } from "react";

interface Contrato {
  "Nº Processo TRUST": string;
  "Código Ato Médico": string;
  "Nível de Urgência": string;
  Anexos: string;
  Observações: string;
  "Tipo de Pedido": string;
  Seguradora: string;
  Descrição: string;
  "Estado do Pedido": string;
  Prestador: string;
  "Data Prevista para Realização": string;
}

const PedidosParcerias = () => {
  const [data, setData] = useState<Record<string, Contrato> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/files/pedidos.json");
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      } else {
        console.error("Failed to fetch data.json");
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {Object.keys(data).map((key) => (
        <div key={key} className="card">
          <h3>{key}</h3>
          <p>Nº Contrato: {data[key]["Nº Processo TRUST"]}</p>
          <p>Cliente: {data[key]["Código Ato Médico"]}</p>
          <p>Nº Cliente: {data[key]["Nível de Urgência"]}</p>
          <p>Fornecedor: {data[key]["Anexos"]}</p>
          <p>Nº Fornecedor: {data[key]["Observações"]}</p>
          <p>Nº Estabelecimento: {data[key]["Tipo de Pedido"]}</p>
          <p>Referência: {data[key]["Seguradora"]}</p>
          <p>Descrição: {data[key]["Descrição"]}</p>
          <p>Incluído na Avença: {data[key]["Estado do Pedido"]}</p>
          <p>Preço de Compra: {data[key]["Prestador"]}</p>
          <p>Preço de Venda: {data[key]["Data Prevista para Realização"]}</p>
        </div>
      ))}
    </div>
  );
};

export default PedidosParcerias;
