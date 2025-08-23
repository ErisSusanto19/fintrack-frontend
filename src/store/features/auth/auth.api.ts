import api from '@/lib/api';
import { ApiResponse, User } from '@/types';
import { AuthLoginPayload, AuthLoginSuccessPayload } from '@/types/auth.type';

export const login = async (credentials: AuthLoginPayload) : Promise<ApiResponse<AuthLoginSuccessPayload>> => {
    const response = await api.post<ApiResponse<AuthLoginSuccessPayload>>('/auth/login', credentials);
    return response.data;
}