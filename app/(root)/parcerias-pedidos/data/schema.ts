import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  "Nº Processo TRUST": z.string(),
  "Data Prevista para Realização": z.string(),
  "Código Ato Médico": z.string(),
  "Nível de Urgência": z.string(),
  Anexos: z.string(),
  Observações: z.string(),
  "Tipo de Pedido": z.string(),
  Seguradora: z.string(),
  Descrição: z.string(),
  "Estado do Pedido": z.string(),
  Prestador: z.string(),
  "Data de Conclusão": z.string(),
  "Data de Criação": z.string(),
  SLA: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
