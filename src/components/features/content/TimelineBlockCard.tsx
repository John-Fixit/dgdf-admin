import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { History, Pencil } from "lucide-react";
import { useMilestones } from "@/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface TimelineBlockCardProps {
  index: number;
  onEdit: () => void;
  canEdit?: boolean;
}

/**
 * Content Manager card for the About page's history timeline —
 * milestones live in their own collection, so this bypasses the
 * generic scalar-field ContentBlockCard preview.
 */
export function TimelineBlockCard({
  index,
  onEdit,
  canEdit = true,
}: TimelineBlockCardProps): React.ReactElement {
  const { data, isLoading } = useMilestones();
  const milestones = data ?? [];
  const yearRange =
    milestones.length > 1
      ? `${milestones[0]?.year} → ${milestones[milestones.length - 1]?.year}`
      : milestones[0]?.year;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
      className={cn(
        "group flex h-full min-h-30 flex-col overflow-hidden rounded-[14px]",
        "border border-[#E5E9EF] bg-white",
        "transition-[box-shadow,border-color] duration-300",
        "hover:border-primary/25 hover:shadow-[0_8px_24px_-12px_rgba(26,58,92,0.12)]",
      )}
    >
      <header className="relative flex items-start justify-between gap-4 bg-[#EBF0F7] px-6 py-5">
        <div className="min-w-0">
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
            Timeline
          </span>

          <h3 className="mt-2.5 font-display text-lg font-bold leading-snug tracking-tight text-primary">
            History Timeline
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
            Milestones shown in the About page journey section
          </p>
        </div>

        <History
          className="mt-0.5 h-5 w-5 shrink-0 text-primary/20 transition-colors duration-300 group-hover:text-primary/35"
          aria-hidden
        />
      </header>

      <div className="flex flex-1 flex-col px-6 py-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent/70">
          Current Content
        </span>

        {isLoading ? (
          <p className="mt-3 text-sm italic text-slate-300">Loading…</p>
        ) : milestones.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600">
              {milestones.length}{" "}
              {milestones.length === 1 ? "milestone" : "milestones"}
            </span>
            {yearRange ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600">
                {yearRange}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm italic text-slate-300">No content yet</p>
        )}

        <div className="mt-auto flex justify-end pt-5">
          {canEdit ? (
            <Button
              size="sm"
              className={cn(
                "h-9 rounded-lg bg-primary px-4 font-semibold text-white",
                "transition-colors duration-200",
                "hover:bg-accent hover:text-primary",
                "data-[hover=true]:bg-accent data-[hover=true]:text-primary",
              )}
              startContent={<Pencil className="h-3.5 w-3.5" />}
              onPress={onEdit}
            >
              Edit Timeline
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
