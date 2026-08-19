import { motion } from "framer-motion";
import { HeartHandshake, Images, LineChartIcon, UsersRound } from "lucide-react";
import { Button } from "@heroui/react";
import { LoadingSpinner, StatsCard } from "@/components/shared";
import {
  ACTIVE_USERS_TREND_ANCHOR_ID,
  ActiveUsersChart,
  ActivityFeed,
  AnalyticsStats,
  AttentionPanel,
  ChannelBreakdown,
  ImpactChart,
  QuickActions,
  RecentDonationsTable,
} from "@/components/features/dashboard";
import { useAnalyticsSummary, useAuth, useDashboard } from "@/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Foundation operations dashboard — live aggregates from GET /dashboard.
 */
export default function Dashboard(): React.ReactElement {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const { data: analyticsData } = useAnalyticsSummary();

  const firstName = user?.name?.split(" ")[0] ?? "Admin";
  const todayLabel = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard…" />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { metrics, chart, activity, donationStatus, alerts, recentDonations } =
    data;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="roundedxl rounded-2xl border border-slate-200/60 bg-linear-to-br from-primary via-primary to-[#0f2744] p-6 text-white shadow-luxury"
        aria-label="Operations overview"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
              <span className="bg-accent/15 p-2 px-3 rounded-full">
                {todayLabel}
              </span>
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              Welcome back, {firstName}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/80">
              Live foundation metrics, audit activity, and items that need your
              attention.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold border-white/15 bg-white/10 text-white/80">
              Live data
            </span>
            {alerts.length > 0 ? (
              <span className="rounded-lg border border-accent/40 bg-accent/15 text-accent px-2.5 py-1 text-[11px] font-semibold ">
                {alerts.length} need attention
              </span>
            ) : null}
          </div>
        </div>
      </motion.section>

      <section
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Key performance metrics"
      >
        <StatsCard
          index={0}
          title={metrics.donations.label}
          value={metrics.donations.value}
          trend={metrics.donations.trend}
          trendPositive={metrics.donations.trendPositive}
          icon={HeartHandshake}
          iconTone="accent"
        />
        <StatsCard
          index={1}
          title={metrics.livesImpacted.label}
          value={metrics.livesImpacted.value}
          trend={metrics.livesImpacted.trend}
          trendPositive={metrics.livesImpacted.trendPositive}
          icon={UsersRound}
          iconTone="primary"
        />
        <StatsCard
          index={2}
          title={metrics.gallery.label}
          value={metrics.gallery.value}
          trend={metrics.gallery.trend}
          trendPositive={metrics.gallery.trendPositive}
          subtitle={metrics.gallery.subtitle}
          icon={Images}
          iconTone="warm"
        />
        <StatsCard
          index={3}
          title={"Website Analytics"}
          value={analyticsData?.activeUsers as string}
          trend={'Page Views'}
          subtitle={analyticsData?.pageViews}
          icon={LineChartIcon}
          iconTone="primary"
        />
      </section>

      <section
        className="grid grid-cols-1 gap-6 xl:grid-cols-5"
        aria-label="Impact and activity"
      >
        <div className="xl:col-span-3">
          <ImpactChart
            weekly={chart.weekly ?? []}
            monthly={chart.monthly}
            yearly={chart.yearly}
          />
        </div>
        <div className="xl:col-span-2">
          <ActivityFeed items={activity} />
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        aria-label="Operations panels"
      >
        <QuickActions />
        <div className="space-y-2">
          <ChannelBreakdown channels={donationStatus} />
          <AnalyticsStats />
        </div>
        <AttentionPanel alerts={alerts} />
      </section>

      <section id={ACTIVE_USERS_TREND_ANCHOR_ID} className="scroll-mt-6">
        <ActiveUsersChart />
      </section>

      <RecentDonationsTable donations={recentDonations} />
    </div>
  );
}
