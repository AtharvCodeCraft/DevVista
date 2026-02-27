import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    text?: string;
}

/**
 * Animated loading spinner with optional text
 */
const Loader = ({ className, size = "md", text }: LoaderProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="relative">
                {/* Outer glow ring */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse",
                        sizeClasses[size]
                    )}
                />

                {/* Spinner */}
                <svg
                    className={cn("animate-spin text-primary", sizeClasses[size])}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>

            {text && (
                <p className="text-sm text-muted-foreground font-mono animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loader;
