import type { UserRole } from "./api";

// ── Analytics ─────────────────────────────────────────────

export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  totalLoans: number;
  activeLoans: number;
  pendingLoans: number;
};

export type AdminUserStats = {
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalUsers: number;
  growthRate: number;
};

export type AdminLoanStats = {
  loansToday: number;
  loansThisWeek: number;
  loansThisMonth: number;
  averageLoanDuration: number;
  returnRate: number;
};

// ── Users Management ──────────────────────────────────────

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
  loansCount: number;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: AdminPagination;
};

export type AdminUserDetailResponse = {
  user: AdminUser;
};

export type AdminBlockUserResponse = {
  id: string;
  isBlocked: boolean;
};

// ── Moderation ────────────────────────────────────────────

export type AdminModerationItem = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  owner: { id: string; name: string; email: string };
  isActive: boolean;
  createdAt: string;
  flaggedReason: string | null;
};

export type AdminModerationLoan = {
  id: string;
  item: { id: string; name: string };
  lender: { id: string; name: string; email: string };
  borrower: { id: string; name: string; email: string } | null;
  status: string;
  createdAt: string;
  flaggedReason: string | null;
};

// ── Admin Role Management ─────────────────────────────────

export type AdminRole = "ANALYST" | "SUPPORT" | "MODERATOR" | "SUPER_ADMIN";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: AdminRole;
  createdAt: string;
};

export type AdminAccountsResponse = {
  admins: AdminAccount[];
};

export type AdminAuditLogEntry = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetId: string | null;
  targetType: string | null;
  details: Record<string, unknown>;
  createdAt: string;
};

export type AdminAuditLogResponse = {
  logs: AdminAuditLogEntry[];
  pagination: AdminPagination;
};

export type CreateAdminInput = {
  userId: string;
  role: AdminRole;
};

export type UpdateAdminRoleInput = {
  role: AdminRole;
};

// ── Beta Program ──────────────────────────────────────────

export type BetaUser = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  addedAt: string;
};

export type BetaProgramResponse = {
  users: BetaUser[];
  total: number;
};

export type AddBetaUserInput = {
  email: string;
};

// ── Shared ────────────────────────────────────────────────

export type AdminPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
