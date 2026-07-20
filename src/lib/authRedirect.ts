const ALLOWED_FROM = new Set([
  'dashboard',
  'gallery',
  'content',
  'donations',
  'messages',
])

/**
 * Converts a pathname like `/dashboard` into a `from` search value (`dashboard`).
 */
export function pathToFromParam(pathname: string): string {
  const cleaned = pathname.replace(/^\//, '').split('/')[0] ?? ''
  return cleaned && ALLOWED_FROM.has(cleaned) ? cleaned : 'dashboard'
}

/**
 * Resolves a `from` search param back to a safe in-app path.
 */
export function fromParamToPath(from: string | null | undefined): string {
  if (from && ALLOWED_FROM.has(from)) {
    return `/${from}`
  }
  return '/dashboard'
}

/**
 * Builds `/login?from=…` for the given pathname (or current location).
 */
export function loginPathWithFrom(pathname?: string): string {
  const from = pathToFromParam(pathname ?? window.location.pathname)
  return `/login?from=${encodeURIComponent(from)}`
}
