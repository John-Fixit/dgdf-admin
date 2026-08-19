import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  iconTone?: "accent" | "primary" | "warm" | "success" | "error";
  index?: number;
  className?: string;
}

/** Icon badge fill — all drawn from the theme's own tokens, never a stock Tailwind hue. */
const iconToneClasses = {
  accent: "bg-accent/10 text-accent ring-1 ring-accent/20",
  primary: "bg-primary/8 text-primary ring-1 ring-primary/15",
  warm: "bg-accent/15 text-accent ring-1 ring-accent/25",
  success: "bg-success/10 text-success ring-1 ring-success/20",
  error: "bg-error/10 text-error ring-1 ring-error/20",
} as const;

/** Top accent stripe — same tone as the icon badge, gives each card an at-a-glance color. */
const toneBarClasses = {
  accent: "bg-accent",
  primary: "bg-primary",
  warm: "bg-accent",
  success: "bg-success",
  error: "bg-error",
} as const;

/**
 * Dashboard metric card with staggered entrance.
 */
export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  iconTone = "primary",
  index = 0,
  className,
}: StatsCardProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-ambient",
          className,
        )}
      >
        <CardContent className="p-5 pt-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              {title}
            </p>
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                iconToneClasses[iconTone],
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </div>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            {value}
          </p>
          {trend || subtitle ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {trend ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    trendPositive
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error",
                  )}
                >
                  {trendPositive ? (
                    <TrendingUp className="h-3 w-3" aria-hidden />
                  ) : (
                    <TrendingDown className="h-3 w-3" aria-hidden />
                  )}
                  {trend}
                </span>
              ) : null}
              {subtitle ? (
                <span className="text-[11px] text-slate-500">{subtitle}</span>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
