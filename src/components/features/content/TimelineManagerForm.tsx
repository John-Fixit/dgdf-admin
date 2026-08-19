import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import {
  ChevronDown,
  ChevronUp,
  History,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  useConfirm,
  useCreateMilestone,
  useDeleteMilestone,
  useMilestones,
  useUpdateMilestone,
} from "@/hooks";
import { useDrawerStore } from "@/store/drawerStore";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const fieldClassNames = {
  label: "text-[11px] font-bold uppercase tracking-[0.14em] !text-accent",
  inputWrapper:
    "border-slate-200 bg-white shadow-none data-[hover=true]:border-primary/40 group-data-[focus=true]:border-primary",
  input: "text-sm text-slate-800",
  description: "text-xs text-slate-400",
} as const;

interface MilestoneDraft {
  year: string;
  title: string;
  description: string;
}

const EMPTY_DRAFT: MilestoneDraft = { year: "", title: "", description: "" };

function MilestoneEditRow({
  draft,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: {
  draft: MilestoneDraft;
  onChange: (draft: MilestoneDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}): React.ReactElement {
  const canSave = draft.year.trim() !== "" && draft.title.trim() !== "";

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-accent/[0.06] p-4">
      <div className="flex gap-3">
        <Input
          label="Year / Era"
          labelPlacement="outside"
          variant="bordered"
          placeholder="e.g. Beginnings"
          value={draft.year}
          onValueChange={(value) => onChange({ ...draft, year: value })}
          classNames={fieldClassNames}
          className="max-w-40 shrink-0"
        />
        <Input
          label="Title"
          labelPlacement="outside"
          variant="bordered"
          placeholder="e.g. Neighborhood Care"
          value={draft.title}
          onValueChange={(value) => onChange({ ...draft, title: value })}
          classNames={fieldClassNames}
          className="flex-1"
        />
      </div>
      <Textarea
        label="Description"
        labelPlacement="outside"
        variant="bordered"
        minRows={3}
        placeholder="What happened during this chapter of the journey?"
        value={draft.description}
        onValueChange={(value) => onChange({ ...draft, description: value })}
        classNames={fieldClassNames}
      />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="light"
          className="font-semibold"
          isDisabled={isSaving}
          startContent={<X className="h-3.5 w-3.5" />}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          color="primary"
          className="font-semibold"
          isLoading={isSaving}
          isDisabled={!canSave}
          startContent={isSaving ? null : <Save className="h-3.5 w-3.5" />}
          onPress={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function MilestoneViewRow({
  milestone,
  isFirst,
  isLast,
  isReordering,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  milestone: Milestone;
  isFirst: boolean;
  isLast: boolean;
  isReordering: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}): React.ReactElement {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 transition-colors duration-200 hover:border-primary/25">
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
          {milestone.year}
        </span>
        <h4 className="mt-2 font-display text-[15px] font-bold leading-snug text-primary">
          {milestone.title}
        </h4>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
          {milestone.description || (
            <span className="italic text-slate-300">No description</span>
          )}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          isDisabled={isFirst || isReordering}
          className="h-7 w-7 min-w-0 text-slate-400"
          onPress={onMoveUp}
          aria-label={`Move ${milestone.title} up`}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          isDisabled={isLast || isReordering}
          className="h-7 w-7 min-w-0 text-slate-400"
          onPress={onMoveDown}
          aria-label={`Move ${milestone.title} down`}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex shrink-0 flex-col gap-1 border-l border-slate-100 pl-3">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="h-7 w-7 min-w-0 text-slate-400 hover:text-primary"
          onPress={onEdit}
          aria-label={`Edit ${milestone.title}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="h-7 w-7 min-w-0 text-slate-400 hover:text-error"
          onPress={onDelete}
          aria-label={`Delete ${milestone.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Full CRUD manager for the About page's history timeline, rendered
 * inside the Content Manager's slide-over drawer. Each add/edit/
 * delete/reorder action saves immediately via its own mutation.
 */
export function TimelineManagerForm(): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer);
  const { data, isLoading } = useMilestones();
  const createMutation = useCreateMilestone();
  const updateMutation = useUpdateMilestone();
  const deleteMutation = useDeleteMilestone();
  const { confirm } = useConfirm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<MilestoneDraft>(EMPTY_DRAFT);
  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<MilestoneDraft>(EMPTY_DRAFT);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const milestones = data ?? [];
  const nextSortOrder =
    milestones.length === 0
      ? 0
      : Math.max(...milestones.map((m) => m.sortOrder)) + 1;

  function startEdit(milestone: Milestone): void {
    setIsCreating(false);
    setEditingId(milestone.id);
    setEditDraft({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
    });
  }

  async function saveEdit(): Promise<void> {
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        payload: {
          year: editDraft.year.trim(),
          title: editDraft.title.trim(),
          description: editDraft.description.trim(),
        },
      });
      setEditingId(null);
      addToast({ title: "Milestone updated", color: "success" });
    } catch {
      addToast({ title: "Failed to save. Try again.", color: "danger" });
    }
  }

  async function saveCreate(): Promise<void> {
    try {
      await createMutation.mutateAsync({
        year: createDraft.year.trim(),
        title: createDraft.title.trim(),
        description: createDraft.description.trim(),
        sortOrder: nextSortOrder,
      });
      setIsCreating(false);
      setCreateDraft(EMPTY_DRAFT);
      addToast({ title: "Milestone added", color: "success" });
    } catch {
      addToast({ title: "Failed to add milestone. Try again.", color: "danger" });
    }
  }

  async function handleDelete(milestone: Milestone): Promise<void> {
    const ok = await confirm({
      title: `Remove "${milestone.title}"?`,
      description: "This removes the milestone from the About page timeline.",
      confirmLabel: "Remove",
      cancelLabel: "Keep",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(milestone.id);
      if (editingId === milestone.id) setEditingId(null);
      addToast({ title: "Milestone removed", color: "success" });
    } catch {
      addToast({ title: "Failed to remove. Try again.", color: "danger" });
    }
  }

  async function handleMove(index: number, direction: -1 | 1): Promise<void> {
    const neighborIndex = index + direction;
    const current = milestones[index];
    const neighbor = milestones[neighborIndex];
    if (!current || !neighbor) return;

    setReorderingId(current.id);
    try {
      await Promise.all([
        updateMutation.mutateAsync({
          id: current.id,
          payload: { sortOrder: neighbor.sortOrder },
        }),
        updateMutation.mutateAsync({
          id: neighbor.id,
          payload: { sortOrder: current.sortOrder },
        }),
      ]);
    } catch {
      addToast({ title: "Failed to reorder. Try again.", color: "danger" });
    } finally {
      setReorderingId(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-slate-500">
            {milestones.length}{" "}
            {milestones.length === 1 ? "milestone" : "milestones"} in the
            journey
          </p>
          {!isCreating ? (
            <Button
              size="sm"
              variant="bordered"
              className="rounded-lg border-primary/20 font-semibold text-primary"
              startContent={<Plus className="h-3.5 w-3.5" />}
              onPress={() => {
                setEditingId(null);
                setCreateDraft(EMPTY_DRAFT);
                setIsCreating(true);
              }}
            >
              Add Milestone
            </Button>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {isCreating ? (
            <motion.div
              key="create-row"
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <MilestoneEditRow
                draft={createDraft}
                onChange={setCreateDraft}
                onSave={() => void saveCreate()}
                onCancel={() => setIsCreating(false)}
                isSaving={createMutation.isPending}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        ) : milestones.length === 0 && !isCreating ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 py-12 text-center">
            <History className="h-8 w-8 text-slate-300" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-slate-600">
                No milestones yet
              </p>
              <p className="mt-1 max-w-xs text-[13px] text-slate-400">
                Add your foundation's first milestone to build the journey
                timeline shown on the About page.
              </p>
            </div>
            <Button
              size="sm"
              color="primary"
              className="mt-1 rounded-lg font-semibold"
              startContent={<Plus className="h-3.5 w-3.5" />}
              onPress={() => setIsCreating(true)}
            >
              Add Milestone
            </Button>
          </div>
        ) : (
          <ol className="relative space-y-4">
            <AnimatePresence initial={false}>
              {milestones.map((milestone, index) => (
                <motion.li
                  key={milestone.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center pt-1">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-[12px] font-bold",
                        editingId === milestone.id
                          ? "bg-accent text-primary"
                          : "bg-primary text-white",
                      )}
                    >
                      {index + 1}
                    </span>
                    {index < milestones.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-slate-200" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    {editingId === milestone.id ? (
                      <MilestoneEditRow
                        draft={editDraft}
                        onChange={setEditDraft}
                        onSave={() => void saveEdit()}
                        onCancel={() => setEditingId(null)}
                        isSaving={updateMutation.isPending}
                      />
                    ) : (
                      <MilestoneViewRow
                        milestone={milestone}
                        isFirst={index === 0}
                        isLast={index === milestones.length - 1}
                        isReordering={
                          reorderingId !== null || updateMutation.isPending
                        }
                        onEdit={() => startEdit(milestone)}
                        onDelete={() => void handleDelete(milestone)}
                        onMoveUp={() => void handleMove(index, -1)}
                        onMoveDown={() => void handleMove(index, 1)}
                      />
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>

      <div className="sticky -bottom-6 mt-8 flex border-t border-slate-100 bg-white pt-5 pb-5 z-10">
        <Button
          color="primary"
          className="w-full rounded-lg font-semibold tracking-wide"
          onPress={closeDrawer}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
