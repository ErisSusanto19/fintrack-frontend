import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from './auth.api';
import { User } from "@/types";
import { AuthLoginPayload, AuthLoginSuccessPayload } from "@/types/auth.type";

export const loginUser = createAsyncThunk<AuthLoginSuccessPayload, AuthLoginPayload, { rejectValue: string }>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);

            if(response.success && response.data){
                return response.data;
            } else{
                return rejectWithValue(response.error?.message || 'Login failed.');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.';
            return rejectWithValue(errorMessage);
        }
    }
)