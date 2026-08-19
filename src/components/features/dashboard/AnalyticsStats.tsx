import { ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui";
import { useAnalyticsSummary } from "@/hooks";
import { formatCount } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll target id for the Active Users Trend chart, further down the page. */
export const ACTIVE_USERS_TREND_ANCHOR_ID = "active-users-trend";

function AnalyticsStatsSkeleton(): React.ReactElement {
  return <div className="h-[172px] animate-pulse rounded-xl bg-slate-100" />;
}

function scrollToTrendChart(): void {
  document
    .getElementById(ACTIVE_USERS_TREND_ANCHOR_ID)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Compact website-visitor summary (Active Users / Page Views / Sessions)
 * sourced from GET /analytics/summary. Sits alongside Donation Status and
 * links down to the Active Users Trend chart. Fails gracefully so a GA4
 * outage never blocks the rest of the dashboard.
 */
export function AnalyticsStats(): React.ReactElement {
  const { data, isLoading, isError } = useAnalyticsSummary();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.42, ease: EASE }}
      aria-label="Website visitor analytics"
    >
      {isLoading ? (
        <AnalyticsStatsSkeleton />
      ) : isError || !data ? (
        <Card className="border-slate-200/80">
          <CardContent className="p-5 text-sm text-slate-500">
            Visitor analytics are unavailable right now.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200/60 shadow-luxury">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  Visitors
                </p>
                <h2 className="font-display text-lg font-semibold text-primary">
                  Website Analytics
                </h2>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Users className="h-4 w-4" aria-hidden />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active users
                </p>
                <p className="mt-1 font-display text-base font-semibold text-primary">
                  {formatCount(data.activeUsers)}
                </p>
              </div>
              <div className="flex gap-6 border-l border-slate-100 pl-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Page views
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-primary">
                    {formatCount(data.pageViews)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sessions
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-primary">
                    {formatCount(data.sessions)}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToTrendChart}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-50 px-4 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-slate-100 cursor-pointer"
            >
              View trend
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </CardContent>
        </Card>
      )}
    </motion.section>
  );
}
