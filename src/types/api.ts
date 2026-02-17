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

export type UpdateItemInput = {
  name?: string;
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

export type PublicLoanInfo = {
  itemName: string;
  itemImages: string[];
  lenderName: string;
  expectedReturnDate: string | null;
  lenderNotes: string | null;
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

export type Notification = {
  id: string;
  loanId: string | null;
  type: DashboardActivityType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  sentAt: string | null;
};

export type NotificationsReadFilter = "all" | "read" | "unread";

export type NotificationsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type NotificationsResponse = {
  notifications: Notification[];
  pagination: NotificationsPagination;
  unreadCount: number;
};

export type NotificationMarkAsReadResponse = {
  id: string;
  read: boolean;
  updatedAt: string;
};

export type NotificationsMarkAllAsReadResponse = {
  markedCount: number;
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

export type DashboardSearchItem = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export type DashboardSearchFriend = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  lentCount: number;
  borrowedCount: number;
};

export type DashboardSearchResponse = {
  query: string;
  items: DashboardSearchItem[];
  friends: DashboardSearchFriend[];
  meta: {
    itemCount: number;
    friendCount: number;
    limit: number;
  };
};

export type Friend = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  lentCount: number;
  borrowedCount: number;
};

// Loans History types
export type LoansHistoryDirection = "all" | "lent" | "borrowed";

export type LoansHistoryCounts = {
  all: number;
  lent: number;
  borrowed: number;
};

export type LoansHistoryResponse = {
  loans: Loan[];
  counts: LoansHistoryCounts;
};
