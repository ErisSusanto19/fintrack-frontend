import { Budget } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as budgetsApi from './budgets.api'
import { CreateBudgetPayload, UpdateBudgetPayload } from "@/types/budgets.type";

export const loadBudgets = createAsyncThunk<Budget[], void, { rejectValue: string}>(
    'budgets/load',
    async (_, { rejectWithValue }) => {
        try {
            const response = await budgetsApi.getBudgets()

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Fetch budget failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.';
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadBudgetById = createAsyncThunk<Budget, string, { rejectValue: string}>(
    'budgets/loadById',
    async (budgetId, { rejectWithValue }) => {
        try {
            const response = await budgetsApi.getBudgetById(budgetId)

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Fetch budget by id failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.';
            return rejectWithValue(errorMessage)
        }
    }
)

export const addBudget = createAsyncThunk<Budget, CreateBudgetPayload, { rejectValue: string}>(
    'budgets/add',
    async (budgetData, { rejectWithValue }) => {
        try {
            const response = await budgetsApi.createBudget(budgetData)

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Create budget failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.';
            return rejectWithValue(errorMessage)
        }
    }
)

export const editBudget = createAsyncThunk<Budget, UpdateBudgetPayload, { rejectValue: string}>(
    'budgets/edit',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await budgetsApi.updateBudget({id, data})

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Update budget failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.';
            return rejectWithValue(errorMessage)
        }
    }
)

export const removeBudget = createAsyncThunk<string, string, { rejectValue: string}>(
    'budgets/remove',
    async (budgetId, { rejectWithValue }) => {
        try {
            const response = await budgetsApi.deleteBudget(budgetId)

            if(response.status == 200 || response.status == 204){
                return budgetId
            } else {
                return rejectWithValue('Delete budget failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.';
            return rejectWithValue(errorMessage)
        }
    }
)