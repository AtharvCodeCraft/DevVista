import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

/**
 * Error state display with retry option
 */
const ErrorState = ({
                        title = "Something went wrong",
                        message,
                        onRetry,
                        className,
                    }: ErrorStateProps) => {
    return (
        <div
            className={cn(
                "glass-card p-8 text-center animate-fade-in",
                className
            )}
        >
            <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{message}</p>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="border-border/50 hover:bg-secondary/50"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorState;
