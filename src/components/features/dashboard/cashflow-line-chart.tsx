import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CashflowLineChart = () => {
    const { cashflowTrend, loading} = useAppSelector(state => state.dashboard)

    const chartData = cashflowTrend.map(item => ({
        ...item,
        date: new Date().toLocaleString('en-US', {month: 'short', day: 'numeric'})
    }))

    const formatCurrencyAxis = (value: number) => {
        if(value >= 1000000) return `${value/1000000}M`
        if(value >= 1000) return `${value/1000}M`
        return value.toString()
    }

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Cashflow Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray={"3 3"}/>
                            <XAxis dataKey={"date"}/>
                            <YAxis tickFormatter={formatCurrencyAxis}/>
                            <Tooltip formatter={formatCurrency}/>
                            <Legend/>
                            <Line type={"monotone"} dataKey={"income"} stroke="#22c55e" activeDot={{r: 8}}/>
                            <Line type={"monotone"} dataKey={"expense"} stroke="#ef4444"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default CashflowLineChart;