import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card container with subtle shadow.
 */
function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-100 bg-white shadow-card',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Card header section.
 */
function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div className={cn('flex flex-col gap-1.5 p-6 pb-0', className)} {...props} />
  )
}

/**
 * Card title text.
 */
function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h3
      className={cn('text-lg font-semibold tracking-tight text-slate-900', className)}
      {...props}
    />
  )
}

/**
 * Card description / subtitle.
 */
function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return (
    <p className={cn('text-sm text-slate-500', className)} {...props} />
  )
}

/**
 * Card body content.
 */
function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('p-6', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
