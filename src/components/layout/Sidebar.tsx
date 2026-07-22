import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import {
  FileText,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Settings,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import {
  APP_NAME,
  APP_TAGLINE,
  NAV_GROUPS,
  type NavGroup,
  type NavIconName,
} from "@/lib/constants";
import { loginPathWithFrom } from "@/lib/authRedirect";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useAuth, useConfirm, useMessages } from "@/hooks";
import { useUiStore } from "@/store/uiStore";
import type { AdminRole } from "@/lib/types";

const ROLE_TITLES: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  viewer: "Viewer",
};

/**
 * Filters nav groups so viewers/admins only see allowed routes.
 */
function filterNavGroups(
  groups: NavGroup[],
  role: AdminRole | undefined,
): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.path === "/administrators") {
          return can(role, "viewAdmins");
        }
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

const iconMap: Record<
  NavIconName,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  LayoutDashboard,
  Images,
  FileText,
  Users,
  Settings,
  SlidersHorizontal,
  HeartHandshake,
  Mail,
  ScrollText,
};

/**
 * Returns initials from a display name for the avatar fallback.
 */
function getUserInitials(name?: string | null): string {
  if (!name?.trim()) return "DG";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DG";
  const first = parts[0] ?? "";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] ?? "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

/**
 * Fixed admin sidebar — grouped nav, collapse, and mobile drawer.
 */
export function Sidebar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { confirm } = useConfirm();
  const messagesQuery = useMessages();
  const unreadCount =
    messagesQuery.data?.filter((message) => !message.read).length ?? 0;

  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileOpen);
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsed);
  const setMobileOpen = useUiStore((s) => s.setMobileOpen);

  const userInitials = getUserInitials(user?.name);
  const navGroups = filterNavGroups(NAV_GROUPS, user?.role);
  const roleTitle = user?.role
    ? ROLE_TITLES[user.role]
    : user?.title ?? "Administrator";

  function handleNavigate(): void {
    setMobileOpen(false);
  }

  async function handleSignOut(): Promise<void> {
    const confirmed = await confirm({
      title: "Sign out?",
      description: "You will need to sign in again to access the admin portal.",
      confirmLabel: "Sign out",
      cancelLabel: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    await logout();
    navigate(loginPathWithFrom(location.pathname), { replace: true });
  }

  return (
    <>
      <Button
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onPress={() => setMobileOpen(false)}
        variant="light"
        disableAnimation
        className={cn(
          "fixed inset-0 z-40 h-auto min-h-0 w-auto min-w-0 rounded-none bg-slate-950/40 p-0 backdrop-blur-[1px] transition-opacity duration-200 data-[hover=true]:bg-slate-950/40 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-label="Close sidebar"
      />

      <aside
        aria-label="Admin navigation"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-svh flex-col border-r border-white/[0.06] bg-sidebar font-display",
          "w-[260px] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          sidebarCollapsed ? "lg:w-[68px]" : "lg:w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-20 shrink-0 items-center gap-3 border-b border-white/6 px-4",
            sidebarCollapsed && "lg:justify-center lg:px-2",
          )}
        >
          <Link
            to="/dashboard"
            onClick={handleNavigate}
            className="flex min-w-0 items-center gap-3"
            aria-label={`${APP_NAME} home`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-[12px] font-bold tracking-wide text-accent-foreground">
              DGD
            </span>
            <span
              className={cn(
                "min-w-0 transition-[opacity,transform,width] duration-200",
                sidebarCollapsed &&
                  "lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:opacity-0",
              )}
            >
              <span className="block truncate text-[14px] font-semibold text-white">
                {APP_NAME} Admin
              </span>
              <span className="block truncate text-[12px] text-white/40">
                {APP_TAGLINE}
              </span>
            </span>
          </Link>

          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setMobileOpen(false)}
            className="ml-auto h-8 w-8 min-w-8 text-white/50 data-[hover=true]:bg-white/10 data-[hover=true]:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-[17px] w-[17px]" />
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className="sidebar-scroll mt-8 min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-2.5 pb-3"
          aria-label="Primary"
        >
          {navGroups.map((group) => (
            <div key={group.id}>
              <p
                className={cn(
                  "mb-3 px-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30",
                  sidebarCollapsed && "lg:sr-only",
                )}
              >
                {group.label}
              </p>
              <ul className="space-y-1.5">
                {group.items.map((item) => {
                  const badge =
                    item.path === "/messages" && unreadCount > 0
                      ? unreadCount
                      : undefined;

                  return (
                    <li key={item.path}>
                      <SidebarLink
                        path={item.path}
                        label={item.label}
                        icon={item.icon}
                        badge={badge}
                        collapsed={sidebarCollapsed}
                        onNavigate={handleNavigate}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.06] p-2.5">
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-2",
              sidebarCollapsed && "lg:justify-center lg:px-1",
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[12px] font-semibold text-white">
              {userInitials}
            </div>

            <div
              className={cn(
                "min-w-0 flex-1",
                sidebarCollapsed &&
                  "lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:opacity-0",
              )}
            >
              <p className="truncate text-[14px] font-medium text-white">
                {user?.name ?? "Admin User"}
              </p>
              <p className="truncate text-[12px] text-white/40">
                {roleTitle}
              </p>
            </div>

            <Button
              isIconOnly
              variant="light"
              size="sm"
              className={cn(
                "h-8 w-8 min-w-8 text-white/40 data-[hover=true]:bg-white/10 data-[hover=true]:text-white",
                sidebarCollapsed && "lg:hidden",
              )}
              aria-label="Sign out"
              onPress={() => void handleSignOut()}
            >
              <LogOut className="h-[15px] w-[15px]" />
            </Button>
          </div>

          <Button
            variant="light"
            size="sm"
            onPress={toggleCollapsed}
            className={cn(
              "mt-1 hidden h-8 w-full min-h-8 items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-white/40 data-[hover=true]:bg-white/[0.06] data-[hover=true]:text-white/80 lg:flex",
              sidebarCollapsed && "px-0",
            )}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-pressed={sidebarCollapsed}
            startContent={
              sidebarCollapsed ? (
                <PanelLeftOpen className="h-[15px] w-[15px]" />
              ) : (
                <PanelLeftClose className="h-[15px] w-[15px]" />
              )
            }
          >
            {!sidebarCollapsed ? "Collapse" : null}
          </Button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  path,
  label,
  icon,
  badge,
  collapsed,
  onNavigate,
}: {
  path: string;
  label: string;
  icon: NavIconName;
  badge?: number;
  collapsed: boolean;
  onNavigate?: () => void;
}): React.ReactElement {
  const Icon = iconMap[icon];

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[14px] font-medium outline-none transition-colors duration-150",
          collapsed && "lg:justify-center lg:gap-0 lg:px-2",
          isActive
            ? "bg-white/[0.1] text-white"
            : "text-white/55 hover:bg-white/[0.05] hover:text-white/90",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <span
              className="absolute left-0 top-1/2 h-[22px] w-[2px] -translate-y-1/2 rounded-r-full bg-accent"
              aria-hidden
            />
          ) : null}
          <Icon
            className={cn(
              "h-[17px] w-[17px] shrink-0 transition-colors",
              isActive
                ? "text-accent"
                : "text-white/45 group-hover:text-white/80",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "flex-1 truncate",
              collapsed &&
                "lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:opacity-0",
            )}
          >
            {label}
          </span>
          {badge != null && badge > 0 && !collapsed ? (
            <span className="ml-auto animate-badge-blink rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-accent-foreground">
              {badge > 99 ? "99+" : badge}
            </span>
          ) : null}
          {badge != null && badge > 0 && collapsed ? (
            <span
              className="absolute right-1.5 top-1.5 hidden h-2 w-2 animate-badge-blink rounded-full bg-accent lg:block"
              aria-label={`${badge} unread`}
            />
          ) : null}
        </>
      )}
    </NavLink>
  );
}
