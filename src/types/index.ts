export type AccountType = 'CASH' | 'BANK' | 'EWALLET' | 'CREDIT_CARD' | 'INVESTMENT';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
    id: string;
    email: string;
    full_name: string;
}

export interface Account {
    id: string;
    user_id: string;
    name: string;
    type: AccountType;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    type: TransactionType;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    account_id: string;
    category_id?: string | null;
    transfer_id?: string | null;
    type: TransactionType;
    amount: number;
    transaction_date: string; //YYYY-MM-DD
    description: string;
    created_at: string;
    updated_at: string;
    attachments: Attachment[];
}

export interface Attachment {
    id: string;
    transaction_id: string;
    file_name: string;
    mime_type: string;
    storage_key: string;
    file_size_bytes: number;
    created_at: string
    url?: string | null;
}

export interface Budget {
    id: string;
    user_id: string;
    category_id?: string | null;
    month: number;
    year: number;
    amount_limit: number;
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