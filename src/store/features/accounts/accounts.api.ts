import api from "@/lib/api";
import { Account, ApiResponse } from "@/types";
import { CreateAccountPayload, UpdateAccountPayload } from "@/types/accounts.type";
import { AxiosResponse } from "axios";

export const getAccounts = async (): Promise<ApiResponse<Account[]>> => {
    const response = await api.get<ApiResponse<Account[]>>('/accounts');
    return response.data
}

export const createAccount = async (accountData: CreateAccountPayload): Promise<ApiResponse<Account>> => {
    const response = await api.post<ApiResponse<Account>>('/accounts', accountData);
    return response.data;
}

export const getAccountById = async (accountId: string): Promise<ApiResponse<Account>> => {
    const response = await api.get<ApiResponse<Account>>(`/accounts/${accountId}`)
    return response.data
}

export const updateAccount = async ({ id, data }: UpdateAccountPayload): Promise<ApiResponse<Account>> => {
  const response = await api.put<ApiResponse<Account>>(`/accounts/${id}`, data);
  return response.data;
};

export const deleteAccount = async (accountId: string): Promise<AxiosResponse> => {
    const response = await api.delete<AxiosResponse>(`/accounts/${accountId}`)
    return response;
}