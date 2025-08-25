import { Transaction } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { addTransaction, editTransaction, loadTransactionById, loadTransactions, removeTransaction } from "./transactions.thunk";

interface TransactionState {
    items: Transaction[];
    selectedItem: Transaction | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TransactionState = {
    items: [],
    selectedItem: null,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    loading: 'idle',
    error: null
}

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //LOAD
            .addCase(loadTransactions.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(loadTransactions.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = action.payload.content;
                state.page = action.payload.page;
                state.size = action.payload.size;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
                state.last = action.payload.last;
            })
            .addCase(loadTransactions.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })

            //LOAD BY ID
            .addCase(loadTransactionById.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(loadTransactionById.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.selectedItem = action.payload;
            })
            .addCase(loadTransactionById.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })

            //ADD
            .addCase(addTransaction.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items.unshift(action.payload);
                state.totalElements += 1;
                if (state.items.length > state.size) {
                    state.items.pop();
                }
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })

            //EDIT
            .addCase(editTransaction.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(editTransaction.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                state.items[index] = action.payload;
                }
            })
            .addCase(editTransaction.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })

            //REMOVE
            .addCase(removeTransaction.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(removeTransaction.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = state.items.filter(t => t.id !== action.payload);
                state.totalElements -= 1;
            })
            .addCase(removeTransaction.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            });
    },
})

export const { setCurrentPage } = transactionsSlice.actions

export default transactionsSlice.reducer