import { useEffect, useRef } from 'react'
import { fetchCurrentUser, heartbeat } from '@/lib/api'

const DEFAULT_IDLE_TIMEOUT_MINUTES = 20

const IDLE_TIMEOUT_MS =
  Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) > 0
    ? Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) * 60_000
    : DEFAULT_IDLE_TIMEOUT_MINUTES * 60_000

/** Only re-slide the server token this often, and only if there was fresh activity */
const HEARTBEAT_MIN_GAP_MS = Math.max(30_000, IDLE_TIMEOUT_MS / 4)
/** How often to ask the server "is this session still alive" while sitting untouched */
const EXPIRY_POLL_MS = 60_000

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'wheel',
  'touchstart',
  'scroll',
] as const

/**
 * Keeps the server-side session alive while the admin is genuinely active,
 * and otherwise gets out of the way — expiry itself is decided entirely by
 * the server (the token's exp lapses if /auth/heartbeat isn't called in
 * time). This hook never judges "you've been idle too long" locally; it
 * only (a) tells the server about real activity, throttled, and (b)
 * periodically asks the server "am I still valid?" via a read-only check
 * that can't extend the session. A 401 from either call is handled by the
 * existing axios interceptor, which opens the session-expired modal.
 * No-ops entirely while `enabled` is false (e.g. logged out).
 */
export function useIdleSessionTimer(enabled: boolean): void {
  const hasActivitySinceHeartbeatRef = useRef(false)
  const lastHeartbeatRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    lastHeartbeatRef.current = Date.now()

    const recordActivity = () => {
      hasActivitySinceHeartbeatRef.current = true
    }

    const maybeSendHeartbeat = () => {
      const now = Date.now()
      if (
        hasActivitySinceHeartbeatRef.current &&
        now - lastHeartbeatRef.current >= HEARTBEAT_MIN_GAP_MS
      ) {
        lastHeartbeatRef.current = now
        hasActivitySinceHeartbeatRef.current = false
        void heartbeat().catch(() => {
          // A failed heartbeat just means the next expiry check will catch it
        })
      }
    }

    /** Read-only — asks the server, never guesses locally. */
    const checkStillValid = () => {
      void fetchCurrentUser().catch(() => {})
    }

    const checkOnReturn = () => {
      if (document.visibilityState === 'visible') checkStillValid()
    }

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, recordActivity, { passive: true }),
    )
    document.addEventListener('visibilitychange', checkOnReturn)
    window.addEventListener('focus', checkStillValid)

    const heartbeatIntervalId = window.setInterval(maybeSendHeartbeat, 15_000)
    const expiryPollIntervalId = window.setInterval(checkStillValid, EXPIRY_POLL_MS)

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, recordActivity),
      )
      document.removeEventListener('visibilitychange', checkOnReturn)
      window.removeEventListener('focus', checkStillValid)
      window.clearInterval(heartbeatIntervalId)
      window.clearInterval(expiryPollIntervalId)
    }
  }, [enabled])
}
