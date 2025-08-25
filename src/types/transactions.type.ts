import { TransactionType } from ".";

export interface CreateTransactionPayload {
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string; // Format 'YYYY-MM-DD'
}

export interface UpdateTransactionPayloadData {
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string;
}

export interface UpdateTransactionPayload {
  id: string;
  data: UpdateTransactionPayloadData;
}