"use client";

import { useForm } from "react-hook-form";

import { IslandCard } from "@/components/icard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import TaskApi from "@/api/task";
import { useRouter } from "next/navigation";


interface CreateTaskInput {
	title: "string",
	description: "string",
	mediaType: "IMAGE" | "VIDEO"
}



export default function NewTaskPage() {
	const router = useRouter();

	const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<CreateTaskInput>({
		defaultValues: { mediaType: "IMAGE" },
	});

	const { mutate, isPending } = TaskApi.create.useMutation();

	const onSubmit = (values: CreateTaskInput) => {
		mutate(values)
		router.push("/dashboard/Task")
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
							New Task
						</p>
						<h1 className="text-1xl font-black tracking-tight text-slate-600 sm:text-4xl">
							Create task
						</h1>
						<p className="max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
							Define media requirements, assign targets, and publish when ready.
						</p>
					</div>

				</header>

				<div className="grid gap-6">
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
								<div className="grid gap-4">
									<div>
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
									<div>
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

								<div className="flex justify-end w-full flex-col gap-3 sm:w-auto sm:flex-row">

									<Button
										className="h-11 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
										type="submit"
										disabled={isSubmitting}
									>
										Publish Task
									</Button>
								</div>
							</section>
						</div>
					</IslandCard>
				</div>
			</form>
		</div>
	);
}
