import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter letra maiúscula, minúscula e número"
    ),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Senha é obrigatória"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter letra maiúscula, minúscula e número"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
