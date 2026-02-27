import { Star, GitFork, Eye, AlertCircle, Code2 } from "lucide-react";
import { GitHubRepo } from "@/services/githubApi";
import { cn } from "@/lib/utils";

interface RepoCardProps {
    repo: GitHubRepo;
    onClick?: () => void;
    className?: string;
    delay?: number;
}

/**
 * Repository card displaying key metrics
 */
const RepoCard = ({ repo, onClick, className, delay = 0 }: RepoCardProps) => {
    // Language color mapping
    const languageColors: Record<string, string> = {
        JavaScript: "bg-yellow-400",
        TypeScript: "bg-blue-400",
        Python: "bg-green-400",
        Java: "bg-orange-400",
        Go: "bg-cyan-400",
        Rust: "bg-orange-600",
        Ruby: "bg-red-400",
        PHP: "bg-purple-400",
        "C++": "bg-pink-400",
        C: "bg-gray-400",
        Swift: "bg-orange-500",
        Kotlin: "bg-purple-500",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "stat-card w-full text-left group opacity-0 animate-slide-up",
                className
            )}
            style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-mono font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {repo.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                        {repo.owner.login}
                    </p>
                </div>

                {/* Language badge */}
                {repo.language && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50">
                        <div
                            className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                languageColors[repo.language] || "bg-muted-foreground"
                            )}
                        />
                        <span className="text-xs font-mono text-muted-foreground">
              {repo.language}
            </span>
                    </div>
                )}
            </div>

            {/* Description */}
            {repo.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {repo.description}
                </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatItem
                    icon={Star}
                    value={formatNumber(repo.stargazers_count)}
                    label="Stars"
                    color="text-yellow-400"
                />
                <StatItem
                    icon={GitFork}
                    value={formatNumber(repo.forks_count)}
                    label="Forks"
                    color="text-blue-400"
                />
                <StatItem
                    icon={Eye}
                    value={formatNumber(repo.watchers_count)}
                    label="Watchers"
                    color="text-purple-400"
                />
                <StatItem
                    icon={AlertCircle}
                    value={formatNumber(repo.open_issues_count)}
                    label="Issues"
                    color="text-orange-400"
                />
            </div>

            {/* Hover indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <Code2 className="h-3.5 w-3.5" />
                <span>View detailed analytics</span>
            </div>
        </button>
    );
};

interface StatItemProps {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    label: string;
    color: string;
}

const StatItem = ({ icon: Icon, value, label, color }: StatItemProps) => (
    <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <div>
            <p className="text-sm font-semibold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {label}
            </p>
        </div>
    </div>
);

/**
 * Format large numbers with K/M suffix
 */
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}

export default RepoCard;
