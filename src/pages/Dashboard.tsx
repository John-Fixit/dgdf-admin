import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartHandshake, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@heroui/react";
import { PageHeader, StatsCard } from "@/components/shared";
import {
  ActivityFeed,
  AttentionPanel,
  ChannelBreakdown,
  ImpactChart,
  ProgramsTable,
  QuickActions,
} from "@/components/features/dashboard";
import { useAuth } from "@/hooks";
import {
  mockActivityFeed,
  mockAnalyticsMetrics,
  mockDashboardAlerts,
  mockFundChannels,
  mockImpactChart,
  mockImpactChartYearly,
  mockOutreachPrograms,
} from "@/mock-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Foundation Operations Command Center.
 * Uses local mock analytics until API routes are available.
 */
export default function Dashboard(): React.ReactElement {
  const { user } = useAuth();
  const { donations, livesImpacted, activePrograms, unreadMessages } =
    mockAnalyticsMetrics;

  const firstName = user?.name?.split(" ")[0] ?? "Admin";
  const todayLabel = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* Ops overview strip */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-primary via-primary to-[#0f2744] p-6 text-white shadow-luxury sm:p-8"
        aria-label="Operations overview"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              {todayLabel}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {firstName}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Your foundation control surface is ready. Review attention items,
              track impact momentum, and keep public narratives aligned.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
              Systems · Nominal
            </span>
            <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
              {mockDashboardAlerts.length} need attention
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
              Mock analytics · API later
            </span>
          </div>
        </div>
      </motion.section>

      {/* KPI row */}
      <section
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Key performance metrics"
      >
        <StatsCard
          index={0}
          title={donations.label}
          value={donations.value}
          trend={donations.trend}
          trendPositive={donations.trendPositive}
          subtitle={donations.subtitle}
          icon={HeartHandshake}
          iconTone="accent"
        />
        <StatsCard
          index={1}
          title={livesImpacted.label}
          value={livesImpacted.value}
          trend={livesImpacted.trend}
          trendPositive={livesImpacted.trendPositive}
          subtitle={livesImpacted.subtitle}
          icon={UsersRound}
          iconTone="primary"
        />
        <StatsCard
          index={2}
          title={activePrograms.label}
          value={activePrograms.value}
          trend={activePrograms.trend}
          trendPositive={activePrograms.trendPositive}
          subtitle={activePrograms.subtitle}
          icon={ShieldCheck}
          iconTone="warm"
        />
        <StatsCard
          index={3}
          title={unreadMessages.label}
          value={unreadMessages.value}
          trend={unreadMessages.trend}
          trendPositive={unreadMessages.trendPositive}
          subtitle={unreadMessages.subtitle}
          icon={Mail}
          iconTone="primary"
        />
      </section>

      {/* Chart + activity */}
      <section
        className="grid grid-cols-1 gap-6 xl:grid-cols-5"
        aria-label="Impact and activity"
      >
        <div className="xl:col-span-3">
          <ImpactChart
            monthly={mockImpactChart}
            yearly={mockImpactChartYearly}
          />
        </div>
        <div className="xl:col-span-2">
          <ActivityFeed items={mockActivityFeed} />
        </div>
      </section>

      {/* Shortcuts + stewardship + attention */}
      <section
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        aria-label="Operations panels"
      >
        <QuickActions />
        <ChannelBreakdown channels={mockFundChannels} />
        <AttentionPanel alerts={mockDashboardAlerts} />
      </section>

      <ProgramsTable programs={mockOutreachPrograms} />
    </div>
  );
}
