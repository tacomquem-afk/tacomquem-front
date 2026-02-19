import { z } from "zod";

const adminRoles = ["ANALYST", "SUPPORT", "MODERATOR", "SUPER_ADMIN"] as const;

export const addAdminSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  role: z.enum(adminRoles, { error: "Função é obrigatória" }),
});

export const changeAdminRoleSchema = z.object({
  role: z.enum(adminRoles, { error: "Função é obrigatória" }),
});

export const addBetaUserSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

export type AddAdminFormData = z.infer<typeof addAdminSchema>;
export type ChangeAdminRoleFormData = z.infer<typeof changeAdminRoleSchema>;
export type AddBetaUserFormData = z.infer<typeof addBetaUserSchema>;
