"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IslandCard } from "@/components/icard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthApi from "@/api/auth";

interface RegisterInput {
	name: string;
	email: string;
	phone: string;
	telegramUsername: string;
	password: string;
	confirmPassword: string;
}

export default function RegisterPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<RegisterInput>();

	const { mutateAsync } = AuthApi.register.useMutation();

	const onSubmit = async (input: RegisterInput) => {
		if (input.password !== input.confirmPassword) {
			setError("confirmPassword", { message: "Passwords do not match" });
			return;
		}

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
		<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#f3f1ff,transparent_55%),linear-gradient(135deg,#e6f1ff_0%,#fdf7f1_55%,#ffffff_100%)] px-4 py-10">
			<div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,#ffd9c2,transparent_65%)] opacity-70" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,#cfe6ff,transparent_60%)] opacity-80" />

			<div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
				<header className="flex flex-col gap-3 text-center">
					<p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
						Collector Onboarding
					</p>
					<h1 className="text-3xl font-black text-slate-600 sm:text-4xl">
						Register as a Data Collector
					</h1>
					<p className="mx-auto max-w-2xl text-sm font-medium text-slate-500">
						Create your account to receive tasks, submit work, and track approvals.
					</p>
				</header>

				<div className="mx-auto w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} aria-label="register form">
						<IslandCard className="relative overflow-hidden px-6 py-8">
							<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.55))]" />
							<h2 className="text-xl font-bold text-slate-700">
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
									className="h-11 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
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
				</div>
			</div>
		</div>
	);
}
