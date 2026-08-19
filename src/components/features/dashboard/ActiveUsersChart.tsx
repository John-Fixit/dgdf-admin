import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui";
import { useAnalyticsDaily } from "@/hooks";

const NAVY = "#1a3a5c";
const GOLD = "#f0a500";

/**
 * Formats a YYYY-MM-DD date as a short axis label (e.g. "Jul 20").
 */
function formatAxisDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

function ActiveUsersChartSkeleton(): React.ReactElement {
  return <div className="h-72 animate-pulse rounded-xl bg-slate-100" />;
}

/**
 * Line chart of daily active users over the last 30 days, sourced from
 * GET /analytics/daily. Fails gracefully so a GA4 outage never blocks the
 * rest of the dashboard.
 */
export function ActiveUsersChart(): React.ReactElement {
  const { data, isLoading, isError } = useAnalyticsDaily();

  return (
    <Card className="border-slate-200/60 shadow-luxury">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Visitors
          </p>
          <h2 className="font-display text-2xl font-semibold text-primary">
            Active Users Trend
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daily active users over the last 30 days.
          </p>
        </div>

        {isLoading ? (
          <ActiveUsersChartSkeleton />
        ) : isError || !data ? (
          <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50/80 text-sm text-slate-400">
            Visitor trend is unavailable right now.
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50/80 text-sm text-slate-400">
            No visitor data yet
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatAxisDate}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip
                  formatter={(value) => [value, "Active users"]}
                  labelFormatter={(label) =>
                    typeof label === "string" ? formatAxisDate(label) : label
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 8px 24px rgba(15, 39, 68, 0.12)",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: NAVY, fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: GOLD, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: GOLD, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
