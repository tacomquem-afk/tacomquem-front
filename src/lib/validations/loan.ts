import { z } from "zod";

export const createLoanSchema = z.object({
  borrowerEmail: z
    .string()
    .min(1, "Email de quem vai pegar o item é obrigatório")
    .email("Email inválido"),
  expectedReturnDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || !Number.isNaN(new Date(value).getTime()),
      "Data de devolução inválida"
    ),
  lenderNotes: z
    .string()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateLoanFormData = z.infer<typeof createLoanSchema>;
