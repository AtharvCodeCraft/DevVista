import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Star, GitFork, Eye, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import CommitActivityChart from "@/components/charts/CommitActivityChart";
import ContributorsChart from "@/components/charts/ContributorsChart";
import PullRequestsChart from "@/components/charts/PullRequestsChart";
import IssuesChart from "@/components/charts/IssuesChart";
import {
    fetchRepo,
    fetchCommitActivity,
    fetchContributors,
    fetchPullRequests,
    fetchIssues,
    GitHubRepo,
    CommitActivity,
    Contributor,
    PullRequest,
    Issue,
} from "@/services/githubApi";
import { cn } from "@/lib/utils";

/**
 * Repository details page with analytics charts
 */
const RepoDetails = () => {
    const { owner, repo: repoName } = useParams<{ owner: string; repo: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [repo, setRepo] = useState<GitHubRepo | null>(null);
    const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([]);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        if (!owner || !repoName) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch all data in parallel
                const [repoData, activityData, contributorsData, prsData, issuesData] =
                    await Promise.all([
                        fetchRepo(owner, repoName),
                        fetchCommitActivity(owner, repoName),
                        fetchContributors(owner, repoName),
                        fetchPullRequests(owner, repoName),
                        fetchIssues(owner, repoName),
                    ]);

                setRepo(repoData);
                setCommitActivity(activityData);
                setContributors(contributorsData);
                setPullRequests(prsData);
                setIssues(issuesData);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError("Repository not found. It may have been deleted or made private.");
                } else if (err.response?.status === 403) {
                    setError("API rate limit exceeded. Please try again in a few minutes.");
                } else {
                    setError("Failed to fetch repository data. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [owner, repoName]);

    if (isLoading) {
        return (
            <main className="min-h-screen pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl flex items-center justify-center py-20">
                    <Loader size="lg" text="Loading repository analytics..." />
                </div>
            </main>
        );
    }

    if (error || !repo) {
        return (
            <main className="min-h-screen pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-8 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                    <ErrorState
                        message={error || "Repository not found"}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </main>
        );
    }

    return (
        <>
            <Helmet>
                <title>{repo.full_name} Analytics - Gitlytics</title>
                <meta
                    name="description"
                    content={`Analytics dashboard for ${repo.full_name}. View commits, contributors, pull requests, and issues.`}
                />
            </Helmet>

            <main className="min-h-screen pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-6 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Repositories
                    </Button>

                    {/* Repository Header */}
                    <header className="glass-card p-6 sm:p-8 mb-8 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Link
                                        to="/"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate("/");
                                        }}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {repo.owner.login}
                                    </Link>
                                    <span>/</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                                    {repo.name}
                                </h1>
                            </div>

                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                            >
                                View on GitHub
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>

                        {repo.description && (
                            <p className="text-muted-foreground mb-6 max-w-3xl">
                                {repo.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard
                                icon={Star}
                                value={repo.stargazers_count}
                                label="Stars"
                                color="text-yellow-400"
                            />
                            <StatCard
                                icon={GitFork}
                                value={repo.forks_count}
                                label="Forks"
                                color="text-blue-400"
                            />
                            <StatCard
                                icon={Eye}
                                value={repo.watchers_count}
                                label="Watchers"
                                color="text-purple-400"
                            />
                            <StatCard
                                icon={AlertCircle}
                                value={repo.open_issues_count}
                                label="Open Issues"
                                color="text-orange-400"
                            />
                        </div>
                    </header>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Commit Activity */}
                        <CommitActivityChart data={commitActivity} delay={100} />

                        {/* Contributors */}
                        <ContributorsChart data={contributors} delay={200} />

                        {/* Pull Requests */}
                        <PullRequestsChart data={pullRequests} delay={300} />

                        {/* Issues */}
                        <IssuesChart data={issues} delay={400} />
                    </div>
                </div>
            </main>
        </>
    );
};

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    label: string;
    color: string;
}

const StatCard = ({ icon: Icon, value, label, color }: StatCardProps) => (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/30">
        <Icon className={cn("h-5 w-5", color)} />
        <div>
            <p className="text-xl font-bold text-foreground">
                {value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    </div>
);

export default RepoDetails;
