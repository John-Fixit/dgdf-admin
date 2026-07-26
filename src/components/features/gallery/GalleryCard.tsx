import { motion } from "framer-motion";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_VARIANT: Record<
  GalleryItem["status"],
  "success" | "secondary" | "warning"
> = {
  active: "success",
  draft: "secondary",
  archived: "warning",
};

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  canManage?: boolean;
}

/**
 * Premium gallery asset card with status badge and actions.
 * Mobile: actions menu in the footer. Desktop: hover overlay on the media.
 */
export function GalleryCard({
  item,
  index,
  onView,
  onEdit,
  onDelete,
  isDeleting,
  canManage = true,
}: GalleryCardProps): React.ReactElement {
  const meta = [item.category, item.location].filter(Boolean).join(" · ");
  const fileMeta = [item.fileSize, item.format].filter(Boolean).join(" · ");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: EASE }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-ambient",
        "transition-shadow duration-300 hover:shadow-luxury",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {item.mediaType === "video" ? (
          <video
            src={item.imageUrl}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={STATUS_VARIANT[item.status]}>
            {item.status === "active"
              ? "Published"
              : item.status === "draft"
                ? "Draft"
                : "Archived"}
          </Badge>
          {item.mediaType === "video" ? (
            <Badge variant="outline">Video</Badge>
          ) : null}
        </div>

        {/* Large screens: hover overlay actions */}
        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-primary/35 opacity-0 transition-opacity md:flex md:group-hover:opacity-100">
          <Button
            isIconOnly
            size="sm"
            className="rounded-lg bg-white text-primary"
            aria-label={`View ${item.title}`}
            onPress={onView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {canManage ? (
            <>
              <Button
                isIconOnly
                size="sm"
                className="rounded-lg bg-white text-primary"
                aria-label={`Edit ${item.title}`}
                onPress={onEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                className="rounded-lg bg-white text-error"
                aria-label={`Delete ${item.title}`}
                isDisabled={isDeleting}
                onPress={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
          {meta || "Uncategorised"}
        </p>
        <h3 className="mt-1.5 line-clamp-1 font-display text-lg font-semibold tracking-tight text-primary">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
          {item.description || "No description"}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className="min-w-0 truncate text-xs font-medium text-slate-400">
            {fileMeta || "—"}
          </span>

          {/* Small screens: actions dropdown */}
          <div className="md:hidden">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="min-w-0 rounded-lg text-slate-500"
                  aria-label={`Actions for ${item.title}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              {canManage ? (
                <DropdownMenu
                  aria-label={`Actions for ${item.title}`}
                  disabledKeys={isDeleting ? ["delete"] : []}
                  onAction={(key) => {
                    if (key === "view") onView();
                    if (key === "edit") onEdit();
                    if (key === "delete") onDelete();
                  }}
                >
                  <DropdownItem
                    key="view"
                    startContent={<Eye className="h-4 w-4" />}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<Pencil className="h-4 w-4" />}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-error"
                    color="danger"
                    startContent={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu
                  aria-label={`Actions for ${item.title}`}
                  onAction={(key) => {
                    if (key === "view") onView();
                  }}
                >
                  <DropdownItem
                    key="view"
                    startContent={<Eye className="h-4 w-4" />}
                  >
                    View
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
