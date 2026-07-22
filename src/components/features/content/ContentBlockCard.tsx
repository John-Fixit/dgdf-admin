import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ChartNoAxesColumn, Link, Pencil, Phone, Type } from "lucide-react";
import {
  getStatChips,
  type ContentBlockDef,
  type ContentBlockIcon,
  type ContentFieldDef,
} from "./contentBlocks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLOCK_ICONS: Record<
  ContentBlockIcon,
  React.ComponentType<{ className?: string }>
> = {
  text: Type,
  stats: ChartNoAxesColumn,
  social: Link,
  contact: Phone,
};

interface ContentBlockCardProps {
  block: ContentBlockDef;
  values: Record<string, string | number>;
  index: number;
  onEdit: () => void;
  canEdit?: boolean;
}

/**
 * Formats a field value for the card preview.
 */
function formatFieldValue(
  field: ContentFieldDef,
  value: string | number | undefined,
): string {
  if (value == null || String(value).trim() === "") return "";

  if (field.type === "number") {
    const n = Number(value);
    const formatted = Number.isFinite(n)
      ? n.toLocaleString("en-US")
      : String(value);
    return field.suffix ? `${formatted}${field.suffix}` : formatted;
  }

  const text = String(value).trim();

  // Social / URL fields — show host for scannability
  if (/^https?:\/\//i.test(text)) {
    try {
      return new URL(text).hostname.replace(/^www\./, "");
    } catch {
      return text;
    }
  }

  return text;
}

/**
 * Compact field label for preview cells (e.g. "Vision Text" → "Vision").
 */
function previewLabel(label: string): string {
  return label
    .replace(/\s+(Text|URL|Number)$/i, "")
    .replace(/^Hero\s+/i, "")
    .replace(/^CTA\s+/i, "")
    .replace(/^Supporting\s+/i, "");
}

/**
 * Structured preview of section fields in public-facing order.
 */
function FieldPreviewGrid({
  fields,
  values,
}: {
  fields: ContentFieldDef[];
  values: Record<string, string | number>;
}): React.ReactElement {
  // Headline + body stack like the public hero/CTA sections
  const isStacked =
    fields.length === 2 &&
    fields[0]?.type === "text" &&
    fields[1]?.type === "textarea";

  const columns =
    isStacked || fields.length === 1
      ? 1
      : fields.length === 3
        ? 3
        : 2;

  return (
    <div
      className={cn(
        "mt-3 grid gap-x-4 gap-y-3.5",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {fields.map((field) => {
        const display = formatFieldValue(field, values[field.key]);
        return (
          <div key={field.key} className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {previewLabel(field.label)}
            </p>
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed text-slate-600",
                field.type === "textarea" ? "line-clamp-3" : "line-clamp-2",
                !display && "italic text-slate-300",
              )}
            >
              {display || "Not set"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Enterprise product-style card for a single editable content section.
 */
export function ContentBlockCard({
  block,
  values,
  index,
  onEdit,
  canEdit = true,
}: ContentBlockCardProps): React.ReactElement {
  const Icon = BLOCK_ICONS[block.icon];
  const statChips = getStatChips(block, values);
  const previewFields = block.fields.filter((field) => field.type !== "image");

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
      {/* Header — section identity */}
      <header className="relative flex items-start justify-between gap-4 bg-[#EBF0F7] px-6 py-5">
        <div className="min-w-0">
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
            {block.label}
          </span>

          <h3 className="mt-2.5 font-display text-lg font-bold leading-snug tracking-tight text-primary">
            {block.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
            {block.description}
          </p>
        </div>

        <Icon
          className="mt-0.5 h-5 w-5 shrink-0 text-primary/20 transition-colors duration-300 group-hover:text-primary/35"
          aria-hidden
        />
      </header>

      {/* Body — content preview + action */}
      <div className="flex flex-1 flex-col px-6 py-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent/70">
          Current Content
        </span>

        {statChips ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {statChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : previewFields.length > 0 ? (
          <FieldPreviewGrid fields={previewFields} values={values} />
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
              Edit
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
