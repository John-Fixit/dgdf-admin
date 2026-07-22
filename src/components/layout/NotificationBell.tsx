import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Mail } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useMessages } from "@/hooks";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import type { Message } from "@/lib/types";

const PREVIEW_LIMIT = 8;

const AVATAR_PALETTES = [
  "bg-sky-600 text-white",
  "bg-emerald-600 text-white",
  "bg-violet-600 text-white",
  "bg-rose-600 text-white",
  "bg-amber-600 text-white",
  "bg-teal-600 text-white",
  "bg-indigo-600 text-white",
  "bg-orange-600 text-white",
] as const;

/**
 * Header notification bell — unread contact messages with preview dropdown.
 */
export function NotificationBell(): React.ReactElement {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const messagesQuery = useMessages();

  const messages = messagesQuery.data ?? [];
  const unread = useMemo(
    () => messages.filter((message) => !message.read),
    [messages],
  );
  const unreadCount = unread.length;

  const previews = useMemo(() => {
    if (unread.length > 0) {
      return [...unread]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, PREVIEW_LIMIT);
    }

    return [...messages]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, PREVIEW_LIMIT);
  }, [messages, unread]);

  function handleOpenMessage(message: Message): void {
    setIsOpen(false);
    navigate(`/messages?id=${encodeURIComponent(message.id)}`);
  }

  function handleViewAll(): void {
    setIsOpen(false);
    navigate("/messages");
  }

  return (
    <Popover
      placement="bottom-end"
      offset={8}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="relative h-9 w-9 min-w-9 rounded-lg text-slate-500 data-[hover=true]:bg-slate-100 data-[hover=true]:text-slate-800"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span
              className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-accent-foreground animate-badge-blink"
              aria-hidden
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(100vw-2rem,340px)] gap-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-0 shadow-luxury">
        <div className="w-full border-b border-slate-200 px-4 pt-3 pb-2 text-left">
          <p className="font-display text-[15px] font-semibold tracking-tight text-slate-900">
            Notifications
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
              : "You’re all caught up"}
          </p>
        </div>

        <div className="max-h-[min(60vh,360px)] overflow-y-auto scrollbar-thin">
          {messagesQuery.isLoading ? (
            <p className="px-4 py-8 text-center text-[12px] text-slate-500">
              Loading notifications…
            </p>
          ) : previews.length === 0 ? (
            <div className="flex flex-col items-start gap-2 px-4 py-9 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Mail className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-medium text-slate-800">
                  No messages yet
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Contact form inquiries will appear here.
                </p>
              </div>
            </div>
          ) : (
            <ul role="list">
              {previews.map((message) => (
                <li
                  key={message.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => handleOpenMessage(message)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50/80 focus-visible:bg-slate-50 focus-visible:outline-none",
                      !message.read && "bg-slate-50/60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide",
                        getAvatarPalette(message.name),
                      )}
                      aria-hidden
                    >
                      {getInitials(message.name)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={cn(
                            "truncate text-[13px] leading-none",
                            message.read
                              ? "font-semibold text-slate-700"
                              : "font-semibold text-slate-900",
                          )}
                        >
                          {message.name}
                        </span>
                        <span className="shrink-0 text-[10px] tabular-nums text-slate-400">
                          {formatRelativeTime(message.createdAt)}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "mt-1.5 block truncate text-[11px] leading-none",
                          message.read
                            ? "text-slate-500"
                            : "font-medium text-slate-600",
                        )}
                      >
                        {message.subject || "Contact inquiry"}
                      </span>

                      <p className="mt-1 block text-[11px] leading-relaxed text-slate-500 line-clamp-1!">
                        {truncate(message.body, 68)}
                      </p>
                    </span>

                    {!message.read ? (
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-label="Unread"
                      />
                    ) : (
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0"
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full border-t border-slate-100 bg-slate-50/50 px-2 py-1.5">
          <Button
            variant="light"
            size="sm"
            className="h-8 w-full justify-center rounded-lg px-2.5 text-[12px] font-medium text-slate-600 data-[hover=true]:bg-white data-[hover=true]:text-primary"
            onPress={handleViewAll}
          >
            View all messages
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Builds short initials for the notification avatar.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0] ?? "";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] ?? "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

/**
 * Picks a stable avatar color from the sender name.
 */
function getAvatarPalette(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % AVATAR_PALETTES.length;
  }
  return AVATAR_PALETTES[hash] ?? AVATAR_PALETTES[0];
}
