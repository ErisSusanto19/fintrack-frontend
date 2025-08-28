'use client';

import CashflowLineChart from "@/components/features/dashboard/cashflow-line-chart";
import CategoryPieChart from "@/components/features/dashboard/category-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { loadCashflowTrend, loadCategoryBreakdown, loadOverview } from "@/store/features/dashboard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Loader2 } from "lucide-react";
import { useEffect } from "react";

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { overview, loading } = useAppSelector(state => state.dashboard)

    useEffect(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const startDate = format(new Date(year, month-1, 1), 'yyyy-MM-dd')
        const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd')

        dispatch(loadOverview({ year, month }))
        dispatch(loadCategoryBreakdown({ year, month }))
        dispatch(loadCashflowTrend({ startDate, endDate}))
    }, [dispatch])

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.fullName || 'User'}!</h1>
            <p className="text-gray-500 mb-8">Here is your financial overview for this month.</p>

            {loading == 'pending' && <Loader2 className="w-8 h-8 animate-spin"/>}

            {loading == 'succeeded' && (
                <div className="space-y-8">
                    {overview && (
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                                    <DollarSign className="w-4 h-5 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(overview.netCashFlow)}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Income</CardTitle>
                                    <ArrowUpCircle className="w-4 h-5 text-green-500"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(overview.totalIncome)}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Expense</CardTitle>
                                    <ArrowDownCircle className="w-4 h-5 text-red-500"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(overview.totalExpense)}</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                        <CategoryPieChart/>
                        <CashflowLineChart/>
                    </div>
                </div>
            )}
        </div>
    )

}

export default DashboardPage;