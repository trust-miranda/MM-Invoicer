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
import { authFormSchema } from "@/lib/utils";
import { tree } from "next/dist/build/templates/app-page";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Sign up with Appwrite & create plain link token

      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={52}
            height={52}
            alt="Trust logo"
          />
          <h1 className="text-[32px]  font-sans-serif font-bold text-black-1 mt-2 pl-2">
            TRUST
          </h1>
          <h1 className="text-[20px]  font-sans-serif font-semibold text-black-1 mt-4">
            monitor
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900 font-sans-serif">
            {user
              ? "Vincular Conta"
              : type === "sign-in"
                ? "Iniciar Sessão"
                : "Novo Registo"}
            <p className="text-16 font-normal text-gray-600 ">
              {user
                ? "Vincule a sua conta para começar"
                : "Por favor, introduza as informações abaixo"}
            </p>
          </h1>
        </div>
      </header>
      {/*user ? ( */}
      {/* ) : ( */}
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="firstName"
                    label="Primeiro Nome"
                    placeholder=""
                  />
                  <CustomInput
                    control={form.control}
                    name="lastName"
                    label="Último Nome"
                    placeholder=""
                  />
                </div>
                {/* <CustomInput
                  control={form.control}
                  name="address1"
                  label="Morada"
                  placeholder="Morada"
                /> */}
                {/* <CustomInput
                  control={form.control}
                  name="city"
                  label="Cidade"
                  placeholder="Cidade"
                /> */}
                {/* <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="state"
                    label="Distrito"
                    placeholder="Ex: Porto"
                  /> */}
                {/* <CustomInput
                    control={form.control}
                    name="postalcode"
                    label="Código Postal"
                    placeholder="Ex: 4050-191"
                  /> */}
                {/* </div>
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="dateOfBirth"
                    label="Data de Nascimento"
                    placeholder="YYYY-MM-DD"
                  />
                  <CustomInput
                    control={form.control}
                    name="ssn"
                    label="NIF"
                    placeholder="Ex: 1234"
                  />
                </div> */}
              </>
            )}

            <CustomInput
              control={form.control}
              name="email"
              label="Email"
              placeholder=""
            />
            <CustomInput
              control={form.control}
              name="password"
              label="Password"
              placeholder=""
            />
            <div className="flex flex-col gap-4">
              {/*{RETIRAR A PARTE EM CIMA PARA BOTAO DE LOGIN MAIS PEQUENO} */}
              <Button type="submit" disabled={isLoading} className="form-btn">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp; A
                    carregar...
                  </>
                ) : type === "sign-in" ? (
                  "Iniciar Sessão"
                ) : (
                  "Novo Registo"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {" "}
            {type === "sign-in"
              ? "Ainda não tem conta?"
              : "Já tem conta registada?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="form-link"
          >
            {type === "sign-in" ? "Efetuar Registo" : "Iniciar Sessão"}
          </Link>
        </footer>
      </>
      {/* )} */}
    </section>
  );
};
export default AuthForm;
