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
export type LoanStatus = "pending" | "confirmed" | "returned" | "cancelled";

export type LoanListFilter =
  | "lent"
  | "borrowed"
  | "pending"
  | "confirmed"
  | "returned";

export type LoanParty = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type Loan = {
  id: string;
  item: Pick<Item, "id" | "name" | "images">;
  lender: LoanParty;
  borrower: LoanParty | null;
  borrowerEmail: string | null;
  status: LoanStatus;
  expectedReturnDate: string | null;
  lenderNotes: string | null;
  borrowerNotes: string | null;
  confirmedAt: string | null;
  returnedAt: string | null;
  createdAt: string;
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
  pendingLoans: number;
};

export type DashboardActivityType =
  | "loan_created"
  | "loan_confirmed"
  | "loan_returned"
  | "loan_reminder";

export type DashboardRecentActivity = {
  id: string;
  type: DashboardActivityType;
  message: string;
  createdAt: string;
  read: boolean;
};

export type DashboardPendingLoan = {
  id: string;
  itemName: string;
  borrowerEmail: string;
  createdAt: string;
};

export type DashboardActiveLoan = {
  id: string;
  itemName: string;
  itemImages: string[];
  otherParty: string;
  role: "lender" | "borrower";
  expectedReturnDate: string | null;
  confirmedAt: string;
};

export type Friend = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  lentCount: number;
  borrowedCount: number;
};
