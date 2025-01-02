import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";

interface SidebarAccordionProps {
  isCollapsed: boolean;
}

export function SidebarAccordion({ isCollapsed }: SidebarAccordionProps) {
  return (
    <div className={isCollapsed ? "" : ""}>
      <Accordion
        type="single"
        collapsible
        className={`${isCollapsed ? "border-hidden" : "w-full"}`}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className={isCollapsed ? "hidden" : ""}>
            PARCERIAS
          </AccordionTrigger>
          <Link href={"dashboard-parcerias"}>
            <Image
              src="/icons/credit-card.svg"
              width={34}
              height={34}
              alt="Trust Parcerias"
              className={`${
                isCollapsed ? "size-8 max-xl:size-14 mb-6" : "hidden"
              }`}
            />
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Dashboard
            </AccordionContent>
          </Link>
          <Link href={"pedidos-valorizacao"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Pedidos de Atos/Médicos - Formulário
            </AccordionContent>
          </Link>
          <Link href={"parcerias-pedidos"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Pedidos de Atos/Médicos - Tabela
            </AccordionContent>
          </Link>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className={isCollapsed ? "hidden" : ""}>
            FINANCEIRO
          </AccordionTrigger>
          <Link href={"invoicer"}>
            <Image
              src="/icons/dollar-circle.svg"
              width={34}
              height={34}
              alt="Trust Financeiro"
              className={`${
                isCollapsed ? "size-8 max-xl:size-14 mb-6" : "hidden"
              }`}
            />
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Dashboard
            </AccordionContent>
          </Link>
          <Link href={"faturacao-automatica"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Faturação Automática
            </AccordionContent>
          </Link>
          <Link href={"faturacao-semi-automatica"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Faturação Semi-Automática
            </AccordionContent>
          </Link>
          <Link href={"creditos-automaticos"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Emissão de Créditos Automáticos
            </AccordionContent>
          </Link>
          <Link href={"rossum"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Rossum
            </AccordionContent>
          </Link>
          <Link href={"alteracoes-contratos"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Alterações a Contratos
            </AccordionContent>
          </Link>
          <AccordionContent
            className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
          >
            Acréscimos e Diferimentos
          </AccordionContent>
          <Link href={"tabela-precos-cliente"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Preços de Cliente
            </AccordionContent>
          </Link>
          <Link href={"tabela-precos-excecao"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Preços de Exceção
            </AccordionContent>
          </Link>
          <AccordionContent
            className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
          >
            Critérios/Regras de Faturação
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className={isCollapsed ? "hidden" : ""}>
            OPERAÇÕES
          </AccordionTrigger>
          <Image
            src="/icons/money-send.svg"
            width={34}
            height={34}
            alt="Trust Operacoes"
            className={`${
              isCollapsed ? "size-8 max-xl:size-14 mb-6" : "hidden"
            }`}
          />
          <AccordionContent
            className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
          >
            Dashboard
          </AccordionContent>
          <Link href={"/datanet"}>
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Datanet
            </AccordionContent>
          </Link>
          <AccordionContent
            className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
          >
            Pedidos de Estimativas
          </AccordionContent>
          <AccordionContent
            className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
          >
            Pedidos de Orçamentos
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className={isCollapsed ? "hidden" : ""}>
            ADMINISTRAÇÃO
          </AccordionTrigger>
          <Link href={"/"}>
            <Image
              src="/icons/home.svg"
              width={34}
              height={34}
              alt="Trust Administracao"
              className={`${
                isCollapsed ? "size-8 max-xl:size-14 mb-6" : "hidden"
              }`}
            />
            <AccordionContent
              className={isCollapsed ? "hidden" : "text-xs text-nowrap"}
            >
              Dashboard
            </AccordionContent>
          </Link>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
