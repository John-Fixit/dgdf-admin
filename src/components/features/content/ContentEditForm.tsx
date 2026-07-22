import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addToast, Button, cn, Input, Textarea } from "@heroui/react";
import { Save } from "lucide-react";
import type { ContentBlockDef } from "./contentBlocks";
import { ImageUploadField } from "@/components/shared";
import { useUpdateContentSection } from "@/hooks";
import { uploadMedia } from "@/lib/api";
import { useDrawerStore } from "@/store/drawerStore";

interface ContentEditFormProps {
  block: ContentBlockDef;
  initialValues: Record<string, string | number>;
}

const fieldClassNames = {
  label: "text-[11px] font-bold uppercase tracking-[0.14em] !text-accent",
  inputWrapper:
    "border-slate-200 bg-white shadow-none data-[hover=true]:border-primary/40 group-data-[focus=true]:border-primary",
  input: "text-sm text-slate-800",
  description: "text-xs text-slate-400",
} as const;

/**
 * Section edit form rendered inside the slide-over drawer.
 */
export function ContentEditForm({
  block,
  initialValues,
}: ContentEditFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer);
  const saveMutation = useUpdateContentSection();
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>(
    {},
  );

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        block.fields.map((field) => [
          field.key,
          initialValues[field.key] ?? (field.type === "number" ? 0 : ""),
        ]),
      ),
    [block.fields, initialValues],
  );

  const { control, handleSubmit, reset, formState } = useForm<
    Record<string, string | number>
  >({
    defaultValues,
  });

  console.log(block);

  useEffect(() => {
    reset(defaultValues);
    setPendingFiles({});
  }, [defaultValues, reset]);

  const isSaving = saveMutation.isPending;

  async function handleSave(
    data: Record<string, string | number>,
  ): Promise<void> {
    const normalised: Record<string, string | number> = {};
    for (const field of block.fields) {
      const raw = data[field.key];
      if (field.type === "number") {
        normalised[field.key] = Number(raw) || 0;
      } else {
        normalised[field.key] = String(raw ?? "");
      }
    }

    try {
      for (const field of block.fields) {
        if (field.type !== "image") continue;
        const file = pendingFiles[field.key];
        if (file) {
          const uploaded = await uploadMedia(
            file,
            `dgdf/content/${block.page}`,
          );
          normalised[field.key] = uploaded.imageUrl;
        }
      }

      const missingImage = block.fields.some(
        (field) =>
          field.type === "image" && !String(normalised[field.key] ?? "").trim(),
      );
      if (missingImage) {
        addToast({
          title: "Please upload required images",
          description: "An image is required for this section.",
          color: "danger",
        });
        return;
      }

      await saveMutation.mutateAsync({
        page: block.page,
        section: block.id,
        data: normalised,
      });
      closeDrawer();
      addToast({
        title: "Changes saved",
        description: "Section updated successfully",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to save. Try again.",
        color: "danger",
      });
    }
  }

  const submit = handleSubmit((data) => {
    void handleSave(data);
  });

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div
        className={cn(
          "flex-1 space-y-6",
          block.id === "impactStats" ? "grid grid-cols-2 gap-8" : "",
        )}
      >
        {block.fields.map((field) => {
          if (field.type === "image") {
            return (
              <Controller
                key={field.key}
                name={field.key}
                control={control}
                render={({ field: formField }) => (
                  <ImageUploadField
                    label={field.label}
                    helper={field.helper}
                    value={String(formField.value ?? "")}
                    onChange={(url, file) => {
                      setPendingFiles((prev) => ({
                        ...prev,
                        [field.key]: file,
                      }));
                      formField.onChange(url);
                    }}
                  />
                )}
              />
            );
          }

          if (field.type === "textarea") {
            return (
              <Controller
                key={field.key}
                name={field.key}
                control={control}
                render={({ field: formField }) => (
                  <Textarea
                    label={field.label}
                    labelPlacement="outside"
                    variant="bordered"
                    minRows={field.rows ?? 4}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    description={field.helper}
                    value={String(formField.value ?? "")}
                    onValueChange={formField.onChange}
                    onBlur={formField.onBlur}
                    classNames={{
                      ...fieldClassNames,
                      inputWrapper: `${fieldClassNames.inputWrapper} py-2`,
                    }}
                  />
                )}
              />
            );
          }

          return (
            <Controller
              key={field.key}
              name={field.key}
              control={control}
              render={({ field: formField }) => (
                <Input
                  type={field.type === "number" ? "number" : "text"}
                  label={field.label}
                  labelPlacement="outside"
                  variant="bordered"
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  description={field.helper}
                  value={String(formField.value ?? "")}
                  onValueChange={(value) => {
                    if (field.type === "number") {
                      formField.onChange(
                        Number.isFinite(Number(value)) ? Number(value) : 0,
                      );
                      return;
                    }
                    formField.onChange(value);
                  }}
                  onBlur={formField.onBlur}
                  endContent={
                    field.suffix ? (
                      <span className="text-sm font-medium text-slate-400">
                        {field.suffix}
                      </span>
                    ) : undefined
                  }
                  className={field.type === "number" ? "max-w55" : undefined}
                  classNames={fieldClassNames}
                />
              )}
            />
          );
        })}
      </div>

      <div className="sticky -bottom-6 mt-8 flex gap-3 border-t border-slate-100 bg-white pt-5 pb-5 z-10">
        <Button
          type="button"
          variant="bordered"
          className="flex-1 rounded-lg border-slate-200 font-semibold"
          isDisabled={isSaving}
          onPress={closeDrawer}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          className="flex-1 rounded-lg font-semibold tracking-wide"
          isLoading={isSaving}
          isDisabled={!formState.isDirty}
          startContent={isSaving ? null : <Save className="h-4 w-4" />}
          onPress={() => void submit()}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}
