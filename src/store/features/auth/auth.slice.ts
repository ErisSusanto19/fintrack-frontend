import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from './auth.thunk';
import { User } from '../../../types'
import { AuthLoginSuccessPayload } from '@/types/auth.type';

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: User | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
    loading: 'idle',
    error: null
}

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
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthLoginSuccessPayload>) => {
                state.loading = 'succeeded';
                state.isAuthenticated = true;
                state.token = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.user = action.payload.user
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { 
    setLogout,
    setUser
} = authSlice.actions;

export default authSlice.reducer;