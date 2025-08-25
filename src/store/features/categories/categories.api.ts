import api from "@/lib/api";
import { ApiResponse, Category, TransactionType } from "@/types";
import { AxiosResponse } from "axios";

export interface CreateCategoryPayload {
    name: string;
    type: TransactionType;
}

export interface UpdateCategoryPayload {
    id: string;
    data: {
        name: string;
    }
}

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data
}

export const createCategory = async (categoryData: CreateCategoryPayload): Promise<ApiResponse<Category>> => {
    const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return response.data
}

export const getCategoryById = async (categoryId: string): Promise<ApiResponse<Category>> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${categoryId}`)
    return response.data
}

export const updateCategory = async ({id, data}: UpdateCategoryPayload): Promise<ApiResponse<Category>> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data
}

export const deleteCategory = async (categoryId: string): Promise<AxiosResponse> => {
    const response = await api.delete<AxiosResponse>(`/categories/${categoryId}`)
    return response
}