"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { IslandCard } from "@/components/icard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { createTaskSchema, type CreateTaskInput } from "@/types/task";

export default function NewTaskPage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateTaskInput>({
		resolver: zodResolver(createTaskSchema),
	});

	const onSubmit = (values: CreateTaskInput) => {
		console.log("Create task", values);
	};

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,#e7f0ff,transparent_45%),linear-gradient(180deg,#eef5ff_0%,#f8fbff_55%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-10">
			<form
				className="mx-auto flex w-full max-w-5xl flex-col gap-6"
				onSubmit={handleSubmit(onSubmit)}
			>
				<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
							New Task
						</p>
						<h1 className="text-1xl font-black tracking-tight text-slate-600 sm:text-4xl">
							Create task
						</h1>
						<p className="max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
							Define media requirements, assign targets, and publish when ready.
						</p>
					</div>
					<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
						<Button
							variant="outline"
							className="h-11 rounded-xl px-5"
							type="button"
						>
							Save Draft
						</Button>
						<Button
							className="h-11 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
							type="submit"
							disabled={isSubmitting}
						>
							Publish Task
						</Button>
					</div>
				</header>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
					<IslandCard className="px-6 py-7 sm:px-8">
						<div className="flex flex-col gap-8">
							<section className="space-y-4">
								<div className="flex items-center gap-3">
									<h2 className="text-lg font-semibold text-slate-900">
										Task Overview
									</h2>
									<Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-600">
										Required
									</Badge>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="sm:col-span-2">
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
											htmlFor="task-title"
										>
											Task Title
										</label>
										<Input
											id="task-title"
											placeholder="Street sign collection"
											className="mt-2 h-12 rounded-xl"
											aria-invalid={!!errors.title}
											aria-describedby={
												errors.title ? "task-title-error" : undefined
											}
											{...register("title")}
										/>
										{errors.title?.message && (
											<p
												id="task-title-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.title.message}
											</p>
										)}
									</div>
									<div className="sm:col-span-2">
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
											htmlFor="task-description"
										>
											Description
										</label>
										<Textarea
											id="task-description"
											placeholder="Explain the goal, coverage area, and any special instructions."
											className="mt-2 min-h-[130px] rounded-2xl"
											aria-invalid={!!errors.description}
											aria-describedby={
												errors.description ? "task-description-error" : undefined
											}
											{...register("description")}
										/>
										{errors.description?.message && (
											<p
												id="task-description-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.description.message}
											</p>
										)}
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-lg font-semibold text-slate-900">
									Media Requirements
								</h2>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
											htmlFor="task-media-type"
										>
											Media Type
										</label>
										<NativeSelect
											id="task-media-type"
											className="mt-2 h-12 w-full rounded-xl"
											aria-invalid={!!errors.mediaType}
											aria-describedby={
												errors.mediaType ? "task-media-type-error" : undefined
											}
											{...register("mediaType")}
										>
											<NativeSelectOption value="IMAGE">Image</NativeSelectOption>
											<NativeSelectOption value="VIDEO">Video</NativeSelectOption>
											<NativeSelectOption value="AUDIO">Audio</NativeSelectOption>
											<NativeSelectOption value="TEXT">Text</NativeSelectOption>
											<NativeSelectOption value="DOC">Document</NativeSelectOption>
										</NativeSelect>
										{errors.mediaType?.message && (
											<p
												id="task-media-type-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.mediaType.message}
											</p>
										)}
									</div>
									<div>
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
											htmlFor="task-target-submissions"
										>
											Target Submissions
										</label>
										<Input
											type="number"
											min={1}
											id="task-target-submissions"
											placeholder="150"
											className="mt-2 h-12 rounded-xl"
											aria-invalid={!!errors.targetSubmissions}
											aria-describedby={
												errors.targetSubmissions
												? "task-target-submissions-error"
												: undefined
											}
											{...register("targetSubmissions")}
										/>
										{errors.targetSubmissions?.message && (
											<p
												id="task-target-submissions-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.targetSubmissions.message}
											</p>
										)}
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
											htmlFor="task-min-quality"
										>
											Minimum Quality
										</label>
										<Input
											id="task-min-quality"
											placeholder="1080p, clear, no blur"
											className="mt-2 h-12 rounded-xl"
											aria-invalid={!!errors.minQuality}
											aria-describedby={
												errors.minQuality ? "task-min-quality-error" : undefined
											}
											{...register("minQuality")}
										/>
										{errors.minQuality?.message && (
											<p
												id="task-min-quality-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.minQuality.message}
											</p>
										)}
									</div>
									<div>
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
											htmlFor="task-deadline"
										>
											Deadline
										</label>
										<Input
											type="date"
											id="task-deadline"
											className="mt-2 h-12 rounded-xl"
											aria-invalid={!!errors.deadline}
											aria-describedby={
												errors.deadline ? "task-deadline-error" : undefined
											}
											{...register("deadline")}
										/>
										{errors.deadline?.message && (
											<p
												id="task-deadline-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.deadline.message}
											</p>
										)}
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-lg font-semibold text-slate-900">
									Assignment & Review
								</h2>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
											htmlFor="task-collectors-needed"
										>
											Collectors Needed
										</label>
										<Input
											type="number"
											min={1}
											id="task-collectors-needed"
											placeholder="5"
											className="mt-2 h-12 rounded-xl"
											aria-invalid={!!errors.collectorsNeeded}
											aria-describedby={
												errors.collectorsNeeded
												? "task-collectors-needed-error"
												: undefined
											}
											{...register("collectorsNeeded")}
										/>
										{errors.collectorsNeeded?.message && (
											<p
												id="task-collectors-needed-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.collectorsNeeded.message}
											</p>
										)}
									</div>
									<div>
										<label
											className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
											htmlFor="task-review-policy"
										>
											Review Policy
										</label>
										<NativeSelect
											id="task-review-policy"
											className="mt-2 h-12 w-full rounded-xl"
											aria-invalid={!!errors.reviewPolicy}
											aria-describedby={
												errors.reviewPolicy
												? "task-review-policy-error"
												: undefined
											}
											{...register("reviewPolicy")}
										>
											<NativeSelectOption value="manual">Manual approval</NativeSelectOption>
											<NativeSelectOption value="auto">Auto-approve</NativeSelectOption>
											<NativeSelectOption value="hybrid">Hybrid review</NativeSelectOption>
										</NativeSelect>
										{errors.reviewPolicy?.message && (
											<p
												id="task-review-policy-error"
												className="mt-2 text-xs font-semibold text-rose-500"
											>
												{errors.reviewPolicy.message}
											</p>
										)}
									</div>
								</div>
								<div>
									<label
										className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
										htmlFor="task-internal-notes"
									>
										Internal Notes
									</label>
									<Textarea
										id="task-internal-notes"
										placeholder="Add reviewer guidance or internal tags."
										className="mt-2 min-h-[110px] rounded-2xl"
										aria-invalid={!!errors.internalNotes}
										aria-describedby={
												errors.internalNotes
												? "task-internal-notes-error"
												: undefined
											}
										{...register("internalNotes")}
									/>
									{errors.internalNotes?.message && (
										<p
											id="task-internal-notes-error"
											className="mt-2 text-xs font-semibold text-rose-500"
										>
											{errors.internalNotes.message}
										</p>
									)}
								</div>
							</section>
						</div>
					</IslandCard>

					<aside className="flex flex-col gap-4">
						<IslandCard className="px-5 py-6">
							<h3 className="text-sm font-semibold text-slate-900">
								Task checklist
							</h3>
							<ul className="mt-4 space-y-3 text-sm text-slate-500">
								<li className="flex items-center justify-between">
									<span>Title & scope</span>
									<Badge variant="outline" className="text-[10px]">
										Draft
									</Badge>
								</li>
								<li className="flex items-center justify-between">
									<span>Media requirements</span>
									<Badge variant="outline" className="text-[10px]">
										Pending
									</Badge>
								</li>
								<li className="flex items-center justify-between">
									<span>Assignment rules</span>
									<Badge variant="outline" className="text-[10px]">
										Pending
									</Badge>
								</li>
							</ul>
						</IslandCard>

						<IslandCard className="px-5 py-6">
							<h3 className="text-sm font-semibold text-slate-900">
								Tip: Best results
							</h3>
							<p className="mt-3 text-sm text-slate-500">
								Clarify the location, lighting, and submission window. Clear tasks
								reduce review time and improve acceptance rates.
							</p>
						</IslandCard>
					</aside>
				</div>
			</form>
		</div>
	);
}
