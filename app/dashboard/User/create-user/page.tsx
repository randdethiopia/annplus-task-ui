"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateUserInput, CreateUserSchema } from "@/types/validator";
import AuthApi from "@/api/auth";

export default function CreateUserPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "SUPERVISOR",
    },
  });

  const roleValue = watch("role");
  const roleLabel =
    roleValue === "ADMIN"
      ? "Admin"
      : roleValue === "COLLECTOR"
      ? "Collector"
      : "Supervisor";

  const { mutateAsync, isPending } = AuthApi.register.useMutation();

  const onSubmit = async (values: CreateUserInput) => {
    const toastId = toast.loading("Creating user...");
    try {
      await mutateAsync(values);
      toast.success("User created", { id: toastId });
      reset({ name: "", email: "", password: "", role: "SUPERVISOR" });
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create user", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e7f0ff,transparent_45%),linear-gradient(180deg,#eef5ff_0%,#f8fbff_55%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <form
        className="mx-auto flex w-full max-w-3xl flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            User Management
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-700 sm:text-4xl">
            Create new user
          </h1>
          <p className="max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
            Add a new team member with the appropriate role.
          </p>
        </header>

        {showSuccess && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  User created
                </p>
                <h2 className="text-lg font-semibold text-emerald-900">
                  The user can now log in.
                </h2>
                <p className="text-sm font-medium text-emerald-700">
                  You can create another user right away.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="h-10 rounded-full border border-emerald-200 bg-white/70 px-5 text-emerald-700 hover:bg-white"
                >
                  Create another
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/User")}
                  className="h-10 rounded-full border border-emerald-500 bg-emerald-600 px-5 text-white hover:bg-emerald-500"
                >
                  View users
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="esu@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="text-sm font-semibold text-slate-700">Role</label>

              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setIsRoleOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <span>{roleLabel}</span>
                  <span className="text-xs">{isRoleOpen ? "▴" : "▾"}</span>
                </button>

                {isRoleOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    {[
                      { value: "SUPERVISOR", label: "Supervisor" },
                      { value: "ADMIN", label: "Admin" },
                      { value: "COLLECTOR", label: "Collector" },
                    ].map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setValue("role", role.value as CreateUserInput["role"], {
                            shouldValidate: true,
                          });
                          setIsRoleOpen(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          roleValue === role.value
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {errors.role && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="h-11 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting || isPending ? "Creating..." : "Create user"}
            </button>
            <p className="text-xs text-slate-500">
              The user will receive access according to the selected role.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}