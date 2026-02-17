"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { IslandCard } from "@/components/icard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthApi from "@/api/auth";
import {
	RegisterCollectorSchema,
	type RegisterCollectorInput,
} from "@/types/validator";

export default function RegisterPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterCollectorInput>({
		resolver: zodResolver(RegisterCollectorSchema),
	});

	const { mutateAsync } = AuthApi.register.useMutation();

	const onSubmit = async (input: RegisterCollectorInput) => {
		const toastId = toast.loading("Creating your account...");
		setServerError(null);
		try {
			await mutateAsync({
				name: input.name,
				email: input.email,
				phone: input.phone,
				telegramUsername: input.telegramUsername,
				password: input.password,
				role: "COLLECTOR",
			});
			toast.success("Account created. You can sign in now.", { id: toastId });
			router.push("/auth/login");
		} catch (error) {
			setServerError("Unable to create account. Please try again.");
			toast.error("Unable to create account. Please try again.", { id: toastId });
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#f2f7ff,transparent_60%),linear-gradient(135deg,#eef3ff_0%,#fff7f0_50%,#ffffff_100%)] px-4 py-12">
			<div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,#ffd2b3,transparent_65%)] opacity-70" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,#c9e0ff,transparent_60%)] opacity-80" />

			<div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
				<section className="flex flex-col justify-center gap-6 text-center lg:text-left">
					<p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
						Collector Onboarding
					</p>
					<h1 className="text-3xl font-black text-slate-800 sm:text-4xl">
						Register as a Data Collector
					</h1>
					<p className="max-w-xl text-sm font-medium text-slate-500">
						Create your account to receive tasks, submit work, and track approvals.
					</p>
					
				</section>

				<section className="w-full">
					<form onSubmit={handleSubmit(onSubmit)} aria-label="register form">
						<IslandCard className="relative overflow-hidden px-6 py-8 sm:px-8">
							<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.7))]" />
							<h2 className="text-xl font-bold text-slate-800">
								Your account details
							</h2>
							

							<div className="mt-6 space-y-4">
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

								<div>
									<label
										htmlFor="email"
										className="text-xs font-semibold uppercase text-slate-400"
									>
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

								<div className="grid gap-4 sm:grid-cols-2">
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
											placeholder="+251 900 000 000"
											className="mt-2 h-11 rounded-xl"
											aria-invalid={!!errors.phone}
											aria-describedby={errors.phone ? "phone-error" : undefined}
											{...register("phone", {
												required: "Phone number is required",
												minLength: { value: 6, message: "Enter a valid phone number" },
											})}
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

								<div className="grid gap-4 sm:grid-cols-2">
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
											placeholder="••••••••"
											className="mt-2 h-11 rounded-xl"
											aria-invalid={!!errors.confirmPassword}
											aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
											{...register("confirmPassword", {
												required: "Confirm your password",
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

							<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<Button
									type="submit"
									className="h-11 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
									disabled={isSubmitting}
								>
									Create account
								</Button>
								{/* <Button
									type="button"
									variant="ghost"
									className="h-11 rounded-xl text-slate-500"
									onClick={() => router.push("/auth/login")}
								>
									Already have an account?
								</Button> */}
							</div>
						</IslandCard>
					</form>
				</section>
			</div>
		</div>
	);
}
