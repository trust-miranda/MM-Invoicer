import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import CustomDropdown from "../../pedidos-valorizacao/components/dropdownPrestadores";
import seguradoras from "@/app/files/seguradoras.json";
import DropdownReferencias from "../../pedidos-valorizacao/components/dropdownReferencias";

const NewRecordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    "Nº Processo TRUST": "",
    Prestador: "",
    "Nível de Urgência": "",
    "Tipo de Pedido": "",
    "Código Ato Médico": "",
    Descrição: "",
    "Data Prevista para Realização": "",
    Anexos: [{ url: "", filename: "" }],
    Seguradora: "",
    Observações: "",
    "Created By": { email: "", name: "" },
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      Prestador: value,
    }));
  };

  const handleReferenciasDropdownChange = (
    codigo: string,
    descricao: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      "Código Ato Médico": codigo,
      Descrição: descricao,
    }));
  };

  const handleSeguradoraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Seguradora: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = JSON.stringify({ fields: formData });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.airtable.com/v0/appmwRIcj4SwGz9qb/Pedidos/",
      headers: {
        Authorization:
          "Bearer patzzfeQfHqi8uLLM.9090980443a7741692bbc8993ad9b83c7a63cd978ffd725580eeeeda1c5c5c76",
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      await axios.request(config);
      router.push("parcerias-pedidos");
    } catch (error) {
      console.error(error);
    }
  };

  // Separate "TODAS" from the rest of the seguradoras
  const todasSeguradora = seguradoras.find(
    (seguradora) => seguradora.Seguradora === "TODAS"
  );
  const otherSeguradoras = seguradoras.filter(
    (seguradora) => seguradora.Seguradora !== "TODAS"
  );

  // Sort other seguradoras alphabetically by nome
  const sortedSeguradoras = otherSeguradoras.sort((a, b) =>
    a.Seguradora.localeCompare(b.Seguradora)
  );

  // Append "TODAS" to the end of the sorted list
  if (todasSeguradora) {
    sortedSeguradoras.push(todasSeguradora);
  }

  return (
    <div className={`flex h-full max-h-screen overflow-hidden `}>
      <Card className="relative bg-white display-flex items-center justify-center w-[100%] my-4 mx-4 md:mx-6 md:my-6 overflow-x-hidden">
        <header className="border-b-[1px] border-b-gray-200 text-primary-foreground py-4 px-4 md:px-6 md:py-6">
          <div className="w-[100%] flex flex-row justify-between">
            <h1 className="text-sm font-bold">
              NOVO PEDIDO DE ATO MÉDICO / MÉDICO
            </h1>
            <h3 className="text-xs font-semibold">
              {new Date().toISOString().split("T")[0]}{" "}
            </h3>
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <input
            className="text-xs"
            type="text"
            name="Nº Processo TRUST"
            placeholder="Nº Processo TRUST"
            value={formData["Nº Processo TRUST"]}
            onChange={handleChange}
          />
          <CustomDropdown
            value={formData.Prestador}
            onChange={handleDropdownChange}
          />
          <select
            className="text-xs"
            name="Nível de Urgência"
            value={formData["Nível de Urgência"]}
            onChange={handleChange}
          >
            <option value="">Nível de Urgência</option>
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
          <select
            className="text-xs"
            name="Tipo de Pedido"
            value={formData["Tipo de Pedido"]}
            onChange={handleChange}
          >
            <option value="">Tipo de Pedido</option>
            <option value="Ato Médico">Ato Médico</option>
            <option value="Médico/Especialidade">Médico/Especialidade</option>
          </select>
          <DropdownReferencias
            className="text-xs"
            codigoValue={formData["Código Ato Médico"]}
            descricaoValue={formData.Descrição}
            onCodigoChange={(codigo) =>
              setFormData((prevData) => ({
                ...prevData,
                "Código Ato Médico": codigo,
              }))
            }
            onDescricaoChange={(descricao) =>
              setFormData((prevData) => ({
                ...prevData,
                Descrição: descricao,
              }))
            }
            onChange={handleReferenciasDropdownChange}
          />
          <input
            className="text-xs"
            type="text"
            name="Código Ato Médico"
            placeholder="Código Ato Médico"
            value={formData["Código Ato Médico"]}
            onChange={handleChange}
          />
          <input
            className="text-xs"
            type="text"
            name="Descrição"
            placeholder="Descrição"
            value={formData.Descrição}
            onChange={handleChange}
          />
          <input
            className="text-xs"
            type="date"
            name="Data Prevista para Realização"
            placeholder="Data Prevista para Realização"
            value={formData["Data Prevista para Realização"]}
            onChange={handleChange}
          />
          <select
            className="text-xs"
            name="Seguradora"
            value={formData.Seguradora}
            onChange={handleSeguradoraChange}
          >
            <option value="">Seguradora</option>
            {sortedSeguradoras.map((seguradora) => (
              <option key={seguradora.no} value={seguradora.Seguradora}>
                {seguradora.Seguradora}
              </option>
            ))}
          </select>
          <input
            className="text-xs"
            type="text"
            name="Observações"
            placeholder="Observações"
            value={formData.Observações}
            onChange={handleChange}
          />
          <input
            className="text-xs"
            type="email"
            name="Created By.email"
            placeholder="Created By Email"
            value={formData["Created By"].email}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                "Created By": {
                  ...prevData["Created By"],
                  email: e.target.value,
                },
              }))
            }
          />
          <input
            type="text"
            className="text-xs"
            name="Created By.name"
            placeholder="Created By Name"
            value={formData["Created By"].name}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                "Created By": {
                  ...prevData["Created By"],
                  name: e.target.value,
                },
              }))
            }
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs bg-green-100 border-green-200 text-green-600 hover:bg-green-200 hover:border-green-300"
          >
            Efetuar Pedido
          </button>
        </form>
      </Card>
    </div>
  );
};

export default NewRecordForm;
