import { motion } from "framer-motion";
import { addToast, Button } from "@heroui/react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SettingsPreviewRow } from "./SettingsPreviewRow";
import { SocialSettingsForm } from "./SocialSettingsForm";
import { useAuth, useDrawer } from "@/hooks";
import { can, PERMISSION_DENIED_MESSAGE } from "@/lib/permissions";
import type { SiteSettings } from "@/lib/types";
import { Pencil } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface SocialSettingsCardProps {
  values: SiteSettings["social"];
  index?: number;
}

/**
 * Truncates a social URL for display while keeping the full href.
 */
function displayUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

/**
 * Social accounts preview card — edit opens a drawer form.
 */
export function SocialSettingsCard({
  values,
  index = 2,
}: SocialSettingsCardProps): React.ReactElement {
  const { open } = useDrawer();
  const { user } = useAuth();
  const canEdit = can(user?.role, "manageContent");

  function handleEdit(): void {
    if (!canEdit) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: "danger" });
      return;
    }
    open({
      title: "Edit social media accounts",
      description: "Profile URLs linked from the footer and contact page",
      size: "lg",
      placement: "right",
      content: <SocialSettingsForm values={values} />,
    });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: EASE }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-ambient"
    >
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 bg-[#EBF0F7] px-6 py-5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Social
          </p>
          <h2 className="mt-1.5 font-display text-xl font-semibold text-primary">
            Social media accounts
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Profiles linked from the footer and contact page
          </p>
        </div>
        {canEdit ? (
          <Button
            size="sm"
            className="h-7 shrink-0 rounded-lg bg-primary px-2 font-semibold text-white data-[hover=true]:bg-accent data-[hover=true]:text-primary"
            startContent={<Pencil className="h-3.5 w-3.5" />}
            onPress={handleEdit}
          >
            Edit
          </Button>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <SettingsPreviewRow
          icon={FaFacebook}
          label="Facebook"
          value={displayUrl(values.facebook) || values.facebook}
          href={values.facebook.trim() || undefined}
          tone="bg-[#1877F2]/10 text-[#1877F2]"
        />
        <SettingsPreviewRow
          icon={FaInstagram}
          label="Instagram"
          value={displayUrl(values.instagram) || values.instagram}
          href={values.instagram.trim() || undefined}
          tone="bg-[#E1306C]/10 text-[#E1306C]"
        />
        <SettingsPreviewRow
          icon={FaYoutube}
          label="YouTube"
          value={displayUrl(values.youtube) || values.youtube}
          href={values.youtube.trim() || undefined}
          tone="bg-[#FF0000]/10 text-[#FF0000]"
        />
        <SettingsPreviewRow
          icon={FaXTwitter}
          label="Twitter / X"
          value={displayUrl(values.twitter) || values.twitter}
          href={values.twitter.trim() || undefined}
          tone="bg-slate-900/10 text-slate-800"
        />
      </div>
    </motion.section>
  );
}
