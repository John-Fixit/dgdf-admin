import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  FileText,
  HandHeart,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft icon-chip color per action, filling solid on hover. */
const TONE_CLASSES = {
  violet:
    "bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
  sky: "bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
  amber:
    "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white",
  rose: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
} as const;

const ACTIONS: {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: keyof typeof TONE_CLASSES;
}[] = [
  {
    label: "Add gallery media",
    description: "Upload photos & videos",
    href: "/gallery",
    icon: Camera,
    tone: "violet",
  },
  {
    label: "Review inbox",
    description: "Partnership & inquiries",
    href: "/messages",
    icon: Mail,
    tone: "sky",
  },
  {
    label: "Update site content",
    description: "Editorial control center",
    href: "/content",
    icon: FileText,
    tone: "amber",
  },
  {
    label: "Donation ledger",
    description: "Funds & transaction status",
    href: "/donations",
    icon: HandHeart,
    tone: "rose",
  },
];

/**
 * Shortcut grid into high-value admin workflows.
 */
export function QuickActions(): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
      aria-label="Quick actions"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="p-6 sm:p-8">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Command shortcuts
          </p>
          <h2 className="mb-6 font-display text-xl font-semibold text-primary">
            Quick Actions
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-1">
            {ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.li
                  key={action.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + index * 0.05, ease: EASE }}
                  className="h-full"
                >
                  <Link
                    to={action.href}
                    className="group flex h-full items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-ambient"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-400",
                        TONE_CLASSES[action.tone],
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-primary">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.section>
  );
}
