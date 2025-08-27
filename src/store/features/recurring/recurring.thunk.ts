import { RecurringTransaction } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as recurringApi from './recurring.api'
import { CreateRecurringPayload, UpdateRecurringPayload } from "@/types/recurring.type";

export const loadRecurringTransactions = createAsyncThunk<RecurringTransaction[], void, { rejectValue: string}>(
    'recurring/load',
    async (_, { rejectWithValue }) => {
        try {
            const response = await recurringApi.getRecurringTransactions()

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Fetch recurring transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured'
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadRecurringTransactionById = createAsyncThunk<RecurringTransaction, string, { rejectValue: string}>(
    'recurring/loadById',
    async (recurringId, { rejectWithValue }) => {
        try {
            const response = await recurringApi.getRecurringTransactionById(recurringId)

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Fetch recurring transaction by id failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured'
            return rejectWithValue(errorMessage)
        }
    }
)

export const addRecurringTransaction = createAsyncThunk<RecurringTransaction, CreateRecurringPayload, { rejectValue: string}>(
    'recurring/add',
    async (recurringData, { rejectWithValue }) => {
        try {
            const response = await recurringApi.createRecurringTransaction(recurringData)

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Create recurring transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured'
            return rejectWithValue(errorMessage)
        }
    }
)

export const editRecurringTransaction = createAsyncThunk<RecurringTransaction, UpdateRecurringPayload, { rejectValue: string}>(
    'recurring/edit',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await recurringApi.updateRecurringTransaction({id, data})

            if(response.success && response.data){
                return response.data
            } else {
                return rejectWithValue(response.error?.message || 'Update recurring transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured'
            return rejectWithValue(errorMessage)
        }
    }
)

export const removeRecurringTransaction = createAsyncThunk<string, string, { rejectValue: string}>(
    'recurring/remove',
    async (recurringId, { rejectWithValue }) => {
        try {
            const response = await recurringApi.deleteRecurringTransaction(recurringId)

            if(response.status == 200 || response.status == 204){
                return recurringId
            } else {
                return rejectWithValue('Delete recurring transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured'
            return rejectWithValue(errorMessage)
        }
    }
)