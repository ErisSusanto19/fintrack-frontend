import api from '@/lib/api';
import { ApiResponse } from '@/types';
import { 
    AuthLoginPayload, 
    AuthLoginSuccessPayload, 
    AuthRegisterPayload, 
    AuthRegisterSuccessPayload,
    AuthLogoutPayload
} from '@/types/auth.type';

export const login = async (credentials: AuthLoginPayload): Promise<ApiResponse<AuthLoginSuccessPayload>> => {
    const response = await api.post<ApiResponse<AuthLoginSuccessPayload>>('/auth/login', credentials);
    return response.data;
}

export const register = async (credentials: AuthRegisterPayload): Promise<ApiResponse<AuthRegisterSuccessPayload>> => {
    const response = await api.post<ApiResponse<AuthRegisterSuccessPayload>>('/auth/register', credentials);
    return response.data;
}

export const logout = async (payload: AuthLogoutPayload): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/logout', payload);
    return response.data;
}