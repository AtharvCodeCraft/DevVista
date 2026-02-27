import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Issue } from "@/services/githubApi";
import ChartCard from "@/components/ChartCard";
import { AlertCircle } from "lucide-react";

interface IssuesChartProps {
    data: Issue[];
    delay?: number;
}

/**
 * Area chart showing issues timeline
 */
const IssuesChart = ({ data, delay = 0 }: IssuesChartProps) => {
    // Group issues by month
    const monthlyData = data.reduce((acc, issue) => {
        const date = new Date(issue.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!acc[monthKey]) {
            acc[monthKey] = { opened: 0, closed: 0 };
        }

        acc[monthKey].opened += 1;

        if (issue.closed_at) {
            const closedDate = new Date(issue.closed_at);
            const closedMonthKey = `${closedDate.getFullYear()}-${String(closedDate.getMonth() + 1).padStart(2, "0")}`;
            if (!acc[closedMonthKey]) {
                acc[closedMonthKey] = { opened: 0, closed: 0 };
            }
            acc[closedMonthKey].closed += 1;
        }

        return acc;
    }, {} as Record<string, { opened: number; closed: number }>);

    // Convert to chart data and sort by date
    const chartData = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // Last 6 months
        .map(([month, counts]) => ({
            month: formatMonth(month),
            opened: counts.opened,
            closed: counts.closed,
        }));

    const openIssues = data.filter((i) => i.state === "open").length;
    const closedIssues = data.filter((i) => i.state === "closed").length;

    return (
        <ChartCard
            title="Issues Timeline"
            subtitle={`${openIssues} open, ${closedIssues} closed`}
            icon={AlertCircle}
            delay={delay}
        >
            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(217 33% 17%)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
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
                            />
                            <Area
                                type="monotone"
                                dataKey="opened"
                                stroke="hsl(38 92% 50%)"
                                strokeWidth={2}
                                fill="url(#openedGradient)"
                                name="Opened"
                            />
                            <Area
                                type="monotone"
                                dataKey="closed"
                                stroke="hsl(142 71% 45%)"
                                strokeWidth={2}
                                fill="url(#closedGradient)"
                                name="Closed"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        No issues data available
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

/**
 * Format month string for display
 */
function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
}

export default IssuesChart;
