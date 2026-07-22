import { useCallback, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Input, Select, SelectItem, addToast } from "@heroui/react";
import { FileImage, Upload, Video, X } from "lucide-react";
import { useUploadGallery } from "@/hooks";
import { useDrawerStore } from "@/store/drawerStore";
import { cn } from "@/lib/utils";
import type { GalleryUploadPayload } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_FILES = 50;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT =
  "image/jpeg,image/png,image/webp,video/mp4,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.webm";

const MEDIA_TYPES = [
  { key: "auto", label: "Auto-detect" },
  { key: "image", label: "Image" },
  { key: "video", label: "Video" },
] as const;

const STATUSES = [
  { key: "active", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
] as const;

interface SharedDefaults {
  category: string;
  sortOrder: number;
  mediaType: (typeof MEDIA_TYPES)[number]["key"];
  status: (typeof STATUSES)[number]["key"];
}

interface PendingFile {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  kind: "image" | "video";
}

/**
 * Formats a byte size for display.
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Derives a clean title from a file name.
 */
function titleFromFileName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolves whether a file is an image or video.
 */
function detectKind(
  file: File,
  mediaType: SharedDefaults["mediaType"],
): "image" | "video" | null {
  if (mediaType === "image") {
    return file.type.startsWith("image/") ? "image" : null;
  }
  if (mediaType === "video") {
    return file.type.startsWith("video/") ? "video" : null;
  }
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

/**
 * Premium multi-file gallery upload form — shared defaults + dropzone + review.
 */
export function GalleryUploadForm(): React.ReactElement {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeDrawer = useDrawerStore((s) => s.closeDrawer);
  const uploadMutation = useUploadGallery();
  const [isDragging, setIsDragging] = useState(false);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, getValues } = useForm<SharedDefaults>({
    defaultValues: {
      category: "General",
      sortOrder: 0,
      mediaType: "auto",
      status: "active",
    },
  });

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const defaults = getValues();
      const incoming = Array.from(fileList);
      const next: PendingFile[] = [];
      const errors: string[] = [];

      for (const file of incoming) {
        if (pending.length + next.length >= MAX_FILES) {
          errors.push(`You can upload up to ${MAX_FILES} files at once.`);
          break;
        }
        if (file.size > MAX_BYTES) {
          errors.push(`${file.name} exceeds the 10 MB limit.`);
          continue;
        }
        const kind = detectKind(file, defaults.mediaType);
        if (!kind) {
          errors.push(`${file.name} is not an allowed type for this default.`);
          continue;
        }
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          title: titleFromFileName(file.name) || "Untitled asset",
          kind,
        });
      }

      if (errors.length > 0) {
        setFormError(errors[0] ?? "Some files could not be added.");
      } else {
        setFormError(null);
      }
      if (next.length > 0) {
        setPending((prev) => [...prev, ...next]);
      }
    },
    [getValues, pending.length],
  );

  function removePending(id: string): void {
    setPending((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

  function updateTitle(id: string, title: string): void {
    setPending((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title } : item)),
    );
  }

  async function handleSave(): Promise<void> {
    if (pending.length === 0) {
      setFormError("Add at least one photo or video to continue.");
      return;
    }

    const defaults = getValues();
    setFormError(null);

    try {
      for (const [index, item] of pending.entries()) {
        const payload: GalleryUploadPayload = {
          title: item.title.trim() || "Untitled asset",
          description: "",
          category: defaults.category.trim() || "General",
          imageUrl: item.previewUrl,
          status: defaults.status,
          sortOrder: defaults.sortOrder + index,
          mediaType: item.kind,
          file: item.file,
        };
        await uploadMutation.mutateAsync(payload);
      }

      addToast({
        title: "Media added to gallery",
        description: `${pending.length} asset${pending.length === 1 ? "" : "s"} saved successfully.`,
        color: "success",
      });
      closeDrawer();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) {
              addFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (event.dataTransfer.files?.length) {
              addFiles(event.dataTransfer.files);
            }
          }}
          className={cn(
            "group flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-all duration-300 sm:py-14",
            isDragging
              ? "border-primary bg-primary/[0.04] shadow-ambient"
              : "border-slate-300 bg-slate-50/60 hover:border-primary/50 hover:bg-primary/[0.03]",
          )}
        >
          <motion.div
            animate={isDragging ? { scale: 1.06 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <Upload className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </motion.div>

          <p className="text-base font-semibold tracking-tight text-primary sm:text-lg">
            Drop files here or click to browse
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Upload up to {MAX_FILES} photos or videos at once
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <FileImage className="h-3.5 w-3.5" aria-hidden />
              JPG, PNG, WEBP
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" aria-hidden />
              MP4, WEBM
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden>
              |
            </span>
            <span>Max 10 MB each</span>
          </div>
        </button>
      </motion.div>

      {/* Pending review */}
      <AnimatePresence initial={false}>
        {pending.length > 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="space-y-3"
            aria-label="Files ready to review"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Review · {pending.length} file{pending.length === 1 ? "" : "s"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  for (const item of pending) {
                    URL.revokeObjectURL(item.previewUrl);
                  }
                  setPending([]);
                }}
                className="text-xs font-semibold text-slate-400 transition-colors hover:text-error cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <ul className="max-h-64 space-y-2 overflow-y-auto scrollbar-thin pr-1">
              {pending.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{
                    duration: 0.22,
                    delay: index * 0.03,
                    ease: EASE,
                  }}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.kind === "image" ? (
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary">
                        <Video className="h-5 w-5" aria-hidden />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <Input
                      size="sm"
                      variant="bordered"
                      value={item.title}
                      onValueChange={(value) => updateTitle(item.id, value)}
                      aria-label={`Title for ${item.file.name}`}
                      classNames={{
                        inputWrapper:
                          "h-8 min-h-8 border-slate-200 shadow-none",
                        input: "text-sm font-medium text-primary",
                      }}
                    />
                    <p className="truncate text-[11px] text-slate-400">
                      {item.file.name} · {formatBytes(item.file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePending(item.id)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-error/5 hover:text-error cursor-pointer"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {/* Shared defaults */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6"
        aria-labelledby="shared-defaults-heading"
      >
        <h3
          id="shared-defaults-heading"
          className="mb-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400"
        >
          Shared Defaults
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Input
                label="Category"
                labelPlacement="outside"
                variant="bordered"
                value={field.value}
                onValueChange={field.onChange}
                classNames={{
                  label: "text-sm font-semibold text-primary",
                  inputWrapper:
                    "border-slate-200 shadow-none data-[hover=true]:border-primary/40",
                }}
              />
            )}
          />

          <Controller
            name="sortOrder"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                label="Starting sort order"
                labelPlacement="outside"
                variant="bordered"
                value={String(field.value)}
                onValueChange={(value) =>
                  field.onChange(
                    Number.isFinite(Number(value)) ? Number(value) : 0,
                  )
                }
                classNames={{
                  label: "text-sm font-semibold text-primary",
                  inputWrapper:
                    "border-slate-200 shadow-none data-[hover=true]:border-primary/40",
                }}
              />
            )}
          />

          <Controller
            name="mediaType"
            control={control}
            render={({ field }) => (
              <Select
                label="Default type"
                labelPlacement="outside"
                variant="bordered"
                selectedKeys={[field.value]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  if (typeof value === "string") field.onChange(value);
                }}
                classNames={{
                  label: "text-sm font-semibold text-primary",
                  trigger:
                    "border-slate-200 shadow-none data-[hover=true]:border-primary/40",
                }}
              >
                {MEDIA_TYPES.map((type) => (
                  <SelectItem key={type.key}>{type.label}</SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                labelPlacement="outside"
                variant="bordered"
                selectedKeys={[field.value]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  if (typeof value === "string") field.onChange(value);
                }}
                classNames={{
                  label: "text-sm font-semibold text-primary",
                  trigger:
                    "border-slate-200 shadow-none data-[hover=true]:border-primary/40",
                }}
              >
                {STATUSES.map((status) => (
                  <SelectItem key={status.key}>{status.label}</SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </motion.section>

      {formError ? (
        <p className="text-sm text-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Button
          variant="bordered"
          className="border-slate-200 font-semibold"
          onPress={closeDrawer}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          className="font-semibold tracking-wide"
          isLoading={uploadMutation.isPending}
          onPress={() => void handleSave()}
          startContent={
            uploadMutation.isPending ? null : (
              <Upload className="h-4 w-4" aria-hidden />
            )
          }
        >
          {pending.length > 0
            ? `Save ${pending.length} asset${pending.length === 1 ? "" : "s"}`
            : "Save to gallery"}
        </Button>
      </div>
    </div>
  );
}
