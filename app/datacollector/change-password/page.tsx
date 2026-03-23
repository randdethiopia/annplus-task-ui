"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { dataCollectorApi } from "@/api/data-collector";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { mutateAsync: changePassword } =
    dataCollectorApi.changePassword.useMutation();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    const toastId = toast.loading("Changing password...");
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(res?.message || "Password changed successfully!", {
        id: toastId,
      });
      setSuccess(true);
      reset();
    } catch {
      toast.error("Failed to change password. Please check your current password.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Change Password
                </h1>
                <p className="text-sm text-slate-500">
                  Update your account password
                </p>
              </div>
            </div>
          </div>

          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center gap-4 px-6 py-12 sm:px-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-900">
                  Password Updated!
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your password has been changed successfully. Use your new
                  password the next time you log in.
                </p>
              </div>
              <div className="mt-2 flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setSuccess(false)}
                >
                  Change Again
                </Button>
                <Button
                  className="rounded-xl bg-slate-900 hover:bg-slate-800"
                  onClick={() => router.push("/datacollector/tasks")}
                >
                  Go to Tasks
                </Button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 sm:px-8">
              <div className="space-y-5">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Current Password
                  </label>
                  <div className="relative mt-2">
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter current password"
                      className="h-11 rounded-xl pr-10"
                      aria-invalid={!!errors.currentPassword}
                      {...register("currentPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowCurrent(!showCurrent)}
                      tabIndex={-1}
                    >
                      {showCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-2 text-xs font-semibold text-rose-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400">
                      New password
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    New Password
                  </label>
                  <div className="relative mt-2">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-11 rounded-xl pr-10"
                      aria-invalid={!!errors.newPassword}
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowNew(!showNew)}
                      tabIndex={-1}
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-2 text-xs font-semibold text-rose-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="h-11 rounded-xl pr-10"
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs font-semibold text-rose-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password requirements hint */}
              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  Password requirements:
                </p>
                <ul className="mt-1 list-inside list-disc text-xs text-slate-400">
                  <li>At least 6 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                </ul>
              </div>

              {/* Submit */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
