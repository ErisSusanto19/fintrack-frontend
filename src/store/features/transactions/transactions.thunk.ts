import { PaginatedApiResponse, PaginatedData, Transaction } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as transactionsApi from './transactions.api'
import { CreateTransactionPayload, UpdateTransactionPayload } from "@/types/transactions.type";

export const loadTransactions = createAsyncThunk<PaginatedData<Transaction>, {page: number, size: number}, {rejectValue: string}>(
    'transactions/load',
    async ({page, size}, { rejectWithValue }) => {
        try {
            const response = await transactionsApi.getTransactions(page, size)

            if(response.success && response.data){
                return response.data;
            } else{
                return rejectWithValue(response.error?.message || 'Fetch transactions failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadTransactionById = createAsyncThunk<Transaction, string, {rejectValue: string}>(
    'transactions/loadById',
    async (transactionId, { rejectWithValue }) => {
        try {
            const response = await transactionsApi.getTransactionById(transactionId)

            if(response.success && response.data){
                return response.data;
            } else{
                return rejectWithValue(response.error?.message || 'Fetch transaction by id failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const addTransaction = createAsyncThunk<Transaction, CreateTransactionPayload, {rejectValue: string}>(
    'transactions/add',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await transactionsApi.createTransaction(transactionData)

            if(response.success && response.data){
                return response.data;
            } else{
                return rejectWithValue(response.error?.message || 'Create transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const editTransaction = createAsyncThunk<Transaction, UpdateTransactionPayload, {rejectValue: string}>(
    'transactions/edit',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await transactionsApi.updateTransaction({id, data})

            if(response.success && response.data){
                return response.data;
            } else{
                return rejectWithValue(response.error?.message || 'Update transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const removeTransaction = createAsyncThunk<string, string, {rejectValue: string}>(
    'transactions/remove',
    async (transactionId, { rejectWithValue }) => {
        try {
            const response = await transactionsApi.deleteTransaction(transactionId)

            if(response.status == 200 || response.status == 204){
                return transactionId;
            } else{
                return rejectWithValue('Delete transaction failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)