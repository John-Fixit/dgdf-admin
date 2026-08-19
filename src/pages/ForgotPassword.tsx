import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { addToast, Button } from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Input, Label } from "@/components/ui";
import { forgotPassword } from "@/lib/api";

const RESEND_COOLDOWN_SECONDS = 30;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=1600&fit=crop";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
} as const;

type ForgotPasswordFormValues = {
  email: string;
};

/**
 * Requests a password-reset email. Always shows the same confirmation
 * regardless of whether the address is registered — the API never reveals
 * account existence either.
 */
export default function ForgotPassword(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setError(null);
    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setSubmittedEmail(email.trim());
      setSubmitted(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function handleResend(): Promise<void> {
    if (isResending || resendCooldown > 0) return;
    setIsResending(true);
    try {
      await forgotPassword(submittedEmail);
      addToast({
        title: "Email resent",
        description: `We've sent another link to ${submittedEmail}`,
        color: "success",
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      addToast({
        title: "Failed to resend",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        color: "danger",
      });
    } finally {
      setIsResending(false);
    }
  }

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
              Community Outreach — 2024
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
              className="mb-5"
            >
              <img
                src="/logo.png"
                alt="Divine Gospel Delight Foundation"
                width={1536}
                height={1024}
                className="h-20 w-auto object-contain"
              />
            </motion.div>

            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-login sm:p-8"
              aria-labelledby="forgot-password-heading"
            >
              {submitted ? (
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <CheckCircle2 className="size-10 text-primary" aria-hidden />
                  </div>
                  <h2
                    id="forgot-password-heading"
                    className="mb-1 font-display text-2xl font-semibold text-primary"
                  >
                    Check your email
                  </h2>
                  <p className="text-sm text-slate-500">
                    If that email address is registered, we've sent a link to
                    reset your password. The link expires in 30 minutes.
                  </p>

                  <p className="mt-4 text-xs text-slate-400">
                    Didn't get it? Check your spam folder, or
                  </p>
                  <Button
                    variant="bordered"
                    size="sm"
                    isDisabled={isResending || resendCooldown > 0}
                    className="mt-2 h-9 rounded-lg border-primary/20 px-4 text-xs font-bold uppercase tracking-widest text-primary"
                    startContent={
                      isResending ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      ) : (
                        <RefreshCw className="size-3.5" aria-hidden />
                      )
                    }
                    onPress={() => void handleResend()}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : isResending
                        ? "Resending…"
                        : "Resend Email"}
                  </Button>

                  <Link
                    to="/login"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    <ArrowLeft className="size-3.5" aria-hidden />
                    Back to Login
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2
                      id="forgot-password-heading"
                      className="mb-1 font-display text-3xl font-semibold text-primary"
                    >
                      Forgot Password?
                    </h2>
                    <p className="text-sm text-slate-500">
                      Enter your administrator email and we'll send you a link
                      to reset your password.
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
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email",
                            },
                          })}
                        />
                      </div>
                      {errors.email ? (
                        <p className="text-xs text-error">
                          {errors.email.message}
                        </p>
                      ) : null}
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
                      {isLoading ? "Sending…" : "Send Reset Link"}
                    </Button>

                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-1.5 pt-1 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary"
                    >
                      <ArrowLeft className="size-3.5" aria-hidden />
                      Back to Login
                    </Link>
                  </form>
                </>
              )}
            </motion.section>
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex shrink-0 flex-col items-center justify-center gap-2 border-t border-slate-200/50 px-6 py-3 sm:px-8"
        >
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} DGDF Global. All rights reserved.
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
