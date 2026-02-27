import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Contributor } from "@/services/githubApi";
import ChartCard from "@/components/ChartCard";
import { Users } from "lucide-react";

interface ContributorsChartProps {
    data: Contributor[];
    delay?: number;
}

/**
 * Bar chart showing top contributors by commit count
 */
const ContributorsChart = ({ data, delay = 0 }: ContributorsChartProps) => {
    // Take top 8 contributors
    const chartData = data.slice(0, 8).map((contributor) => ({
        name: contributor.login,
        commits: contributor.contributions,
        avatar: contributor.avatar_url,
    }));

    // Chart colors
    const colors = [
        "hsl(187 94% 43%)", // primary
        "hsl(262 83% 58%)", // accent
        "hsl(142 71% 45%)", // green
        "hsl(38 92% 50%)",  // orange
        "hsl(187 94% 55%)", // primary light
        "hsl(262 83% 68%)", // accent light
        "hsl(142 71% 55%)", // green light
        "hsl(38 92% 60%)",  // orange light
    ];

    return (
        <ChartCard
            title="Top Contributors"
            subtitle={`${data.length} total contributors`}
            icon={Users}
            delay={delay}
        >
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(217 33% 17%)"
                            horizontal={false}
                        />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                            width={100}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(222 47% 8%)",
                                border: "1px solid hsl(217 33% 17%)",
                                borderRadius: "8px",
                                padding: "12px",
                            }}
                            labelStyle={{ color: "hsl(210 40% 98%)", fontWeight: 600 }}
                            formatter={(value: number) => [`${value.toLocaleString()} commits`, "Contributions"]}
                            cursor={{ fill: "hsl(217 33% 17% / 0.5)" }}
                        />
                        <Bar dataKey="commits" radius={[0, 4, 4, 0]}>
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
};

export default ContributorsChart;
