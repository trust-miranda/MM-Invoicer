import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "message/rfc822",
  "application/msword",
];

export const formSchema = z.object({
  "Nº Processo TRUST": z
    .number({ message: "Nº Processo TRUST em falta" })
    .min(1, "O Nº Processo TRUST deve ter pelo menos 1 dígito"),
  Prestador: z.string({ message: "Prestador em falta" }),
  "Nível de Urgência": z.string().optional(),
  "Tipo de Pedido": z.string(),
  "Código Ato Médico": z.string(),
  Descrição: z.string(),
  "Data Prevista para Realização": z.string().optional(),
  Anexos: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `O tamanho do ficheiro deve ser menor que ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Apenas os seguintes tipos de ficheiro são permitidos: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}.`
    )
    .optional()
    .nullable(),
  Seguradora: z.string(),
  Observações: z.string(),
  "Created By": z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;
