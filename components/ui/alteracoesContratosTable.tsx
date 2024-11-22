"use client";
import React, { useEffect, useState } from "react";

interface Contrato {
  nrDossier: string;
  Cliente: string;
  nrCliente: string;
  nomeFornecedor: string;
  nrFornecedor: string;
  nrEstabelecimento: string;
  ref: string;
  Descricao: string;
  incluidoAvenca: string;
  precoCompra: string;
  precoVendaCliente: string;
  ValorExcecao: string;
  precoCompraAnterior: string;
  dataDossier: string;
  dataInicio: string;
  dataFim: string;
  UltimaAtualizacao: string;
}

const AlteracoesContratos = () => {
  const [data, setData] = useState<Record<string, Contrato> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/files/data.json");
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
          <p>Nº Contrato: {data[key].nrDossier}</p>
          <p>Cliente: {data[key].Cliente}</p>
          <p>Nº Cliente: {data[key].nrCliente}</p>
          <p>Fornecedor: {data[key].nomeFornecedor}</p>
          <p>Nº Fornecedor: {data[key].nrFornecedor}</p>
          <p>Nº Estabelecimento: {data[key].nrEstabelecimento}</p>
          <p>Referência: {data[key].ref}</p>
          <p>Descrição: {data[key].Descricao}</p>
          <p>Incluído na Avença: {data[key].incluidoAvenca}</p>
          <p>Preço de Compra: {data[key].precoCompra}</p>
          <p>Preço de Venda: {data[key].precoVendaCliente}</p>
          <p>Preço de Venda de Exceção: {data[key].ValorExcecao}</p>
          <p>Preço de Compra Anterior: {data[key].precoCompraAnterior}</p>
          <p>Data de Criação do Contrato: {data[key].dataDossier}</p>
          <p>Data de Início do Contrato: {data[key].dataInicio}</p>
          <p>Data de Término do Contrato: {data[key].dataFim}</p>
          <p>Data da Última Atualização: {data[key].UltimaAtualizacao}</p>
        </div>
      ))}
    </div>
  );
};

export default AlteracoesContratos;
