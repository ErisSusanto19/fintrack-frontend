export interface CreateBudgetPayload {
    categoryId: string;
    year: number;
    month: number;
    amountLimit: number;
}

export interface UpdateBudgetPayload {
    id: string;
    data: CreateBudgetPayload
}