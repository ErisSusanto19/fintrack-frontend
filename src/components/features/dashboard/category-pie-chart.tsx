import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

const CategoryPieChart = () => {
    const { categoryBreakdown, loading } = useAppSelector(state => state.dashboard)
    console.log(categoryBreakdown, '<<< from component');
    

    const chartData = categoryBreakdown.map(item => ({
        name: item.categoryName,
        value: item.totalAmount
    }))

    console.log(chartData, '<<< cek chart data');
    

    if(loading == 'succeeded' && chartData.length == 0){
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No expense data for this period</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={formatCurrency}/>
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default CategoryPieChart;