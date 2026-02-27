import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Wrapper card for charts with consistent styling
 */
const ChartCard = ({
                       title,
                       subtitle,
                       icon: Icon,
                       children,
                       className,
                       delay = 0,
                   }: ChartCardProps) => {
    return (
        <div
            className={cn(
                "chart-container opacity-0 animate-slide-up",
                className
            )}
            style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Chart content */}
            <div className="w-full">{children}</div>
        </div>
    );
};

export default ChartCard;
