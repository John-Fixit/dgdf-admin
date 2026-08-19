import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { Input, Label } from "@/components/ui";
import { resetPassword } from "@/lib/api";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=1600&fit=crop";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
} as const;

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

/**
 * Completes a password reset using the token from the emailed reset link.
 */
export default function ResetPassword(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ newPassword }) => {
    setError(null);
    setIsLoading(true);
    try {
      await resetPassword({ token, newPassword });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  });

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
              aria-labelledby="reset-password-heading"
            >
              {!token ? (
                <div className="text-center">
                  <h2
                    id="reset-password-heading"
                    className="mb-1 font-display text-2xl font-semibold text-primary"
                  >
                    Invalid Reset Link
                  </h2>
                  <p className="text-sm text-slate-500">
                    This link is missing its reset token. Please request a new
                    one.
                  </p>
                  <Link
                    to="/forgot-password"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    Request New Link
                  </Link>
                </div>
              ) : done ? (
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <CheckCircle2 className="size-10 text-primary" aria-hidden />
                  </div>
                  <h2
                    id="reset-password-heading"
                    className="mb-1 font-display text-2xl font-semibold text-primary"
                  >
                    Password Reset
                  </h2>
                  <p className="text-sm text-slate-500">
                    Your password has been updated. Redirecting to login…
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2
                      id="reset-password-heading"
                      className="mb-1 font-display text-3xl font-semibold text-primary"
                    >
                      Set New Password
                    </h2>
                    <p className="text-sm text-slate-500">
                      Choose a new password for your administrator account.
                    </p>
                  </div>

                  <form className="space-y-3" onSubmit={onSubmit} noValidate>
                    <div className="group space-y-1.5">
                      <Label
                        htmlFor="newPassword"
                        className="text-[11px] font-bold uppercase tracking-wider text-primary"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
                          aria-hidden
                        />
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••••••"
                          className="h-11 border-slate-300 px-11 shadow-none"
                          aria-invalid={Boolean(errors.newPassword)}
                          {...register("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 8,
                              message:
                                "Password must be at least 8 characters",
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
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" aria-hidden />
                          ) : (
                            <Eye className="size-4" aria-hidden />
                          )}
                        </Button>
                      </div>
                      {errors.newPassword ? (
                        <p className="text-xs text-error">
                          {errors.newPassword.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="group space-y-1.5">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-[11px] font-bold uppercase tracking-wider text-primary"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
                          aria-hidden
                        />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••••••"
                          className="h-11 border-slate-300 pl-11 shadow-none"
                          aria-invalid={Boolean(errors.confirmPassword)}
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === watch("newPassword") ||
                              "Passwords do not match",
                          })}
                        />
                      </div>
                      {errors.confirmPassword ? (
                        <p className="text-xs text-error">
                          {errors.confirmPassword.message}
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
                      {isLoading ? "Resetting…" : "Reset Password"}
                    </Button>
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
