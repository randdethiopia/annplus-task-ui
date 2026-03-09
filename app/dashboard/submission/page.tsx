"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { IslandCard } from "@/components/icard";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
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
import { cn } from "@/lib/utils";
import Image from "next/image";
import TaskApi, { Submission, TaskStatus, TaskWithSubmissions } from "@/api/task";
import { useSearchParams } from "next/navigation";

const emptyRows = Array.from({ length: 5 }, (_, index) => index);

export default function SubmissionsPage() {
	const [pageSize, setPageSize] = useState(10);

	const searchParams = useSearchParams();
	const taskId = searchParams.get("taskId");

	const { data: taskData, isSuccess, isLoading: isTaskLoading } = TaskApi.getById.useQuery(taskId);
	const { mutate: reviewMutation, isPending } = TaskApi.review.useMutation(taskId ?? "");

	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
	
	const resolveUploadUrl = (url?: string | null) => {
        if (!url) return undefined;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (!apiBaseUrl) return url;
        const normalizedPath = url.startsWith("/") ? url : `/${url}`;
        return `${apiBaseUrl}${normalizedPath}`;
    };

	const [task, setTask] = useState<TaskWithSubmissions | null>(null);
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

	const resolvedSelectedUploadUrl = useMemo(() => {
		return selectedSubmission?.uploadUrl ? resolveUploadUrl(selectedSubmission.uploadUrl) : undefined;
	}, [selectedSubmission?.uploadUrl, apiBaseUrl]);
	
	const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewerNote, setReviewerNote] = useState("");
    const [reviewStatus, setReviewStatus] = useState<TaskStatus>("APPROVED");

    const currentIndex = useMemo(() => {
        if (!selectedSubmission) return -1;
        return submissions.findIndex((s) => s.id === selectedSubmission.id);
    }, [submissions, selectedSubmission]);

    const goPrev = () => {
        if (currentIndex > 0) {
            setSelectedSubmission(submissions[currentIndex - 1]);
        }
    };

    const goNext = () => {
        if (currentIndex >= 0 && currentIndex < submissions.length - 1) {
            setSelectedSubmission(submissions[currentIndex + 1]);
        }
    };

	useEffect(() => {
		if (isSuccess && taskData.task) {
			setSubmissions(taskData.task.submissions);
			setSelectedSubmission(taskData.task.submissions[0] ?? null);
			setTask(taskData.task);
			setReviewerNote(taskData.task.reviewerNote ?? "");
			setReviewStatus(taskData.task.status ?? "APPROVED");
		}
	}, [isSuccess, taskData]);



	const handleSubmitReview = () => {
		reviewMutation({
			status: reviewStatus,
			reviewerNote
		},
		);
	};

	return (
		<div className="min-h-screen px-4 py-6">
             <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                <header className="rounded-3xl border border-white/60 px-4 py-4">
                     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-500">
								Submissions for
                            </p>
                            <h1 className="text-1xl font-black text-slate-600 sm:text-4xl">
                                { task?.title }
                            </h1>
                            <p className="max-w-xl text-sm font-medium text-slate-500">
                                { task?.description }
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								onClick={() => setReviewOpen(true)}
							>
								Open Review
							</Button>
						</div>
                    </div>
                </header>


                <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1.8fr)]">

					<div className="self-start overflow-hidden rounded-3xl border border-slate-200/80">
                        <div className="flex flex-col gap-4 rounded-3xl px-4 py-3">
							<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:max-w-2xl">
								<div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
									<span>Rows per page</span>
									<NativeSelect
										size="sm"
										value={pageSize}
										onChange={(event) => {
											const nextSize = Number(event.target.value);
											setPageSize(nextSize);
										}}
										className="h-8 rounded-full border-slate-200 bg-white/80 px-3 pr-8 text-xs font-semibold text-slate-600 shadow-none"
										aria-label="Rows per page"
									>
										{[5, 10, 20, 50].map((size) => (
											<NativeSelectOption key={size} value={size}>
												{size}
											</NativeSelectOption>
										))}
									</NativeSelect>
								</div>
							</div>

							<Table>
								<TableHeader>
									<TableRow className="border-none">
										<TableHead className="font-bold text-slate-700">Type</TableHead>
										<TableHead className="pr-8 text-right font-bold text-slate-700">View</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{ isTaskLoading ? emptyRows.map((row) => (
											<TableRow key={`skeleton-${row}`}>
												<TableCell>
													<Skeleton className="h-4 w-36" />
												</TableCell>
												<TableCell className="pr-4 text-right">
													<Skeleton className="h-9 w-9 rounded-xl ml-auto" />
												</TableCell>
											</TableRow>
										))
										: Array.isArray(submissions) && submissions.map((submission) => {
											return (
												<TableRow
													key={submission.id}
													className={cn(
														"border-slate-100 transition hover:bg-slate-50/80",
														selectedSubmission?.id === submission.id ? "bg-slate-50/70" : ""
													)}
												>
													<TableCell className="font-semibold text-slate-700">
														{submission.mediaType}
													</TableCell>
													<TableCell className="pr-4 text-right">
														<Button
															size="icon"
															variant="ghost"
															className="h-9 w-9 rounded-xl border-none bg-white text-slate-500 hover:bg-slate-50"
															onClick={() => setSelectedSubmission(submission)}
															title="Open preview"
														>
															<Eye className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											);
										})}

									{!isSuccess && submissions.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={2}
												className="h-32 text-center text-sm font-medium text-slate-500"
											>
												No submissions to review yet.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>

						</div>
					</div>

					<IslandCard className="flex flex-col gap-4 rounded-3xl border p-1">
                          {selectedSubmission && (
							<div className="relative overflow-hidden h-[68vh]">
								{/* Left / Right chevrons centered vertically */}
								<button
									onClick={goPrev}
									disabled={currentIndex <= 0}
									aria-label="Previous submission"
									className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed`}
								>
									<ChevronLeft className="h-5 w-5 text-slate-700" />
								</button>

								<button
									onClick={goNext}
									disabled={currentIndex < 0 || currentIndex >= submissions.length - 1}
									aria-label="Next submission"
									className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed`}
								>
									<ChevronRight className="h-5 w-5 text-slate-700" />
								</button>

                                 {selectedSubmission.mediaType === "IMAGE" ? (
                                     resolvedSelectedUploadUrl ? (
                                         <Image
                                             src={resolvedSelectedUploadUrl}
                                             alt="submission"
                                             fill
                                             className="object-contain"
                                             unoptimized
                                         />
                                     ) : (
                                         <div className="flex h-full w-full items-center justify-center p-4">
                                             <p className="text-sm font-medium text-slate-500">
                                                 File URL not available for preview.
                                             </p>
                                         </div>
                                     )
                                 ) : selectedSubmission.mediaType === "VIDEO" ? (
                                     <video
                                         className="h-full w-full"
                                         controls
                                         src={resolvedSelectedUploadUrl}
                                     />
                                 ) : (
                                     <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                                         <p className="text-sm font-medium text-slate-500">
                                             File URL not available for preview.
                                         </p>
                                     </div>
                                 )}
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
								value={reviewerNote}
								onChange={(event) => setReviewerNote(event.target.value)}
								placeholder="Add a note for the collector"
								className="min-h-28 rounded-2xl border-slate-200 bg-white"
							/>
						</div>
					</div>

					<SheetFooter className="border-t border-slate-200 p-4">
						<Button
							className="h-10 rounded-full"
							onClick={handleSubmitReview}
							disabled={isPending}
						>
							Submit Review
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
