import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  HeartHandshake,
  Images,
  LayoutDashboard,
  Mail,
  ScrollText,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui";
import { NAV_ITEMS, type NavIconName } from "@/lib/constants";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";

const iconMap: Record<
  NavIconName,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
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

/** Extra search terms that don't literally appear in a page's label. */
const SEARCH_ALIASES: Record<string, string[]> = {
  "/donations": ["donors", "payments", "funding", "transactions"],
  "/messages": ["inbox", "contact", "inquiries"],
  "/gallery": ["photos", "images", "media", "videos"],
  "/leadership": ["team", "staff", "board"],
  "/content": ["pages", "editor", "copy"],
  "/site-settings": ["config", "branding"],
  "/settings": ["account", "profile", "password"],
  "/administrators": ["admins", "users", "roles"],
  "/audit-log": ["logs", "activity", "history"],
};

/**
 * Global page search — fuzzy-matches nav labels/aliases and jumps to the page.
 *
 * Uses a plain positioned dropdown rather than a focus-trapping overlay
 * component, since the input must keep DOM focus while typing for arrow-key
 * navigation and Enter-to-navigate to work.
 */
export function GlobalSearch(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) =>
        item.path === "/administrators" ? can(user?.role, "viewAdmins") : true,
      ),
    [user?.role],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return visibleItems.filter((item) => {
      const haystack = [item.label, ...(SEARCH_ALIASES[item.path] ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [query, visibleItems]);

  const isDropdownVisible = isOpen && results.length > 0;

  useEffect(() => {
    if (!isDropdownVisible) return;

    function handlePointerDown(event: PointerEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [isDropdownVisible]);

  function goTo(path: string): void {
    navigate(path);
    setQuery("");
    setIsOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();
  }

  function handleChange(value: string): void {
    setQuery(value);
    setActiveIndex(0);
    setIsOpen(value.trim().length > 0);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (!isDropdownVisible) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) goTo(target.path);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search…"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(query.trim().length > 0)}
        className="h-9 w-52 border-slate-200 bg-slate-50/80 pl-9 text-[13px] shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary/15 lg:w-64"
        aria-label="Search"
        role="combobox"
        aria-expanded={isDropdownVisible}
        aria-controls="global-search-results"
        aria-autocomplete="list"
      />

      {isDropdownVisible ? (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-[min(100vw-2rem,264px)] overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-luxury">
          <ul id="global-search-results" role="listbox" className="flex flex-col gap-0.5">
            {results.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <li key={item.path} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => goTo(item.path)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
                      index === activeIndex
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
