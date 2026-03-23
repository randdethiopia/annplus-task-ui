
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RegisterCollectorSchema,
  type RegisterCollectorInput,
} from "@/types/validator";
import { Spinner } from "@/components/ui/spinner";
import { dataCollectorApi } from "@/api/data-collector";
import { ArrowLeft } from "lucide-react";
import router from "next/router";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCollectorInput>({
    resolver: zodResolver(RegisterCollectorSchema),
    defaultValues: {
      name: "",
      phone: "",
      telegramUsername: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync } = dataCollectorApi.register.useMutation();
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", value, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (input: RegisterCollectorInput) => {
    const toastId = toast.loading("Creating your account...");
    setServerError(null);
    try {
      const telegramUsername =
        input.telegramUsername && input.telegramUsername.startsWith("@")
          ? input.telegramUsername.slice(1)
          : input.telegramUsername;

      await mutateAsync(
        {
          name: input.name,
          phone: input.phone,
          telegramUsername,
          password: input.password,
        },
        {
          onSuccess: (data) => {
            toast.success("You are registered , redirecting to " + data.redirect);
            window.open(data.redirect, "_blank", "noopener,noreferrer");
          },
        }
      );
    } catch {
      setServerError("Unable to create account. Please try again.");
      toast.error("Unable to create account. Please try again.", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="register form">
      <div className="relative overflow-hidden px-6 py-6 sm:px-6">
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase text-slate-400"
            >
              Full name
            </label>
            <Input
              id="name"
              placeholder="abebe kebede"
              className="mt-2 h-11 rounded-xl"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-xs font-semibold text-rose-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="phone"
                className="text-xs font-semibold uppercase text-slate-400"
              >
                Phone number
              </label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="09xxxxxxxx"
                className="mt-2 h-11 rounded-xl"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone", {
                  required: "Phone number is required",
                })}
                onChange={handlePhoneChange}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-2 text-xs font-semibold text-rose-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="telegramUsername"
                className="text-xs font-semibold uppercase text-slate-400"
              >
                Telegram username
              </label>
              <Input
                id="telegramUsername"
                placeholder="@username"
                className="mt-2 h-11 rounded-xl"
                aria-invalid={!!errors.telegramUsername}
                aria-describedby={errors.telegramUsername ? "telegram-error" : undefined}
                {...register("telegramUsername", {
                  required: "Telegram username is required",
                  minLength: { value: 3, message: "Username is too short" },
                })}
              />
              {errors.telegramUsername && (
                <p id="telegram-error" className="mt-2 text-xs font-semibold text-rose-500">
                  {errors.telegramUsername.message}
                </p>
              )}
            </div>
          </div>

          <div className="gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase text-slate-400"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="mt-2 h-11 rounded-xl"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p id="password-error" className="mt-2 text-xs font-semibold text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase text-slate-400"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="mt-2 h-11 rounded-xl"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-2 text-xs font-semibold text-rose-500"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {serverError && (
          <p className="mt-4 text-sm font-semibold text-rose-500">
            {serverError}
          </p>
        )}
        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            type="submit"
            className="h-11 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            Register
          </Button>
        </div>
      </div>
    </form>
  );
}
