import api from "@/lib/api";
import { ApiResponse, Budget } from "@/types";
import { CreateBudgetPayload, UpdateBudgetPayload } from "@/types/budgets.type";
import { AxiosResponse } from "axios";

export const getBudgets = async (): Promise<ApiResponse<Budget[]>> => {
    const response = await api.get<ApiResponse<Budget[]>>('/budgets')
    return response.data;
}

export const createBudget = async (budgetData: CreateBudgetPayload): Promise<ApiResponse<Budget>> => {
    const response = await api.post<ApiResponse<Budget>>('/budgets', budgetData)
    return response.data;
}

export const getBudgetById = async (budgetId: string): Promise<ApiResponse<Budget>> => {
    const response = await api.get<ApiResponse<Budget>>(`/budgets/${budgetId}`)
    return response.data
}

export const updateBudget = async ({id, data}: UpdateBudgetPayload): Promise<ApiResponse<Budget>> => {
    const response = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, data)
    return response.data
}

export const deleteBudget = async (budgetId: string): Promise<AxiosResponse> => {
    const response = await api.get<AxiosResponse>(`/budgets/${budgetId}`)
    return response
}