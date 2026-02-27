import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CommitActivity } from "@/services/githubApi";
import ChartCard from "@/components/ChartCard";
import { Activity } from "lucide-react";

interface CommitActivityChartProps {
    data: CommitActivity[];
    delay?: number;
}

/**
 * Line chart showing weekly commit activity
 */
const CommitActivityChart = ({ data, delay = 0 }: CommitActivityChartProps) => {
    // Transform data for chart - take last 12 weeks
    const chartData = data.slice(-12).map((week, index) => ({
        week: `W${index + 1}`,
        commits: week.total,
    }));

    // Calculate total commits
    const totalCommits = chartData.reduce((sum, week) => sum + week.commits, 0);

    return (
        <ChartCard
            title="Commit Activity"
            subtitle={`${totalCommits.toLocaleString()} commits in last 12 weeks`}
            icon={Activity}
            delay={delay}
        >
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(187 94% 43%)" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="hsl(187 94% 43%)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(217 33% 17%)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(222 47% 8%)",
                                border: "1px solid hsl(217 33% 17%)",
                                borderRadius: "8px",
                                padding: "12px",
                            }}
                            labelStyle={{ color: "hsl(210 40% 98%)", fontWeight: 600 }}
                            itemStyle={{ color: "hsl(187 94% 43%)" }}
                            formatter={(value: number) => [`${value} commits`, "Commits"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="commits"
                            stroke="hsl(187 94% 43%)"
                            strokeWidth={3}
                            dot={{ fill: "hsl(187 94% 43%)", strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: "hsl(187 94% 43%)" }}
                            fill="url(#commitGradient)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
};

export default CommitActivityChart;
