"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { IslandCard } from "@/components/icard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthApi from "@/api/auth";
import authStore from "@/store/authStore";

interface LoginInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { setAccessToken } = authStore();  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const { mutate } = AuthApi.login.useMutation();

  const onSubmit = async (input: LoginInput) => {
    mutate(input, {
      onSuccess: (data) => {
        setAccessToken( data.user.id, data.token);
        router.push("/dashboard/Task");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md"
        aria-label="login form"
      >
        <IslandCard className="px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-700 mb-2">Sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Use your account email and password.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-semibold uppercase text-slate-400">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-2 h-11 rounded-xl"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                })}
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-xs font-semibold text-rose-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-semibold uppercase text-slate-400">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-2 h-11 rounded-xl"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p id="password-error" className="mt-2 text-xs font-semibold text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="mt-4 text-sm font-semibold text-rose-500">{serverError}</p>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="h-11 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </IslandCard>
      </form>
    </div>
  );
}
