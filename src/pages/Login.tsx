import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import {
  ArrowRight,
  Church,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { Input, Label } from '@/components/ui'
import { useAuth } from '@/hooks'
import { fromParamToPath } from '@/lib/authRedirect'
import { cn } from '@/lib/utils'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=1600&fit=crop'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
} as const

type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
}

/**
 * Public login page — split-pane layout matching the approved admin design.
 * Form state via react-hook-form; auth via backend /api/auth/login.
 */
export default function Login(): React.ReactElement {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const redirectTo = fromParamToPath(searchParams.get('from'))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const onSubmit = handleSubmit(async ({ email, password }) => {
    clearError()
    const ok = await login({ email: email.trim(), password })
    if (ok) navigate(redirectTo, { replace: true })
  })

  return (
    <div className="flex h-svh overflow-hidden bg-surface">
      <aside className="relative hidden overflow-hidden lg:flex lg:w-[40%]">
        <img
          src={HERO_IMAGE}
          alt="Community impact in Nigeria"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-primary/40 to-primary/80 p-10 text-white">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-md"
          >
            <h2 className="mb-3 font-display text-2xl italic leading-snug xl:text-3xl">
              Empowering generations through the message of hope and sustainable
              action.
            </h2>
            <p className="text-xs font-medium uppercase tracking-widest text-white/80">
              Lagos Community Outreach — 2024
            </p>
          </motion.div>
        </div>
      </aside>

      <main className="relative flex h-full w-full min-h-0 flex-col overflow-hidden lg:w-[60%]">
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-6 py-2 sm:px-8">
          <div className="w-full max-w-[440px]">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45 }}
              className="mb-5 flex items-center gap-3"
            >
              <div className="flex size-9 items-center justify-center rounded bg-primary">
                <Church className="size-4 text-white" aria-hidden />
              </div>
              <div>
                <h1 className="text-lg font-bold uppercase tracking-tight text-primary">
                  Divine Gospel Delight
                </h1>
                <p className="mt-0.5 text-[10px] font-bold uppercase leading-none tracking-[0.2em] text-accent">
                  Management Console
                </p>
              </div>
            </motion.div>

            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-login sm:p-8"
              aria-labelledby="login-heading"
            >
              <div className="mb-5">
                <h2
                  id="login-heading"
                  className="mb-1 font-display text-3xl font-semibold text-primary"
                >
                  Welcome Back
                </h2>
                <p className="text-sm text-slate-500">
                  Please sign in to access your administrative dashboard.
                </p>
              </div>

              <form className="space-y-3" onSubmit={onSubmit} noValidate>
                <div className="group space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-wider text-primary"
                  >
                    Administrator Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
                      aria-hidden
                    />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="e.g. name@dgdfoundation.org"
                      className="h-11 border-slate-300 pl-11 shadow-none"
                      aria-invalid={Boolean(errors.email)}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email',
                        },
                      })}
                    />
                  </div>
                  {errors.email ? (
                    <p className="text-xs text-error">{errors.email.message}</p>
                  ) : null}
                </div>

                <div className="group space-y-1.5">
                  <div className="flex items-end justify-between">
                    <Label
                      htmlFor="password"
                      className="text-[11px] font-bold uppercase tracking-wider text-primary"
                    >
                      Secure Password
                    </Label>
                    <Button
                      variant="light"
                      size="sm"
                      className="h-auto min-w-0 px-1 text-[11px] font-bold text-primary data-[hover=true]:bg-transparent data-[hover=true]:underline"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
                      aria-hidden
                    />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className="h-11 border-slate-300 px-11 shadow-none"
                      aria-invalid={Boolean(errors.password)}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                    />
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 h-8 w-8 min-w-8 -translate-y-1/2 text-slate-400 data-[hover=true]:bg-transparent data-[hover=true]:text-primary"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden />
                      ) : (
                        <Eye className="size-4" aria-hidden />
                      )}
                    </Button>
                  </div>
                  {errors.password ? (
                    <p className="text-xs text-error">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    {...register('rememberMe')}
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer select-none text-sm font-normal text-slate-500"
                  >
                    Keep me signed in for 30 days
                  </Label>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="rounded-md bg-error/10 px-3 py-2 text-sm text-error"
                  >
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  color="primary"
                  isDisabled={isLoading}
                  className="h-11 w-full text-xs font-semibold uppercase tracking-widest shadow-md"
                  endContent={
                    isLoading ? undefined : (
                      <ArrowRight className="size-4" aria-hidden />
                    )
                  }
                  startContent={
                    isLoading ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : undefined
                  }
                >
                  {isLoading ? 'Authenticating…' : 'Secure Login'}
                </Button>
              </form>
            </motion.section>

            <motion.aside
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mt-4 px-2 text-center"
            >
              <div className="mb-1 inline-flex items-center gap-1.5 text-primary/60">
                <ShieldCheck className="size-3.5" aria-hidden />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  End-to-End Encrypted Session
                </span>
              </div>
              <p className="text-[11px] leading-snug text-slate-500">
                Notice: This system is for authorized personnel only. All access
                and activity is logged and monitored for security compliance.
              </p>
            </motion.aside>
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex shrink-0 flex-col items-center justify-between gap-2 border-t border-slate-200/50 px-6 py-3 sm:px-8 md:flex-row"
        >
          <nav className="flex gap-5" aria-label="System links">
            {(['System Status', 'Security Policy', 'Support'] as const).map(
              (label) => (
                <a
                  key={label}
                  href="#"
                  className={cn(
                    'text-[11px] font-semibold text-slate-500 transition-colors hover:text-primary',
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              ),
            )}
          </nav>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} DGDF Global. All rights reserved.
          </p>
        </motion.footer>
      </main>
    </div>
  )
}
