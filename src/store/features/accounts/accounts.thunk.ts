import { Account } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as accountApi from "./accounts.api";
import { CreateAccountPayload, UpdateAccountPayload } from "@/types/accounts.type";

export const loadAccounts = createAsyncThunk<Account[], void, { rejectValue: string }>(
    'accounts/load',
    async (_, { rejectWithValue }) => {
        try {
            const response = await accountApi.getAccounts();
            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch accounts failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const addAccount = createAsyncThunk<Account, CreateAccountPayload, { rejectValue: string }>(
    'accounts/add',
    async (accountData, { rejectWithValue }) => {
        try {
            const response = await accountApi.createAccount(accountData);

            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Create account failed.')
            }
            
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadAccountById = createAsyncThunk<Account, string, { rejectValue: string}>(
    'accounts/loadById',
    async (accountId, { rejectWithValue }) => {
        try {
            const response = await accountApi.getAccountById(accountId);
            
            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch account by id failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const editAccount = createAsyncThunk<Account, UpdateAccountPayload, { rejectValue: string }>(
  'accounts/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await accountApi.updateAccount({ id, data });
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error?.message || 'Failed to update account.');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'An unexpected error occurred.');
    }
  }
);

export const removeAccount = createAsyncThunk<string, string, { rejectValue: string }>(
    'accounts/remove',
    async (accountId, { rejectWithValue }) => {
        try {
            const response = await accountApi.deleteAccount(accountId) 

            if(response.status === 200 || response.status === 204){
                return accountId;
            } else{
                return rejectWithValue('Delete account failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)