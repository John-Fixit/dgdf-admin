import { motion } from "framer-motion";
import { addToast, Button } from "@heroui/react";
import { Clock3, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { SettingsPreviewRow } from "./SettingsPreviewRow";
import { ContactSettingsForm } from "./ContactSettingsForm";
import { useAuth, useDrawer } from "@/hooks";
import { can, PERMISSION_DENIED_MESSAGE } from "@/lib/permissions";
import type { SiteSettings } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ContactSettingsCardProps {
  values: SiteSettings["contact"];
  index?: number;
}

/**
 * Contact details preview card — edit opens a drawer form.
 */
export function ContactSettingsCard({
  values,
  index = 1,
}: ContactSettingsCardProps): React.ReactElement {
  const { open } = useDrawer();
  const { user } = useAuth();
  const canEdit = can(user?.role, "manageContent");

  function handleEdit(): void {
    if (!canEdit) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: "danger" });
      return;
    }
    open({
      title: "Edit contact information",
      description: "Phone, email, address, and hours shown on the public site",
      size: "lg",
      placement: "right",
      content: <ContactSettingsForm values={values} />,
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
            Contact
          </p>
          <h2 className="mt-1.5 font-display text-xl font-semibold text-primary">
            Contact information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Details shown in the footer and contact page
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
          icon={Phone}
          label="Phone"
          value={values.phone}
          href={values.phone.trim() ? `tel:${values.phone.trim()}` : undefined}
          tone="bg-emerald-100 text-emerald-700"
        />
        <SettingsPreviewRow
          icon={Mail}
          label="Email"
          value={values.email}
          href={
            values.email.trim() ? `mailto:${values.email.trim()}` : undefined
          }
          tone="bg-[#1877F2]/10 text-[#1877F2]"
        />
        <SettingsPreviewRow
          icon={MapPin}
          label="Address"
          value={values.address}
          multiline
          tone="bg-accent/20 text-amber-800"
        />
        <SettingsPreviewRow
          icon={Clock3}
          label="Office hours"
          value={values.officeHours}
          tone="bg-pink-100 text-pink-600"
        />
      </div>
    </motion.section>
  );
}
