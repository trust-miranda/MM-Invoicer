import PedidosForm from "./components/pedidosParceriasForm";
import React from "react";

const Pedidos = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <PedidosForm type={""} />
    </section>
  );
};
export default Pedidos;
