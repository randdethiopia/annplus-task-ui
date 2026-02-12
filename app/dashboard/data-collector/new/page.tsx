"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { IslandCard } from "@/components/icard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCollectorInput, CreateCollectorSchema } from "@/types/validator";
import { dataCollectorApi } from "@/api/data-collector";

export default function NewDataCollectorPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCollectorInput>({
    resolver: zodResolver(CreateCollectorSchema),
    defaultValues: { name: "", phone: "", telegramUsername: "" },
  });

  const { mutate, isPending } = dataCollectorApi.register.useMutation();

  const onSubmit = (values: CreateCollectorInput) => {
    const toastId = toast.loading("Registering collector...");
    mutate(values, {
      onSuccess: () => {
        toast.success("Collector registered", { id: toastId });
        reset({ name: "", phone: "", telegramUsername: "" });
        setShowSuccess(true);
      },
      onError: () => {
        toast.error("Failed to register collector", { id: toastId });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e7f0ff,transparent_45%),linear-gradient(180deg,#eef5ff_0%,#f8fbff_55%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <form
        className="mx-auto flex w-full max-w-3xl flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
              New Collector
            </p>
            <h1 className="text-1xl font-black tracking-tight text-slate-600 sm:text-4xl">
              Register collector
            </h1>
            <p className="max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
              Add a data collector and keep your team organized.
            </p>
          </div>
        </header>

        {showSuccess && (
          <IslandCard className="border border-emerald-100 bg-emerald-50/80 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Collector created
                </p>
                <h2 className="text-lg font-semibold text-emerald-900">
                  The collector is ready to receive tasks.
                </h2>
                <p className="text-sm font-medium text-emerald-700">
                  You can register another one right away.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="h-10 rounded-full border border-emerald-200 bg-white/70 px-5 text-emerald-700 hover:bg-white"
                  type="button"
                  onClick={() => setShowSuccess(false)}
                >
                  Create another collector
                </Button>
                <Button
                  className="h-10 rounded-full border border-emerald-500 bg-emerald-600 px-5 text-white hover:bg-emerald-500"
                  type="button"
                  onClick={() => router.push("/dashboard/data-collector")}
                >
                  View collectors
                </Button>
              </div>
            </div>
          </IslandCard>
        )}

        <div className="grid gap-6">
          <IslandCard className="px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Collector Details
                  </h2>
                  <Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-600">
                    Required
                  </Badge>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                      htmlFor="collector-name"
                    >
                      Full Name
                    </label>
                    <Input
                      id="collector-name"
                      placeholder="John Doe"
                      className="mt-2 h-12 rounded-xl"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "collector-name-error" : undefined}
                      {...register("name")}
                    />
                    {errors.name?.message && (
                      <p
                        id="collector-name-error"
                        className="mt-2 text-xs font-semibold text-rose-500"
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                      htmlFor="collector-phone"
                    >
                      Phone
                    </label>
                    <Input
                      id="collector-phone"
                      placeholder="+251900000000"
                      className="mt-2 h-12 rounded-xl"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "collector-phone-error" : undefined}
                      {...register("phone")}
                    />
                    {errors.phone?.message && (
                      <p
                        id="collector-phone-error"
                        className="mt-2 text-xs font-semibold text-rose-500"
                      >
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                      htmlFor="collector-telegram"
                    >
                      Telegram Username
                    </label>
                    <Input
                      id="collector-telegram"
                      placeholder="@username"
                      className="mt-2 h-12 rounded-xl"
                      aria-invalid={!!errors.telegramUsername}
                      aria-describedby={
                        errors.telegramUsername ? "collector-telegram-error" : undefined
                      }
                      {...register("telegramUsername")}
                    />
                    {errors.telegramUsername?.message && (
                      <p
                        id="collector-telegram-error"
                        className="mt-2 text-xs font-semibold text-rose-500"
                      >
                        {errors.telegramUsername.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="flex justify-end">
                <Button
                  className="h-11 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
                  type="submit"
                  disabled={isSubmitting || isPending}
                >
                  Register Collector
                </Button>
              </section>
            </div>
          </IslandCard>
        </div>
      </form>
    </div>
  );
}