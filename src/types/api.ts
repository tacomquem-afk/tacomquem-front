// User types
export type UserRole =
  | "USER"
  | "ANALYST"
  | "SUPPORT"
  | "MODERATOR"
  | "SUPER_ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  role: UserRole;
};

// Auth types
export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

// Item types
export type Item = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateItemInput = {
  name: string;
  description?: string;
  images?: string[];
};

// Loan types
export type LoanStatus = "PENDING" | "CONFIRMED" | "RETURNED" | "CANCELLED";

export type Loan = {
  id: string;
  itemId: string;
  lenderId: string;
  borrowerId: string;
  status: LoanStatus;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  lenderNotes?: string;
  borrowerNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLoanInput = {
  itemId: string;
  borrowerEmail: string;
  expectedReturnDate?: string;
  lenderNotes?: string;
};

// Dashboard types
export type DashboardStats = {
  totalItems: number;
  activeLoans: number;
  borrowedItems: number;
};

export type Friend = {
  id: string;
  name: string;
};
