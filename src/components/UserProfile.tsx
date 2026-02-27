import { GitHubUser } from "@/services/githubApi";
import { Users, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileProps {
    user: GitHubUser;
    className?: string;
}

/**
 * User profile header with avatar and stats
 */
const UserProfile = ({ user, className }: UserProfileProps) => {
    return (
        <div
            className={cn(
                "glass-card p-6 sm:p-8 animate-fade-in",
                className
            )}
        >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-primary/30 object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {user.name || user.login}
                        </h1>
                        <a
                            href={user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <span className="font-mono">@{user.login}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </div>

                    {user.bio && (
                        <p className="text-muted-foreground max-w-xl mb-4">{user.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                        <StatBadge
                            icon={BookOpen}
                            value={user.public_repos}
                            label="Repositories"
                        />
                        <StatBadge
                            icon={Users}
                            value={user.followers}
                            label="Followers"
                        />
                        <StatBadge
                            icon={Users}
                            value={user.following}
                            label="Following"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatBadgeProps {
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    label: string;
}

const StatBadge = ({ icon: Icon, value, label }: StatBadgeProps) => (
    <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">{value.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
    </div>
);

export default UserProfile;
