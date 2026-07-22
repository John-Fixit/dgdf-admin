import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge, Card } from "@/components/ui";
import type { DashboardRecentDonation } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface RecentDonationsTableProps {
  donations: DashboardRecentDonation[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Recent donations table powered by live dashboard data.
 */
export function RecentDonationsTable({
  donations,
}: RecentDonationsTableProps): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.44, ease: EASE }}
    >
      <Card className="overflow-hidden border-slate-200/60 shadow-luxury">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/60 px-8 py-6 sm:px-10">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Giving
            </p>
            <h2 className="font-display text-2xl font-semibold text-primary">
              Recent Donations
            </h2>
          </div>
          <Link
            to="/donations"
            className="text-[11px] font-bold uppercase tracking-widest text-accent transition-colors hover:text-accent/80"
          >
            View all
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="px-8 py-12 text-center sm:px-10">
            <p className="text-sm font-medium text-slate-600">
              No donations recorded yet
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Successful and pending gifts will appear here as they come in.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  <th className="px-8 py-4 sm:px-10">Donor</th>
                  <th className="px-8 py-4 sm:px-10">Amount</th>
                  <th className="px-8 py-4 sm:px-10">Status</th>
                  <th className="px-8 py-4 sm:px-10">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((donation, index) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.04, ease: EASE }}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-8 py-2 sm:px-10">
                      <p className="font-semibold text-primary">
                        {donation.donorName}
                      </p>
                      {donation.email ? (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {donation.email}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-8 py-2 font-medium text-slate-700 sm:px-10">
                      {formatCurrency(donation.amount, donation.currency)}
                    </td>
                    <td className="px-8 py-2 sm:px-10">
                      <StatusBadge status={donation.status} />
                    </td>
                    <td className="px-8 py-2 text-slate-500 sm:px-10">
                      {formatDateTime(donation.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.section>
  );
}

function StatusBadge({
  status,
}: {
  status: DashboardRecentDonation["status"];
}): React.ReactElement {
  if (status === "success") {
    return (
      <Badge className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
        Success
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge className="rounded bg-accent/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
        Pending
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="rounded bg-error/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-error"
    >
      Failed
    </Badge>
  );
}
