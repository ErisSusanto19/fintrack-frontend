export interface CreateBudgetPayload {
    categoryId: string | null;
    year: number;
    month: number;
    amountLimit: number;
}

export interface UpdateBudgetPayload {
    id: string;
    data: {
        amountLimit: number;
    }
}