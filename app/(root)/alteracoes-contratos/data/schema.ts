import { z } from "zod";

// Define schema with defaults for each field
export const taskSchema = z.object({
  bistamp: z.string().default(""),
  status: z.string().default("Por Tratar"),
  label: z.string().default(""),
  priority: z.string().default("Baixa"),
  nrDossier: z.number().default(0),
  Cliente: z.string().default(""),
  nomeFornecedor: z.string().default(""),
  ref: z.string().default(""),
  Descricao: z.string().default(""),
  precoCompra: z.number().default(0),
  precoVendaCliente: z.number().default(0),
  ValorExcecao: z.number().default(0),
  precoCompraAnterior: z.number().default(0),
  UltimaAtualizacao: z.date().default(new Date()),
});

export type Task = z.infer<typeof taskSchema>;
