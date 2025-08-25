import api from "@/lib/api";
import { ApiResponse, CashflowTrend, CategoryBreakdown, DashboardOverview } from "@/types";

export const getOverview = async (year: number, month: number): Promise<ApiResponse<DashboardOverview>> => {
    const response = await api.get<ApiResponse<DashboardOverview>>('/reports/overview', {
        params: {
            year,
            month
        }
    })

    return response.data;
}

export const getCategoryBreakdown = async (year: number, month: number): Promise<ApiResponse<CategoryBreakdown[]>> => {
    const response = await api.get<ApiResponse<CategoryBreakdown[]>>('/reports/category-breakdown', {
        params: {
            year,
            month
        }
    })

    return response.data;
}

export const getCashflowTrend = async (startDate: string, endDate: string): Promise<ApiResponse<CashflowTrend[]>> => {
    const response = await api.get<ApiResponse<CashflowTrend[]>>('/reports/cashflow-trend', {
        params: {
            startDate,
            endDate
        }
    })

    return response.data;
}