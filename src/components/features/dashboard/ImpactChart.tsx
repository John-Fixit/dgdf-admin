import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Card, CardContent } from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import type { ImpactChartPoint } from "@/lib/types";

interface ImpactChartProps {
  weekly: ImpactChartPoint[];
  monthly: ImpactChartPoint[];
  yearly: ImpactChartPoint[];
}

type ChartRange = "weekly" | "monthly" | "yearly";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Compact currency label for chart axis ticks.
 */
function formatAxisValue(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Donation totals bar chart with weekly/monthly/yearly range toggle.
 */
export function ImpactChart({
  weekly,
  monthly,
  yearly,
}: ImpactChartProps): React.ReactElement {
  const [range, setRange] = useState<ChartRange>("weekly");
  const data =
    range === "weekly" ? weekly : range === "monthly" ? monthly : yearly;

  const summary = useMemo(() => {
    const peak = data.reduce(
      (best, point) => (point.value > best.value ? point : best),
      data[0] ?? { label: "—", value: 0 },
    );
    const average = data.length
      ? Math.round(
          data.reduce((sum, point) => sum + point.value, 0) / data.length,
        )
      : 0;
    const max = Math.max(...data.map((point) => point.value), 0);
    const gridSteps = 4;
    const gridMax = max > 0 ? max : 1;
    const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
      const ratio = i / gridSteps;
      return {
        ratio,
        value: Math.round(gridMax * (1 - ratio)),
      };
    });
    return { peak, average, max, gridLines };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.24, ease: EASE }}
      className="h-full"
    >
      <Card className="flex h-full min-h-[420px] flex-col overflow-hidden border-slate-200/60 shadow-luxury">
        <CardContent className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Performance
              </p>
              <h2 className="font-display text-2xl font-semibold text-primary">
                Donation Trends
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Successful gift totals across the selected reporting window.
              </p>
            </div>
            <div className="flex gap-2" role="group" aria-label="Chart range">
              {(["weekly", "monthly", "yearly"] as const).map((option) => (
                <Button
                  key={option}
                  size="sm"
                  onPress={() => setRange(option)}
                  className={cn(
                    "h-auto min-w-0 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest",
                    range === option
                      ? "bg-primary text-white data-[hover=true]:bg-primary"
                      : "bg-slate-100 text-slate-500 data-[hover=true]:bg-slate-200",
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Peak period
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-primary flex items-end gap-2">
                {summary.peak.label}{" "}
                <span className="text-xs text-slate-400">
                  {formatCurrency(summary.peak.value)}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Avg raised
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-primary">
                {formatCurrency(summary.average)}
              </p>
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-4">
            <div
              className="relative hidden h-60 w-14 shrink-0 sm:block sm:h-70"
              aria-hidden
            >
              {summary.gridLines.map((line) => (
                <span
                  key={`y-${line.value}-${line.ratio}`}
                  className="absolute right-0 -translate-y-1/2 text-[10px] font-medium tabular-nums text-slate-400"
                  style={{ top: `${line.ratio * 100}%` }}
                >
                  {formatAxisValue(line.value)}
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div className="relative h-60 sm:h-70">
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden
                >
                  {summary.gridLines.map((line) => (
                    <div
                      key={`grid-h-${line.ratio}`}
                      className={cn(
                        "absolute inset-x-0 border-t",
                        line.ratio === 1
                          ? "border-slate-300"
                          : "border-dashed border-slate-200/80",
                      )}
                      style={{ top: `${line.ratio * 100}%` }}
                    />
                  ))}
                  <div className="absolute inset-0 flex justify-between">
                    {data.map((point) => (
                      <div
                        key={`grid-v-${point.label}`}
                        className="h-full w-full border-r border-slate-100 last:border-r-0"
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-1 flex h-full items-end justify-between gap-2 sm:gap-3">
                  {data.length === 0 ? (
                    <p className="w-full self-center text-center text-sm text-slate-400">
                      No donation history yet
                    </p>
                  ) : (
                    data.map((point, index) => {
                      const heightPercent =
                        summary.max > 0
                          ? Math.max(
                              (point.value / summary.max) * 100,
                              point.value > 0 ? 4 : 0,
                            )
                          : 0;
                      return (
                        <div
                          key={`${range}-${point.label}`}
                          className="group relative flex h-full w-full flex-col items-center justify-end"
                        >
                          <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-luxury transition-opacity group-hover:opacity-100">
                            {point.isPeak ? "Peak · " : ""}
                            {formatCurrency(point.value)}
                          </span>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{
                              duration: 0.55,
                              delay: 0.2 + index * 0.05,
                              ease: EASE,
                            }}
                            className={cn(
                              "w-full max-w-[48px] rounded-t-lg transition-colors",
                              point.isPeak
                                ? "bg-primary shadow-ambient"
                                : "bg-slate-200/90 group-hover:bg-primary/35",
                            )}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-3 flex justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                {data.map((point) => (
                  <span
                    key={`${range}-label-${point.label}`}
                    className="w-full text-center"
                  >
                    {point.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
