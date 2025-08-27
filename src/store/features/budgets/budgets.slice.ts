import { Budget } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { addBudget, editBudget, loadBudgetById, loadBudgets, removeBudget } from "./budgets.thunk";

interface BudgetState {
    items: Budget[];
    selectedItem: Budget | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BudgetState = {
    items: [],
    selectedItem: null,
    loading: 'idle',
    error: null
}

const budgetsSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //LOAD
            .addCase(loadBudgets.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadBudgets.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = action.payload
            })
            .addCase(loadBudgets.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //LOAD BY ID
            .addCase(loadBudgetById.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadBudgetById.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.selectedItem = action.payload
            })
            .addCase(loadBudgetById.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //ADD
            .addCase(addBudget.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(addBudget.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items.push(action.payload)
            })
            .addCase(addBudget.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //EDIT
            .addCase(editBudget.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(editBudget.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                const index = state.items.findIndex(budget => budget.id == action.payload.id)
                if(index !== -1){
                    state.items[index] = action.payload
                }
            })
            .addCase(editBudget.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //REMOVE
            .addCase(removeBudget.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(removeBudget.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = state.items.filter(budget => budget.id !== action.payload)
            })
            .addCase(removeBudget.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })
    }
})

export default budgetsSlice.reducer;