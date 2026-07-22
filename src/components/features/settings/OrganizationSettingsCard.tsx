import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { addToast, Button } from "@heroui/react";
import { Save } from "lucide-react";
import { SettingsField, fieldClass } from "./SettingsField";
import { useUpdateSiteSettingsSection } from "@/hooks";
import { uploadMedia } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

interface OrganizationSettingsCardProps {
  values: SiteSettings["organization"];
  index?: number;
}

type FormValues = SiteSettings["organization"];

/**
 * Organization identity section with per-section save.
 */
export function OrganizationSettingsCard({
  values,
  index = 0,
}: OrganizationSettingsCardProps): React.ReactElement {
  const mutation = useUpdateSiteSettingsSection();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, watch, reset, formState } =
    useForm<FormValues>({
      defaultValues: values,
    });

  useEffect(() => {
    reset(values);
    setLogoFile(null);
  }, [values, reset]);

  const name = watch("name") ?? "";
  const tagline = watch("tagline") ?? "";

  const submit = handleSubmit(async (data) => {
    try {
      setIsUploading(true);
      let logoUrl = data.logoUrl.trim();
      if (logoFile) {
        const uploaded = await uploadMedia(logoFile, "dgdf/settings");
        logoUrl = uploaded.imageUrl;
      }
      await mutation.mutateAsync({
        section: "organization",
        data: {
          name: data.name.trim(),
          tagline: data.tagline.trim(),
          logoUrl,
        },
      });
      setLogoFile(null);
      addToast({
        title: "Changes saved",
        description: "Organization details updated successfully",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to save. Try again.",
        color: "danger",
      });
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: EASE }}
      className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-ambient sm:p-7"
    >
      <header className="mb-6 border-b border-slate-100 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
          Organization
        </p>
        <h2 className="mt-1.5 font-display text-xl font-semibold text-primary">
          Brand identity
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Foundation name, and tagline used across the public site
        </p>
      </header>

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <SettingsField
          id="org-name"
          label="Organization Name"
          helper="Official name shown in the navbar, footer, and SEO"
          maxLength={80}
          count={name.length}
        >
          <input
            id="org-name"
            maxLength={80}
            className={fieldClass}
            {...register("name")}
          />
        </SettingsField>

        <SettingsField
          id="org-tagline"
          label="Tagline"
          helper="Short line that appears with your brand across marketing surfaces"
          maxLength={100}
          count={tagline.length}
        >
          <input
            id="org-tagline"
            maxLength={100}
            className={fieldClass}
            {...register("tagline")}
          />
        </SettingsField>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            color="primary"
            className="rounded-lg font-semibold"
            isLoading={mutation.isPending || isUploading}
            isDisabled={!formState.isDirty}
            startContent={
              mutation.isPending ? null : <Save className="h-4 w-4" />
            }
            onPress={() => void submit()}
          >
            Save organization
          </Button>
        </div>
      </form>
    </motion.section>
  );
}
