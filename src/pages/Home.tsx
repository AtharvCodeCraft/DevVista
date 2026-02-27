import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SearchBar from "@/components/SearchBar";
import RepoCard from "@/components/RepoCard";
import UserProfile from "@/components/UserProfile";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import { fetchUser, fetchUserRepos, GitHubUser, GitHubRepo } from "@/services/githubApi";
import { BarChart3, Zap, GitBranch, TrendingUp } from "lucide-react";

/**
 * Home page with user search and repository listing
 */
const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);

    const handleSearch = async (username: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch user and repos in parallel
            const [userData, reposData] = await Promise.all([
                fetchUser(username),
                fetchUserRepos(username, "stars", 12),
            ]);

            setUser(userData);
            setRepos(reposData);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError(`User "${username}" not found. Please check the username and try again.`);
            } else if (err.response?.status === 403) {
                setError("API rate limit exceeded. Please try again in a few minutes.");
            } else {
                setError("Failed to fetch data. Please check your connection and try again.");
            }
            setUser(null);
            setRepos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRepoClick = (repo: GitHubRepo) => {
        navigate(`/repo/${repo.owner.login}/${repo.name}`);
    };

    return (
        <>
            <Helmet>
                <title>Gitlytics - GitHub Analytics Dashboard</title>
                <meta
                    name="description"
                    content="Visualize GitHub collaboration metrics with interactive dashboards. Analyze commits, contributors, pull requests, and issues."
                />
            </Helmet>

            <main className="min-h-screen pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Hero Section */}
                    {!user && !isLoading && !error && (
                        <section className="text-center mb-16 animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono mb-6">
                                <Zap className="h-4 w-4" />
                                Real-time GitHub Analytics
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="text-foreground">Visualize Your</span>
                                <br />
                                <span className="gradient-text">GitHub Activity</span>
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                                Explore commit patterns, contributor insights, and repository health
                                with beautiful interactive charts.
                            </p>

                            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                            {/* Feature highlights */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
                                <FeatureCard
                                    icon={BarChart3}
                                    title="Commit Analytics"
                                    description="Track weekly commit activity and patterns"
                                    delay={100}
                                />
                                <FeatureCard
                                    icon={GitBranch}
                                    title="PR Insights"
                                    description="Monitor pull request status and trends"
                                    delay={200}
                                />
                                <FeatureCard
                                    icon={TrendingUp}
                                    title="Growth Metrics"
                                    description="Analyze contributor engagement"
                                    delay={300}
                                />
                            </div>
                        </section>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader size="lg" text="Fetching GitHub data..." />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="max-w-md mx-auto">
                            <ErrorState
                                message={error}
                                onRetry={() => setError(null)}
                            />
                            <div className="mt-8">
                                <SearchBar onSearch={handleSearch} />
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {user && !isLoading && (
                        <section>
                            {/* Search bar at top when results shown */}
                            <div className="mb-8">
                                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                            </div>

                            {/* User Profile */}
                            <UserProfile user={user} className="mb-8" />

                            {/* Repository Grid */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-foreground mb-2">
                                    Top Repositories
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Click on a repository to view detailed analytics
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {repos.map((repo, index) => (
                                    <RepoCard
                                        key={repo.id}
                                        repo={repo}
                                        onClick={() => handleRepoClick(repo)}
                                        delay={index * 50}
                                    />
                                ))}
                            </div>

                            {repos.length === 0 && (
                                <div className="glass-card p-8 text-center">
                                    <p className="text-muted-foreground">
                                        No public repositories found for this user.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </>
    );
};

interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => (
    <div
        className="stat-card text-center opacity-0 animate-slide-up"
        style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

export default Home;
