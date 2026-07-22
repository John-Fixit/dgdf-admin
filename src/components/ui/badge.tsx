import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        secondary: "bg-slate-100 text-slate-600",
        success: "bg-success/10 text-success",
        error: "bg-error/10 text-error",
        warning: "bg-accent/15 text-amber-700",
        outline: "border border-slate-200 text-slate-600",
        primary: "bg-sky-100 text-sky-600",
        purple: "bg-purple-100 text-purple-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Compact status / category badge.
 */
function Badge({
  className,
  variant,
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
