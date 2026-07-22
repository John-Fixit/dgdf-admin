import { useEffect, useId, useRef, useState } from 'react'
import { ImagePlus, Replace, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
const MAX_BYTES = 5 * 1024 * 1024

interface ImageUploadFieldProps {
  value: string
  onChange: (url: string, file: File | null) => void
  label?: string
  helper?: string
  /** Aspect ratio class for the preview frame */
  aspectClassName?: string
  className?: string
}

/**
 * Formats a byte size for display.
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Custom image file picker with drag-and-drop, preview, replace, and remove.
 * For mock mode, selected files become local object URLs.
 */
export function ImageUploadField({
  value,
  onChange,
  label = 'Image',
  helper = 'JPG, PNG, or WEBP · Max 5 MB',
  aspectClassName = 'aspect-[4/3]',
  className,
}: ImageUploadFieldProps): React.ReactElement {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileMeta, setFileMeta] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  function applyFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPG, PNG, or WEBP image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`Image exceeds the 5 MB limit (${formatBytes(file.size)}).`)
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    const previewUrl = URL.createObjectURL(file)
    objectUrlRef.current = previewUrl
    setError(null)
    setFileMeta(`${file.name} · ${formatBytes(file.size)}`)
    onChange(previewUrl, file)
  }

  function handleFiles(fileList: FileList | null): void {
    const file = fileList?.[0]
    if (file) applyFile(file)
  }

  function clearImage(): void {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setFileMeta(null)
    setError(null)
    onChange('', null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const hasImage = Boolean(value)

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={inputId}
        className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
      >
        {label}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {hasImage ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <div className={cn('relative w-full overflow-hidden', aspectClassName)}>
            <img
              src={value}
              alt="Selected upload preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-primary/80 to-transparent px-3 pb-3 pt-10">
              <p className="truncate text-xs font-medium text-white/90">
                {fileMeta ?? 'Current image'}
              </p>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-white"
                >
                  <Replace className="h-3.5 w-3.5" aria-hidden />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-white"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            handleFiles(event.dataTransfer.files)
          }}
          className={cn(
            'group flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-5 py-10 text-center transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/[0.04]'
              : 'border-slate-300 bg-slate-50/70 hover:border-primary/45 hover:bg-primary/[0.03]',
          )}
        >
          <div
            className={cn(
              'mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
              isDragging
                ? 'bg-primary/15 text-primary'
                : 'bg-primary/8 text-primary group-hover:bg-primary/12',
            )}
          >
            {isDragging ? (
              <Upload className="h-5 w-5" aria-hidden />
            ) : (
              <ImagePlus className="h-5 w-5" aria-hidden />
            )}
          </div>
          <p className="text-sm font-semibold text-primary">
            {isDragging ? 'Drop image to upload' : 'Click to upload or drag and drop'}
          </p>
          <p className="mt-1.5 text-xs text-slate-400">{helper}</p>
        </button>
      )}

      {error ? (
        <p className="text-xs font-medium text-error">{error}</p>
      ) : (
        <p className="text-xs leading-relaxed text-slate-400">{helper}</p>
      )}
    </div>
  )
}
