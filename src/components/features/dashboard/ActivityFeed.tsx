import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Megaphone,
  Pencil,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Badge, Card, CardContent } from "@/components/ui";
import type { ActivityItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";

interface ActivityFeedProps {
  items: ActivityItem[];
}

const PAGE_SIZE = 5;
const EASE = [0.22, 1, 0.36, 1] as const;

const typeLabel: Record<ActivityItem["type"], string> = {
  donation: "Donation",
  story: "Story",
  update: "Update",
  system: "System",
};

const typeBadge: Record<
  ActivityItem["type"],
  "success" | "warning" | "default" | "secondary" | "primary" | "purple"
> = {
  donation: "success",
  story: "warning",
  update: "primary",
  system: "purple",
};

const typeAvatar: Record<
  ActivityItem["type"],
  {
    icon: LucideIcon;
    className: string;
  }
> = {
  story: {
    icon: Megaphone,
    className: "bg-amber-800/15 text-amber-800",
  },
  donation: {
    icon: HeartHandshake,
    className: "bg-emerald-100 text-emerald-700",
  },
  update: {
    icon: Pencil,
    className: "bg-sky-100 text-sky-600",
  },
  system: {
    icon: ShieldCheck,
    className: "bg-purple-100 text-purple-600",
  },
};

/**
 * Renders the leading visual for an activity row.
 */
function ActivityAvatar({ item }: { item: ActivityItem }): React.ReactElement {
  if (item.avatarUrl) {
    return (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-ambient">
        <img
          src={item.avatarUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const { icon: Icon, className } = typeAvatar[item.type];

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </div>
  );
}

/**
 * Latest activity feed from live audit + donation events.
 */
export function ActivityFeed({ items }: ActivityFeedProps): React.ReactElement {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = items.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );
  const canGoPrev = safePage > 0;
  const canGoNext = safePage < totalPages - 1 && items.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
      className="h-full"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="flex h-full flex-col p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  Operations pulse
                </p>
                <h2 className="font-display text-2xl font-semibold text-primary">
                  Latest Activity
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="bordered"
                  radius="full"
                  size="sm"
                  aria-label="Previous activities"
                  isDisabled={!canGoPrev}
                  onPress={() => setPage(safePage - 1)}
                  className="h-9 w-9 min-w-9 border-1 shadow-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="bordered"
                  radius="full"
                  size="sm"
                  aria-label="Next activities"
                  isDisabled={!canGoNext}
                  onPress={() => setPage(safePage + 1)}
                  className="h-9 w-9 min-w-9 border-1 shadow-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="flex-1 text-sm text-slate-400">
              Activity will appear here as admins and donors take actions.
            </p>
          ) : (
            <ul className="flex-1 space-y-5">
              {pageItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.36 + index * 0.05,
                    ease: EASE,
                  }}
                  className="flex gap-3 border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                >
                  <ActivityAvatar item={item} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge
                        variant={typeBadge[item.type]}
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      >
                        {typeLabel[item.type]}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {item.timeAgo}
                      </span>
                    </div>
                    <p className="text-[13px] leading-snug text-slate-700">
                      {item.actorName ? (
                        <strong className="font-bold text-slate-900">
                          {item.actorName}{" "}
                        </strong>
                      ) : null}
                      {item.title}{" "}
                      {item.highlight ? (
                        <span
                          className={cn(
                            "font-semibold",
                            item.type === "donation"
                              ? "text-accent"
                              : "font-bold text-slate-900",
                          )}
                        >
                          {item.highlight}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}

          <Link
            to="/audit-log"
            className="border-t border-slate-200/60 pt-4 text-sm font-semibold tracking-wider text-primary transition-colors hover:text-accent text-center"
          >
            View all activity
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
