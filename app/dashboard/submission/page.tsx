"use client";

import { useMemo, useState } from "react";
import { ExternalLink, CheckCircle, XCircle, Search, Eye } from "lucide-react";

import { IslandCard } from "@/components/icard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useReviewSubmission, useSubmissions } from "@/hooks/submission";
import type { ReviewSubmissionInput } from "@/types/submission";
import { cn } from "@/lib/utils";

const emptyRows = Array.from({ length: 5 }, (_, index) => index);

export default function SubmissionsPage() {
	const { data: submissions, isLoading } = useSubmissions();
	const reviewMutation = useReviewSubmission();
	const [statusFilter, setStatusFilter] = useState<
		"ALL" | ReviewSubmissionInput["status"]
	>("ALL");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [reviewOpen, setReviewOpen] = useState(false);
	const [reviewNote, setReviewNote] = useState("");
	const [reviewTargetId, setReviewTargetId] = useState<string | null>(null);
	const [reviewStatus, setReviewStatus] = useState<
		ReviewSubmissionInput["status"]
	>("APPROVED");

	const sortedSubmissions = useMemo(() => {
		if (!submissions) return [];
		return [...submissions].sort((a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}, [submissions]);

	const filteredSubmissions = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return sortedSubmissions.filter((submission) => {
			const matchesStatus =
				statusFilter === "ALL" || submission.status === statusFilter;
			if (!matchesStatus) return false;

			if (!query) return true;
			return (
				submission.collector.name.toLowerCase().includes(query) ||
				submission.task.title.toLowerCase().includes(query) ||
				submission.task.mediaType.toLowerCase().includes(query)
			);
		});
	}, [sortedSubmissions, searchQuery, statusFilter]);

	const previewSubmission = useMemo(() => {
		if (selectedId) {
			return filteredSubmissions.find((item) => item.id === selectedId) ?? null;
		}
		return filteredSubmissions[0] ?? null;
	}, [filteredSubmissions, selectedId]);

	const openReviewDrawer = (
		id: string,
		status: ReviewSubmissionInput["status"]
	) => {
		setReviewTargetId(id);
		setReviewStatus(status);
		setReviewNote("");
		setReviewOpen(true);
	};

	const handleSubmitReview = () => {
		if (!reviewTargetId) return;
		reviewMutation.mutate(
			{ id: reviewTargetId, data: { status: reviewStatus, approverNote: reviewNote } },
			{ onSuccess: () => setReviewOpen(false) }
		);
	};

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfeeff,transparent_55%),linear-gradient(180deg,#eef5ff_0%,#f8fbff_50%,#ffffff_100%)] px-6 py-10">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
				<header className="rounded-3xl border border-white/60 bg-white/70 px-6 py-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.7)] backdrop-blur">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-2">
							<p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-500">
								Review Desk
							</p>
							<h1 className="text-1xl font-black text-slate-600 sm:text-4xl">
								Submissions
							</h1>
							<p className="max-w-xl text-sm font-medium text-slate-500">
								Assess incoming work, issue approvals, and add feedback when needed.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							
						</div>
					</div>
				</header>
				<div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_16px_45px_-35px_rgba(15,23,42,0.6)] backdrop-blur">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="relative w-full md:max-w-sm">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Search by collector or task"
								className="h-10 rounded-full border-slate-200 bg-white/80 pl-9"
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							{(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(
								(status) => (
									<Button
										key={status}
										variant="outline"
										className={cn(
											"h-9 rounded-full border-slate-200 px-4 text-xs font-semibold uppercase tracking-[0.18em]",
											statusFilter === status
												? "border-slate-900 bg-slate-900 text-white"
												: "bg-white/80 text-slate-500"
										)}
										onClick={() => setStatusFilter(status)}
									>
										{status}
									</Button>
								)
							)}
						</div>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
					<IslandCard className="px-0 py-0">
						<div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-45px_rgba(15,23,42,0.8)]">
							<Table>
							<TableHeader className="bg-slate-50">
								<TableRow className="border-none">
									<TableHead className="font-bold text-slate-700">
										Collector
									</TableHead>
									<TableHead className="font-bold text-slate-700">
										Task
									</TableHead>
									<TableHead className="font-bold text-slate-700">
										Uploaded Content
									</TableHead>
									<TableHead className="font-bold text-slate-700">
										Status
									</TableHead>
									<TableHead className="pr-8 text-right font-bold text-slate-700">
										Review
									</TableHead>
								</TableRow>
							</TableHeader>
								<TableBody>
									{isLoading
										? emptyRows.map((row) => (
											<TableRow key={`skeleton-${row}`}>
												<TableCell>
													<Skeleton className="h-4 w-36" />
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-44" />
														<Skeleton className="h-3 w-20" />
													</div>
												</TableCell>
												<TableCell>
													<Skeleton className="h-4 w-28" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-5 w-24 rounded-full" />
												</TableCell>
												<TableCell className="pr-4 text-right">
													<div className="ml-auto flex w-fit gap-2">
														<Skeleton className="h-9 w-9 rounded-xl" />
														<Skeleton className="h-9 w-9 rounded-xl" />
													</div>
												</TableCell>
											</TableRow>
										))
									: filteredSubmissions.map((submission) => {
											const isPending = submission.status === "PENDING";
											const actionDisabled = reviewMutation.isPending;

											return (
												<TableRow
													key={submission.id}
													className={cn(
														"border-slate-100 transition hover:bg-slate-50/80",
														previewSubmission?.id === submission.id
															? "bg-slate-50/70"
															: ""
													)}
													onClick={() => setSelectedId(submission.id)}
												>
													<TableCell className="font-semibold text-slate-700">
														{submission.collector.name}
													</TableCell>
													<TableCell>
														<div className="flex flex-col">
															<span className="text-sm font-semibold text-slate-800">
																{submission.task.title}
															</span>
															<span className="text-[10px] font-bold uppercase text-slate-400">
																{submission.task.mediaType}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<a
															href={submission.uploadUrl}
															target="_blank"
															rel="noreferrer"
															className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
														>
															View File
															<ExternalLink className="h-3 w-3" />
														</a>
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className={cn(
																"rounded-full border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
																submission.status === "APPROVED"
																	? "bg-emerald-50 text-emerald-600"
																	: submission.status === "REJECTED"
																		? "bg-red-50 text-red-600"
																		: "bg-amber-50 text-amber-600"
															)}
														>
															{submission.status}
														</Badge>
													</TableCell>
													<TableCell className="pr-4 text-right">
														{isPending ? (
															<div className="inline-flex items-center gap-2">
																<Button
																	size="icon"
																	className="h-9 w-9 rounded-xl border-none bg-emerald-50 text-emerald-600 shadow-none hover:bg-emerald-100"
																	onClick={(event) => {
																	event.stopPropagation();
																	openReviewDrawer(submission.id, "APPROVED");
																}}
																	disabled={actionDisabled}
																>
																	<CheckCircle className="h-4 w-4" />
																</Button>
																<Button
																	size="icon"
																	className="h-9 w-9 rounded-xl border-none bg-red-50 text-red-600 shadow-none hover:bg-red-100"
																	onClick={(event) => {
																	event.stopPropagation();
																	openReviewDrawer(submission.id, "REJECTED");
																}}
																	disabled={actionDisabled}
																>
																	<XCircle className="h-4 w-4" />
																</Button>
																<Button
																	size="icon"
																	variant="outline"
																	className="h-9 w-9 rounded-xl border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
																	onClick={(event) => {
																	event.stopPropagation();
																	setSelectedId(submission.id);
																}}
																	title="Preview"
																>
																	<Eye className="h-4 w-4" />
																</Button>
															</div>
														) : (
															<span className="text-xs font-semibold text-slate-400">
																Reviewed
															</span>
														)}
													</TableCell>
												</TableRow>
											);
										})}

								{!isLoading && filteredSubmissions.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-32 text-center text-sm font-medium text-slate-500"
										>
											No submissions to review yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					</IslandCard>

					<IslandCard className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.8)]">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
									Preview
								</p>
								<h2 className="text-lg font-bold text-slate-800">Uploaded File</h2>
							</div>
							<Badge className="rounded-full bg-slate-900/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
								Live
							</Badge>
						</div>

						{previewSubmission ? (
							<div className="space-y-4">
								<div className="space-y-1">
									<p className="text-sm font-semibold text-slate-800">
										{previewSubmission.task.title}
									</p>
									<p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
										{previewSubmission.task.mediaType} · {previewSubmission.collector.name}
									</p>
								</div>

								<div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
									{previewSubmission.task.mediaType === "IMAGE" ? (
										<img
											src={previewSubmission.uploadUrl}
											alt={previewSubmission.task.title}
											className="h-48 w-full object-cover"
										/>
									) : previewSubmission.task.mediaType === "VIDEO" ? (
										<video
											className="h-48 w-full object-cover"
											controls
											src={previewSubmission.uploadUrl}
										/>
									) : previewSubmission.task.mediaType === "AUDIO" ? (
										<div className="p-4">
											<audio controls className="w-full" src={previewSubmission.uploadUrl} />
										</div>
									) : (
										<div className="flex h-48 flex-col items-center justify-center gap-3 p-4 text-center">
											<p className="text-sm font-medium text-slate-500">
												Preview unavailable for this file type.
											</p>
											<Button
												variant="outline"
												className="rounded-full border-slate-200"
												asChild
											>
												<a href={previewSubmission.uploadUrl} target="_blank" rel="noreferrer">
													Open File
												</a>
											</Button>
										</div>
									)}
								</div>

								<div className="flex items-center justify-between">
									<Badge
										className={cn(
											"rounded-full border-none px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
											previewSubmission.status === "APPROVED"
												? "bg-emerald-50 text-emerald-600"
												: previewSubmission.status === "REJECTED"
													? "bg-red-50 text-red-600"
													: "bg-amber-50 text-amber-600"
										)}
									>
										{previewSubmission.status}
									</Badge>
									<Button
										variant="outline"
										className="rounded-full border-slate-200"
										onClick={() => openReviewDrawer(previewSubmission.id, "APPROVED")}
									>
										Review
									</Button>
								</div>
							</div>
						) : (
							<div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm font-medium text-slate-400">
								Select a submission to preview.
							</div>
						)}
					</IslandCard>
				</div>
			</div>

			<Sheet open={reviewOpen} onOpenChange={setReviewOpen}>
				<SheetContent className="gap-0">
					<SheetHeader className="border-b border-slate-200 pb-4">
						<SheetTitle className="text-lg font-bold text-slate-900">
							Review Submission
						</SheetTitle>
						<SheetDescription>
							Add feedback and finalize your decision.
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-5">
						<div className="space-y-2">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
								Decision
							</p>
							<div className="flex gap-2">
								<Button
									variant={reviewStatus === "APPROVED" ? "default" : "outline"}
									className={cn(
										"h-9 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.18em]",
										reviewStatus === "APPROVED"
											? "bg-emerald-600 text-white hover:bg-emerald-500"
											: "border-slate-200 text-slate-500"
									)}
									onClick={() => setReviewStatus("APPROVED")}
								>
									Approve
								</Button>
								<Button
									variant={reviewStatus === "REJECTED" ? "default" : "outline"}
									className={cn(
										"h-9 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.18em]",
										reviewStatus === "REJECTED"
											? "bg-red-600 text-white hover:bg-red-500"
											: "border-slate-200 text-slate-500"
									)}
									onClick={() => setReviewStatus("REJECTED")}
								>
									Reject
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
								Feedback Note
							</p>
							<Textarea
								value={reviewNote}
								onChange={(event) => setReviewNote(event.target.value)}
								placeholder="Add a note for the collector"
								className="min-h-28 rounded-2xl border-slate-200 bg-white"
							/>
						</div>
					</div>

					<SheetFooter className="border-t border-slate-200 p-4">
						<Button
							className="h-10 rounded-full"
							onClick={handleSubmitReview}
							disabled={reviewMutation.isPending}
						>
							Submit Review
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
