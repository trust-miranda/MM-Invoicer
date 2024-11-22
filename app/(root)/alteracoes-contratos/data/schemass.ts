import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  bistamp: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  nrDossier: z.number(),
  Cliente: z.string(),
  nomeFornecedor: z.string(),
  ref: z.string(),
  Descricao: z.string(),
  precoCompra: z.number(),
  precoVendaCliente: z.number(),
  ValorExcecao: z.number(),
  precoCompraAnterior: z.number(),
  UltimaAtualizacao: z.date(),
});

export type Task = z.infer<typeof taskSchema>;
