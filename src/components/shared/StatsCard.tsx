import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  iconTone?: "accent" | "primary" | "warm";
  index?: number;
  className?: string;
}

const iconToneClasses = {
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/8 text-primary",
  warm: "bg-amber-50 text-amber-800",
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
        className={cn("transition-colors hover:border-slate-300", className)}
      >
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              {title}
            </p>
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                iconToneClasses[iconTone],
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            {value}
          </p>
          {trend || subtitle ? (
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              {trend ? (
                <span
                  className={cn(
                    "font-semibold",
                    trendPositive ? "text-emerald-600" : "text-slate-600",
                  )}
                >
                  {trend}
                </span>
              ) : null}
              {subtitle ? <span>{subtitle}</span> : null}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
