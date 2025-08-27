export interface CreateRecurringPayload {
  accountId: string;
  categoryId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  cronExpression: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate?: string | null;
  description: string;
}

export interface UpdateRecurringData {
  amount?: number;
  cronExpression?: string;
  endDate?: string | null;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRecurringPayload {
  id: string;
  data: UpdateRecurringData;
}