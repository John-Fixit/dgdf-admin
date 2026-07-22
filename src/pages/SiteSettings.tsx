import { motion } from "framer-motion";
import {
  ContactSettingsCard,
  OrganizationSettingsCard,
  SettingsErrorState,
  SettingsSkeleton,
  SocialSettingsCard,
} from "@/components/features/settings";
import { useSiteSettings } from "@/hooks";
import { formatDateTime } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Site Settings — organization identity, contact details, and social accounts.
 */
export default function SiteSettingsPage(): React.ReactElement {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useSiteSettings();

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-xl space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Site Settings
          </h1>
          <p className="text-base leading-relaxed text-slate-500">
            Control your organization identity, public contact details, and
            social media accounts
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 self-start rounded-xl border border-slate-200/80 bg-white px-4 py-2 shadow-ambient sm:self-auto">
          <span
            className="h-2 w-2 rounded-full bg-success shadow-[0_0_0_3px_rgba(22,163,74,0.15)]"
            aria-hidden
          />
          <span className="text-xs font-medium text-slate-400">
            Last saved
            {data?.lastUpdatedAt ? (
              <span className="ml-1.5 text-slate-500">
                {formatDateTime(data.lastUpdatedAt)}
              </span>
            ) : (
              <span className="ml-1.5 text-slate-400">—</span>
            )}
          </span>
        </div>
      </motion.header>

      {isLoading || (isFetching && !data) ? <SettingsSkeleton /> : null}

      {isError ? (
        <SettingsErrorState
          message={
            error instanceof Error
              ? error.message
              : "Failed to load site settings"
          }
          onRetry={() => void refetch()}
        />
      ) : null}

      {data && !isError ? (
        <div className="mx-auto max-w3xl space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* <OrganizationSettingsCard values={data.organization} index={0} /> */}
            <ContactSettingsCard values={data.contact} index={1} />
            <SocialSettingsCard values={data.social} index={2} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
