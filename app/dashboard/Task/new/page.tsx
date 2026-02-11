"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { IslandCard } from "@/components/icard";

export default function NewTaskPage() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,#e7f0ff,transparent_45%),linear-gradient(180deg,#eef5ff_0%,#f8fbff_55%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-10">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
							New Task
						</p>
						<h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
							Create task
						</h1>
						<p className="max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
							Define media requirements, assign targets, and publish when ready.
						</p>
					</div>
					<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
						<Button variant="outline" className="h-11 rounded-xl px-5">
							Save Draft
						</Button>
						<Button className="h-11 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700">
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
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
											Task Title
										</label>
										<Input
											placeholder="Street sign collection"
											className="mt-2 h-12 rounded-xl"
										/>
									</div>
									<div className="sm:col-span-2">
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
											Description
										</label>
										<Textarea
											placeholder="Explain the goal, coverage area, and any special instructions."
											className="mt-2 min-h-[130px] rounded-2xl"
										/>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-lg font-semibold text-slate-900">
									Media Requirements
								</h2>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
											Media Type
										</label>
										<NativeSelect className="mt-2 h-12 w-full rounded-xl">
											<NativeSelectOption value="IMAGE">Image</NativeSelectOption>
											<NativeSelectOption value="VIDEO">Video</NativeSelectOption>
											<NativeSelectOption value="AUDIO">Audio</NativeSelectOption>
											<NativeSelectOption value="TEXT">Text</NativeSelectOption>
											<NativeSelectOption value="DOC">Document</NativeSelectOption>
										</NativeSelect>
									</div>
									<div>
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
											Target Submissions
										</label>
										<Input
											type="number"
											min={1}
											placeholder="150"
											className="mt-2 h-12 rounded-xl"
										/>
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
											Minimum Quality
										</label>
										<Input
											placeholder="1080p, clear, no blur"
											className="mt-2 h-12 rounded-xl"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
											Deadline
										</label>
										<Input
											type="date"
											className="mt-2 h-12 rounded-xl"
										/>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-lg font-semibold text-slate-900">
									Assignment & Review
								</h2>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
											Collectors Needed
										</label>
										<Input
											type="number"
											min={1}
											placeholder="5"
											className="mt-2 h-12 rounded-xl"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
											Review Policy
										</label>
										<NativeSelect className="mt-2 h-12 w-full rounded-xl">
											<NativeSelectOption value="manual">Manual approval</NativeSelectOption>
											<NativeSelectOption value="auto">Auto-approve</NativeSelectOption>
											<NativeSelectOption value="hybrid">Hybrid review</NativeSelectOption>
										</NativeSelect>
									</div>
								</div>
								<div>
									<label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
										Internal Notes
									</label>
									<Textarea
										placeholder="Add reviewer guidance or internal tags."
										className="mt-2 min-h-[110px] rounded-2xl"
									/>
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
			</div>
		</div>
	);
}
