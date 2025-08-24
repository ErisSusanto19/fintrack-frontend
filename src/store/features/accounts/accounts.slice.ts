import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '@/types'
import { addAccount, editAccount, loadAccountById, loadAccounts, removeAccount } from './accounts.thunk';

interface AccountState {
    items: Account[];
    selectedItem: Account | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AccountState = {
    items: [],
    selectedItem: null,
    loading: 'idle',
    error: null
}

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        clearSelectedAccount: (state) => {
            state.selectedItem = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //LOAD
            .addCase(loadAccounts.pending, (state) => {
                state.loading = 'pending';
                state.error = null
            })
            .addCase(loadAccounts.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = action.payload
            })
            .addCase(loadAccounts.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //LOAD BY ID
            .addCase(loadAccountById.pending, (state) => {
                state.loading = 'pending';
                state.selectedItem = null;
            })
            .addCase(loadAccountById.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.selectedItem = action.payload;
            })
            .addCase(loadAccountById.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })

            //ADD
            .addCase(addAccount.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(addAccount.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items.push(action.payload)
            })
            .addCase(addAccount.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            // EDIT
            .addCase(editAccount.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(editAccount.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                const index = state.items.findIndex(acc => acc.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(editAccount.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })

            // REMOVE
            .addCase(removeAccount.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(removeAccount.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = state.items.filter(acc => acc.id !== action.payload);
            })
            .addCase(removeAccount.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const {clearSelectedAccount } = accountSlice.actions

export default accountSlice.reducer;