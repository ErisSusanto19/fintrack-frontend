import api from "@/lib/api";
import { ApiResponse, RecurringTransaction } from "@/types";
import { CreateRecurringPayload, UpdateRecurringPayload } from "@/types/recurring.type";
import { AxiosResponse } from "axios";

export const getRecurringTransactions = async (): Promise<ApiResponse<RecurringTransaction[]>> => {
    const response = await api.get<ApiResponse<RecurringTransaction[]>>('/recurring-transactions')
    return response.data
}

export const getRecurringTransactionById = async (recurringId: string): Promise<ApiResponse<RecurringTransaction>> => {
    const response = await api.get<ApiResponse<RecurringTransaction>>(`/recurring-transactions/${recurringId}`)
    return response.data
}

export const createRecurringTransaction = async (recurringData: CreateRecurringPayload): Promise<ApiResponse<RecurringTransaction>> => {
    const response = await api.post<ApiResponse<RecurringTransaction>>('/recurring-transactions', recurringData)
    return response.data
}

export const updateRecurringTransaction = async ({id, data}: UpdateRecurringPayload): Promise<ApiResponse<RecurringTransaction>> => {
    const response = await api.put<ApiResponse<RecurringTransaction>>(`/recurring-transactions/${id}`, data)
    return response.data
}

export const deleteRecurringTransaction = async (recurringId: string): Promise<AxiosResponse> => {
    const response = await api.delete<AxiosResponse>(`/recurring-transactions/${recurringId}`)
    return response
}