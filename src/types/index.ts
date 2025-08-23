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
    userId: string;
    accountId: string;
    categoryId?: string | null;
    transferId?: string | null;
    type: TransactionType;
    amount: number;
    transactionDate: string; //YYYY-MM-DD
    description: string;
    createdAt: string;
    updatedAt: string;
    attachments: Attachment[];
}

export interface Attachment {
    id: string;
    transactionId: string;
    fileName: string;
    mimeType: string;
    storageKey: string;
    fileSizeBytes: number;
    createdAt: string
    url?: string | null;
}

export interface Budget {
    id: string;
    userId: string;
    categoryId?: string | null;
    month: number;
    year: number;
    amountLimit: number;
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