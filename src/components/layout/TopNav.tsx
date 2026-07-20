import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui";
import { useUiStore } from "@/store/uiStore";

interface TopNavProps {
  title?: string;
}

/**
 * Slim top bar — mobile menu, search, and notifications.
 */
export function TopNav({ title }: TopNavProps): React.ReactElement {
  const toggleMobileOpen = useUiStore((s) => s.toggleMobileOpen);
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsed);

  /**
   * Opens the drawer on mobile; toggles collapse on desktop.
   */
  function handleMenuClick(): void {
    if (window.innerWidth < 1024) {
      toggleMobileOpen();
      return;
    }
    toggleCollapsed();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/70 bg-surface/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          isIconOnly
          variant="light"
          onPress={handleMenuClick}
          aria-label="Toggle sidebar"
          className="shrink-0 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {title ? (
          <h2 className="hidden truncate text-sm font-semibold text-slate-700 sm:block">
            {title}
          </h2>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search data…"
            className="h-10 w-56 border-slate-200/80 bg-white pl-10 shadow-none transition-all focus-visible:border-primary focus-visible:ring-accent/20 lg:w-64"
            aria-label="Search data"
          />
        </div>
        <Button
          isIconOnly
          variant="light"
          className="relative h-10 w-10 rounded-full bg-slate-100 text-primary data-[hover=true]:bg-slate-200"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </Button>
      </div>
    </header>
  );
}
