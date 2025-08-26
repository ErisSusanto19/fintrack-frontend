import api from "@/lib/api";
import { ApiResponse, PaginatedApiResponse, Transaction } from "@/types";
import { CreateTransactionPayload, UpdateTransactionPayload } from "@/types/transactions.type";
import { AxiosResponse } from "axios";

export const getTransactions = async (page: number, size: number): Promise<PaginatedApiResponse<Transaction>> => {
    const response = await api.get<PaginatedApiResponse<Transaction>>('/transactions', {
        params: {page, size}
    })

    return response.data;
}

export const getTransactionById = async (transactionId: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${transactionId}`)
    return response.data;
}

export const createTransaction = async (transactionData: CreateTransactionPayload): Promise<ApiResponse<Transaction>> => {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', transactionData)
    return response.data
}

export const updateTransaction = async ({id, data}: UpdateTransactionPayload): Promise<ApiResponse<Transaction>> => {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data)
    return response.data
}

export const deleteTransaction = async (transactionId: string): Promise<AxiosResponse> => {
    const response = await api.get<AxiosResponse>(`/transactions/${transactionId}`)
    return response;
}