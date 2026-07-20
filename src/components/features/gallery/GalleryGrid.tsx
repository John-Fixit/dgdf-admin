import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Input, Pagination, addToast } from "@heroui/react";
import {
  Camera,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { LoadingSpinner } from "@/components/shared";
import { useDeleteGallery, useGallery, useConfirm } from "@/hooks";
import { mockGalleryStats } from "@/mock-data";
import { useDrawerStore } from "@/store/drawerStore";
import type { GalleryItem } from "@/lib/types";
import { GalleryUploadForm } from "./GalleryUploadForm";
import { GalleryViewPanel } from "./GalleryViewPanel";

const PAGE_SIZE = 12;
const EASE = [0.22, 1, 0.36, 1] as const;

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onView: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
  isDeleting: boolean;
}

/**
 * Single gallery asset card with hover actions.
 */
function GalleryCard({
  item,
  index,
  onView,
  onDelete,
  isDeleting,
}: GalleryCardProps): React.ReactElement {
  const meta = [item.category, item.location].filter(Boolean).join(" • ");
  const fileMeta = [item.fileSize, item.format].filter(Boolean).join(" • ");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: EASE }}
      className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white shadow-ambient transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            isIconOnly
            radius="full"
            className="bg-white text-primary"
            aria-label={`View ${item.title}`}
            onPress={() => onView(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            isIconOnly
            radius="full"
            className="bg-white text-error"
            aria-label={`Delete ${item.title}`}
            isDisabled={isDeleting}
            onPress={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white p-4">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {meta}
        </span>
        <h3 className="truncate text-sm font-semibold tracking-wide text-primary">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3">
          <span className="text-xs font-medium text-slate-500">
            {fileMeta || "—"}
          </span>
          <Button
            isIconOnly
            variant="light"
            className="min-w-0 text-slate-400 data-[hover=true]:bg-transparent data-[hover=true]:text-primary"
            aria-label="More options"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Dashed upload tile that opens the shared drawer.
 */
function UploadTile({
  onUpload,
}: {
  onUpload: () => void;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: EASE }}
    >
      <Button
        variant="bordered"
        onPress={onUpload}
        className="group flex h-auto min-h-0 w-full flex-col items-center justify-center gap-0 rounded-lg border-2 border-dashed border-slate-300 bg-transparent px-4 py-0 data-[hover=true]:border-primary data-[hover=true]:bg-primary/5 aspect-[4/3]"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-data-[hover=true]:bg-primary group-data-[hover=true]:text-white">
          <Plus className="h-5 w-5" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-slate-500 group-data-[hover=true]:text-primary">
          Upload New Asset
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          JPG, PNG, WEBP (Max 10MB)
        </span>
      </Button>
    </motion.div>
  );
}

/**
 * Gallery manager grid with filters, stats, and pagination.
 */
export function GalleryGrid(): React.ReactElement {
  const { data, isLoading, isError, error, refetch } = useGallery();
  const deleteMutation = useDeleteGallery();
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  const { confirm } = useConfirm();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const items = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openUploadDrawer(): void {
    openDrawer({
      title: "Add Gallery Media",
      description:
        "Upload multiple photos or videos, then review details before saving.",
      size: "2xl",
      content: <GalleryUploadForm />,
    });
  }

  function openViewDrawer(item: GalleryItem): void {
    openDrawer({
      title: item.title,
      description: [item.category, item.location].filter(Boolean).join(" • "),
      size: "lg",
      content: <GalleryViewPanel item={item} />,
    });
  }

  async function handleDelete(item: GalleryItem): Promise<void> {
    const confirmed = await confirm({
      title: "Remove image?",
      description: `Remove "${item.title}" from the gallery? This cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      addToast({
        title: "Image deleted successfully",
        description: "The gallery has been updated.",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Please try again.",
        color: "danger",
      });
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading gallery…" />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error ? error.message : "Failed to load gallery"}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
        className="flex flex-wrap items-center justify-between gap-6"
      >
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-ambient">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              Total assets:
            </span>
            <span className="text-sm font-semibold tracking-wide text-primary">
              {mockGalleryStats.totalAssets}
            </span>
          </div>
          {/* <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-ambient">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              Storage:
            </span>
            <span className="text-sm font-semibold tracking-wide text-primary">
              {mockGalleryStats.storageUsed} / {mockGalleryStats.storageLimit}
            </span>
          </div> */}
        </div>

        <div className="flex items-center gap-3">
          <Input
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search assets…"
            startContent={<Search className="h-4 w-4 text-slate-400" />}
            classNames={{
              base: "w-64",
              inputWrapper:
                "border border-slate-200 bg-white shadow-none data-[hover=true]:bg-white",
            }}
            variant="bordered"
            size="sm"
          />
          <Button
            isIconOnly
            variant="bordered"
            className="border-slate-200 bg-white"
            aria-label="Filter assets"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {pageItems.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              onView={openViewDrawer}
              onDelete={(target) => void handleDelete(target)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </AnimatePresence>
        <UploadTile onUpload={openUploadDrawer} />
      </div>

      {pageItems.length === 0 && filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center"
        >
          <Camera className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">
            No gallery images yet. Upload your first photo.
          </p>
          <Button color="primary" onPress={openUploadDrawer}>
            Upload New
          </Button>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
        className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 py-6 sm:flex-row"
      >
        <span className="text-sm text-slate-500">
          Showing {showingFrom}-{showingTo} of {filtered.length} assets
        </span>
        <Pagination
          page={page}
          total={pageCount}
          onChange={setPage}
          showControls
          color="primary"
          classNames={{
            cursor: "bg-primary text-white",
          }}
        />
      </motion.div>
    </div>
  );
}
