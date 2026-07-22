import { AlertTriangle } from "lucide-react";
import { Button } from "@heroui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

/**
 * Resolves a user-facing message from a route error.
 */
function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return "The page you are looking for could not be found.";
  }

  return "There was a problem loading this page. This might be due to a network issue or the page may have been updated.";
}

/**
 * Route-level error UI shown when a lazy page or route throws.
 */
export function RouteErrorPage(): React.ReactElement {
  const error = useRouteError();
  const description = getErrorMessage(error);

  if (import.meta.env.DEV && error) {
    console.error("[RouteError]", error);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <AlertTriangle
          className="mb-6 size-14 text-error"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="font-display text-2xl font-semibold tracking-tight text-primary">
          Failed to load page
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
          {description}
        </p>
        <Button
          color="primary"
          onPress={() => window.location.reload()}
          className="mt-8 rounded-full px-8 cursor-pointer"
        >
          Reload App
        </Button>
      </div>
    </div>
  );
}
