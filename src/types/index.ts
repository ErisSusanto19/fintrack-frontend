export type AccountType = 'CASH' | 'BANK' | 'EWALLET' | 'CREDIT_CARD' | 'INVESTMENT';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
    id: string;
    email: string;
    fullName: string;
}

export interface Account {
    id: string;
    userId: string;
    name: string;
    type: AccountType;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    userId: string;
    name: string;
    type: TransactionType;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  categoryId: string | null;
  categoryName: string | null;
  type: TransactionType;
  amount: number;
  transactionDate: string; // 'YYYY-MM-DD'
  description: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface Budget {
    id: string;
    categoryId?: string | null;
    categoryName?: string | null;
    month: number;
    year: number;
    amountLimit: number;
    amountSpent: number;
    remainingAmount: number;
    percentageSpent: number;
}

export interface RecurringTransaction {
  id: string;
  accountId: string;
  accountName?: string;
  categoryId: string;
  categoryName?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  cronExpression: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isActive: boolean;
  lastExecutionDate: string | null;
}

export interface DashboardOverview {
    totalIncome: number;
    totalExpense: number;
    netCashFlow: number;
}

export interface CategoryBreakdown {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    percentage: number;
}

export interface CashflowTrend {
    date: string;
    income: number;
    expense: number;
}

export interface ApiError {
    code: string;
    message: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: ApiError | null;
}

export interface PaginatedData<T> {
    content: T[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    last: boolean
}

export interface PaginatedApiResponse<T> {
    success: boolean;
    data: PaginatedData<T> | null;
    error: ApiError | null
}