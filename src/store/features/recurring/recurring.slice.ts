import { RecurringTransaction } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { addRecurringTransaction, editRecurringTransaction, loadRecurringTransactionById, loadRecurringTransactions, removeRecurringTransaction } from "./recurring.thunk";

interface RecurringTransactionState {
    items: RecurringTransaction[];
    selectedItem: RecurringTransaction | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RecurringTransactionState = {
    items: [],
    selectedItem: null,
    loading: 'idle',
    error: null
}

const recurringSlice = createSlice({
    name: 'recurring',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //LOAD
            .addCase(loadRecurringTransactions.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadRecurringTransactions.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = action.payload
            })
            .addCase(loadRecurringTransactions.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //LOAD BY ID
            .addCase(loadRecurringTransactionById.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadRecurringTransactionById.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.selectedItem = action.payload
            })
            .addCase(loadRecurringTransactionById.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //ADD
            .addCase(addRecurringTransaction.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(addRecurringTransaction.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items.push(action.payload)
            })
            .addCase(addRecurringTransaction.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //EDIT
            .addCase(editRecurringTransaction.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(editRecurringTransaction.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                const index = state.items.findIndex(rt => rt.id == action.payload.id)
                if(index !== -1){
                    state.items[index] = action.payload
                }
            })
            .addCase(editRecurringTransaction.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //REMOVE
            .addCase(removeRecurringTransaction.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(removeRecurringTransaction.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = state.items.filter(rt => rt.id !== action.payload)
            })
            .addCase(removeRecurringTransaction.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })
    }
})

export default recurringSlice.reducer;