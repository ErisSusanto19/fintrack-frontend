import { CashflowTrend, CategoryBreakdown, DashboardOverview } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { loadCashflowTrend, loadCategoryBreakdown, loadOverview } from "./dashboard.thunk";

interface DashboardState {
    overview: DashboardOverview | null;
    categoryBreakdown : CategoryBreakdown[];
    cashflowTrend : CashflowTrend[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DashboardState = {
    overview: null,
    categoryBreakdown: [],
    cashflowTrend: [],
    loading: 'idle',
    error: null
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            //Overview Monthly Report
            .addCase(loadOverview.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadOverview.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.overview = action.payload
            })
            .addCase(loadOverview.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //Category Breakdown Monthly Report
            .addCase(loadCategoryBreakdown.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadCategoryBreakdown.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.categoryBreakdown = action.payload
            })
            .addCase(loadCategoryBreakdown.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //Cashflow Trend Report
            .addCase(loadCashflowTrend.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadCashflowTrend.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.cashflowTrend = action.payload
            })
            .addCase(loadCashflowTrend.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })
    }
})

export default dashboardSlice.reducer;