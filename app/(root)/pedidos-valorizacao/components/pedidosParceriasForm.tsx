"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { pedidosFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const PedidosForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = pedidosFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "Nº Processo TRUST": "",
      "Data Prevista para Realização": "",
      "Código Ato Médico": "",
      "Nível de Urgência": "",
      Anexos: "",
      Observações: "",
      "Tipo de Pedido": "",
      Seguradora: "",
      Descrição: "",
      Prestador: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const formData = {
      ...data,
      Anexos: [{ url: "", filename: "" }],
      "Created By": { email: "", name: "" },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.airtable.com/v0/appmwRIcj4SwGz9qb/Pedidos/",
      headers: {
        Authorization:
          "Bearer patzzfeQfHqi8uLLM.9090980443a7741692bbc8993ad9b83c7a63cd978ffd725580eeeeda1c5c5c76",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ fields: formData }),
    };

    try {
      await axios.request(config);
      router.push("parcerias-pedidos");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pedidos-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href="pedidos-valorizacao"
          className="cursor-pointer flex items-center gap-2"
        >
          <Image
            src="/icons/logo.svg"
            width={52}
            height={52}
            alt="Trust logo"
          />
          <h1 className="text-[32px]  font-sans-serif font-bold text-black-1 mt-2 pl-2">
            FORMULÁRIO
          </h1>
          <h1 className="text-[20px]  font-sans-serif font-semibold text-black-1 mt-4">
            Atos Médicos / Médicos
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900 font-sans-serif"></h1>
        </div>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-4">
            <CustomInput
              control={form.control}
              name="Nº Processo TRUST"
              label="Nº Processo TRUST"
              placeholder="Nº Processo TRUST"
              id="processo-trust"
            />
            <CustomInput
              control={form.control}
              name="Data Prevista para Realização"
              label="Data Prevista para Realização"
              placeholder="Data Prevista para Realização"
              id="data-prevista"
            />
          </div>
          <CustomInput
            control={form.control}
            name="Código Ato Médico"
            label="Código Ato Médico"
            placeholder="Código Ato Médico"
            id="codigo-ato-medico"
          />
          <CustomInput
            control={form.control}
            name="Nível de Urgência"
            label="Nível de Urgência"
            placeholder="Nível de Urgência"
            id="nivel-urgencia"
          />
          <div className="flex gap-4">
            <CustomInput
              control={form.control}
              name="Anexos"
              label="Anexos"
              placeholder="Anexos"
              id="anexos"
            />
            <CustomInput
              control={form.control}
              name="Observações"
              label="Observações"
              placeholder="Observações"
              id="observacoes"
            />
          </div>
          <div className="flex gap-4">
            <CustomInput
              control={form.control}
              name="Tipo de Pedido"
              label="Tipo de Pedido"
              placeholder="Tipo de Pedido"
              id="tipo-pedido"
            />
            <CustomInput
              control={form.control}
              name="Seguradora"
              label="Seguradora"
              placeholder="Seguradora"
              id="seguradora"
            />
          </div>
          <div className="flex gap-4">
            <CustomInput
              control={form.control}
              name="Descrição"
              label="Descrição"
              placeholder="Descrição"
              id="descricao"
            />
            <CustomInput
              control={form.control}
              name="Prestador"
              label="Prestador"
              placeholder="Prestador"
              id="prestador"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default PedidosForm;
