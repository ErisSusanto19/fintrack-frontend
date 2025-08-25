import { CashflowTrend, CategoryBreakdown, DashboardOverview } from "@/types"
import { createAsyncThunk } from "@reduxjs/toolkit"
import * as dashboardApi from './dashboard.api'

export const loadOverview = createAsyncThunk<DashboardOverview, {year: number, month: number}, { rejectValue: string}>(
    'dashboard/overview',
    async ({year, month}, { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getOverview(year, month);
            
            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch overview report failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage);
        }
    }
)

export const loadCategoryBreakdown = createAsyncThunk<CategoryBreakdown[], {year: number, month: number}, { rejectValue: string}>(
    'dashboard/categoryBreakdown',
    async ({year, month}, { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getCategoryBreakdown(year, month);
            
            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch category breakdown report failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage);
        }
    }
)

export const loadCashflowTrend = createAsyncThunk<CashflowTrend[], { startDate: string, endDate: string }, { rejectValue: string }>(
    'dashboard/cashflowTrend',
    async ({startDate, endDate}, {rejectWithValue}) => {
        try {
            const response = await dashboardApi.getCashflowTrend(startDate, endDate)

            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch cashfloe trend report failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage);
        }
    }
)