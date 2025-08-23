import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api'
import { User } from '../../types'

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginSuccessPayload {
    accessToken: string;
    refreshToken: string;
    user: User;
}

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (loginData: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', loginData)            

            if(response.data.success){
                return response.data.data as LoginSuccessPayload;
            } else{
                return rejectWithValue(response.data.error.message)
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'Login failed.'
            return rejectWithValue(errorMessage);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogout: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginSuccessPayload>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.user = action.payload.user
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export const { 
    setLogout,
    setUser
} = authSlice.actions;

export default authSlice.reducer;