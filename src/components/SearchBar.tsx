import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    onSearch: (username: string) => void;
    isLoading?: boolean;
    className?: string;
}

/**
 * GitHub username search bar with animated focus state
 */
const SearchBar = ({ onSearch, isLoading, className }: SearchBarProps) => {
    const [username, setUsername] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const parseUsername = (input: string): string => {
        const trimmed = input.trim();
        try {
            // Handle valid URLs
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                const url = new URL(trimmed);
                if (url.hostname === "github.com" || url.hostname === "www.github.com") {
                    const parts = url.pathname.split("/").filter(Boolean);
                    if (parts.length > 0) return parts[0];
                }
            } 
            // Handle github.com/username without http
            else if (trimmed.includes("github.com/")) {
                const parts = trimmed.split("github.com/")[1].split("/").filter(Boolean);
                if (parts.length > 0) return parts[0];
            }
        } catch (e) {
            // Ignore parse errors and fall through
        }

        // Handle @username
        if (trimmed.startsWith("@")) return trimmed.substring(1);

        // Handle user/repo format, extract just user
        if (trimmed.includes("/") && !trimmed.includes(" ")) {
            return trimmed.split("/")[0];
        }

        return trimmed;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onSearch(parseUsername(username));
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "relative w-full max-w-2xl mx-auto",
                className
            )}
        >
            {/* Glow effect on focus */}
            <div
                className={cn(
                    "absolute inset-0 rounded-2xl bg-primary/20 blur-2xl transition-opacity duration-500",
                    isFocused ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Search container */}
            <div
                className={cn(
                    "relative flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300",
                    "bg-card/50 backdrop-blur-xl",
                    isFocused
                        ? "border-primary/50 shadow-lg shadow-primary/10"
                        : "border-border/50"
                )}
            >
                <div className="flex items-center justify-center w-12 h-12">
                    <Search
                        className={cn(
                            "h-5 w-5 transition-colors duration-300",
                            isFocused ? "text-primary" : "text-muted-foreground"
                        )}
                    />
                </div>

                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter GitHub username..."
                    className="flex-1 h-12 border-0 bg-transparent text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
                    disabled={isLoading}
                />

                <Button
                    type="submit"
                    disabled={!username.trim() || isLoading}
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold transition-all duration-300 disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span className="hidden sm:inline">Searching...</span>
            </span>
                    ) : (
                        <span className="flex items-center gap-2">
              <span className="hidden sm:inline">Analyze</span>
              <ArrowRight className="h-4 w-4" />
            </span>
                    )}
                </Button>
            </div>

            {/* Helper text */}
            <p className="mt-3 text-center text-sm text-muted-foreground">
                Try searching for{" "}
                <button
                    type="button"
                    onClick={() => {
                        setUsername("facebook");
                        onSearch("facebook");
                    }}
                    className="text-primary hover:underline font-mono"
                >
                    facebook
                </button>
                ,{" "}
                <button
                    type="button"
                    onClick={() => {
                        setUsername("vercel");
                        onSearch("vercel");
                    }}
                    className="text-primary hover:underline font-mono"
                >
                    vercel
                </button>
                , or{" "}
                <button
                    type="button"
                    onClick={() => {
                        setUsername("microsoft");
                        onSearch("microsoft");
                    }}
                    className="text-primary hover:underline font-mono"
                >
                    microsoft
                </button>
            </p>
        </form>
    );
};

export default SearchBar;
