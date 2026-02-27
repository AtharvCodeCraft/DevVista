import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { PullRequest } from "@/services/githubApi";
import ChartCard from "@/components/ChartCard";
import { GitPullRequest } from "lucide-react";

interface PullRequestsChartProps {
    data: PullRequest[];
    delay?: number;
}

/**
 * Pie chart showing PR status breakdown
 */
const PullRequestsChart = ({ data, delay = 0 }: PullRequestsChartProps) => {
    // Calculate PR status counts
    const open = data.filter((pr) => pr.state === "open").length;
    const merged = data.filter((pr) => pr.merged_at !== null).length;
    const closed = data.filter((pr) => pr.state === "closed" && !pr.merged_at).length;

    const chartData = [
        { name: "Open", value: open, color: "hsl(142 71% 45%)" },
        { name: "Merged", value: merged, color: "hsl(262 83% 58%)" },
        { name: "Closed", value: closed, color: "hsl(0 84% 60%)" },
    ].filter((item) => item.value > 0);

    const total = data.length;

    return (
        <ChartCard
            title="Pull Requests"
            subtitle={`${total} total PRs analyzed`}
            icon={GitPullRequest}
            delay={delay}
        >
            <div className="h-[300px] w-full">
                {total > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(222 47% 8%)",
                                    border: "1px solid hsl(217 33% 17%)",
                                    borderRadius: "8px",
                                    padding: "12px",
                                }}
                                formatter={(value: number, name: string) => [
                                    `${value} (${((value / total) * 100).toFixed(1)}%)`,
                                    name,
                                ]}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => (
                                    <span style={{ color: "hsl(215 20% 55%)", fontSize: "12px" }}>
                    {value}
                  </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        No pull requests found
                    </div>
                )}
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{open}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{merged}</p>
                    <p className="text-xs text-muted-foreground">Merged</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{closed}</p>
                    <p className="text-xs text-muted-foreground">Closed</p>
                </div>
            </div>
        </ChartCard>
    );
};

export default PullRequestsChart;
