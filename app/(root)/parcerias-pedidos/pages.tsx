import React from "react";
import TabelaPedidosParcerias from "@/components/ui/tabelaPedidosParcerias";
import { UserNav } from "@/app/(root)/parcerias-pedidos/components/user-nav";
import { Card } from "@/components/ui/card";

const ParceriasPedidos = () => {
  return (
    <section className="pedidos p-4">
      <div className="flex h-full">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                PARCERIAS - PEDIDOS
              </h2>
              <p className="text-muted-foreground text-12">
                Lista de pedidos de parcerias.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UserNav />
            </div>
          </div>
          <Card className="bg-white p-4 flex-grow overflow-x-hidden">
            <TabelaPedidosParcerias />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ParceriasPedidos;
