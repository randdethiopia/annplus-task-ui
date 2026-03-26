"use client";

import { use, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileImage,
  LoaderCircle,
  Maximize2,
  Minimize2,
  Video,
} from "lucide-react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TaskReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default function TaskReviewPage({ params }: TaskReviewPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);
  const taskId = id as string;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rejectionNote, setRejectionNote] = useState<string | null>(null);
  const [activeReviewAction, setActiveReviewAction] = useState<"approve" | "reject" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = api.task.getById.useQuery(taskId);

  const { mutate: submitReview, isPending: isSubmittingReview } = api.task.review.useMutation(
    taskId,
    {
      onSuccess: () => {
        setActiveReviewAction(null);
        setRejectionNote(null);
        void queryClient.invalidateQueries({ queryKey: ["tasks"] });
        void queryClient.invalidateQueries({ queryKey: ["collector-tasks"] });
        toast.success("Review submitted.");
      },
      onError: () => {
        toast.error("Failed to submit review.");
      },
    }
  );

  const task = data?.task;
  const submissions = task?.submissions ?? [];
  const defaultRejectionNote = task?.status === "REJECTED" ? task.reviewerNote ?? "" : "";
  const rejectionNoteValue = rejectionNote ?? defaultRejectionNote;
  const currentSelectedIndex =
    submissions.length === 0 ? 0 : Math.min(selectedIndex, submissions.length - 1);
  const selectedSubmission = submissions[currentSelectedIndex] ?? null;
  const resolvedSelectedUploadUrl = selectedSubmission?.uploadUrl ?? "";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === previewContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const goToPrevious = () => {
    setSelectedIndex(Math.max(currentSelectedIndex - 1, 0));
  };

  const goToNext = () => {
    setSelectedIndex(Math.min(currentSelectedIndex + 1, submissions.length - 1));
  };

  const toggleFullscreen = async () => {
    const previewContainer = previewContainerRef.current;
    if (!previewContainer) return;

    try {
      if (document.fullscreenElement === previewContainer) {
        await document.exitFullscreen();
        return;
      }

      await previewContainer.requestFullscreen();
    } catch {
      toast.error("Fullscreen preview is not available.");
    }
  };

  const handleReviewSubmit = (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !rejectionNoteValue.trim()) {
      toast.error("A reviewer note is required when rejecting a task.");
      return;
    }

    submitReview({
      status,
      reviewerNote: status === "REJECTED" ? rejectionNoteValue.trim() : "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
        <LoaderCircle className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (isError || !isSuccess || !task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Unable to load task</CardTitle>
            <CardDescription>
              The review page could not fetch this task right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/task")} variant="outline">
              Back to Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push("/dashboard/task")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Task Review
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {task.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100">
                {submissions.length} submission{submissions.length === 1 ? "" : "s"}
              </Badge>
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 text-white",
                  task.status === "APPROVED"
                    ? "bg-emerald-600"
                    : task.status === "REJECTED"
                      ? "bg-red-600"
                      : "bg-amber-500"
                )}
              >
                {task.status}
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="h-fit gap-0 overflow-hidden border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Submissions</CardTitle>
              <CardDescription>Select an item to preview.</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              {submissions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                  No submissions available for review yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {submissions.map((submission, index) => (
                    <button
                      key={submission.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                        currentSelectedIndex === index
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            currentSelectedIndex === index ? "bg-white/15" : "bg-slate-100"
                          )}
                        >
                          {submission.mediaType === "IMAGE" ? (
                            <FileImage
                              className={cn("h-4 w-4", currentSelectedIndex === index ? "text-white" : "text-slate-600")}
                            />
                          ) : (
                            <Video
                              className={cn("h-4 w-4", currentSelectedIndex === index ? "text-white" : "text-slate-600")}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Submission {index + 1}</p>
                          <p
                            className={cn("text-xs uppercase tracking-[0.18em]", currentSelectedIndex === index ? "text-slate-300" : "text-slate-500")}
                          >
                            {submission.mediaType}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn("text-xs font-semibold", currentSelectedIndex === index ? "text-slate-300" : "text-slate-400")}
                      >
                        {index + 1}/{submissions.length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <Card className="overflow-hidden border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      {selectedSubmission
                        ? `Viewing ${currentSelectedIndex + 1} of ${submissions.length}`
                        : "Select a submission to start reviewing."}
                    </CardDescription>
                  </div>

                  {selectedSubmission && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        {selectedSubmission.mediaType}
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          void toggleFullscreen();
                        }}
                      >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div
                  ref={previewContainerRef}
                  className="relative flex h-[65vh] min-h-[420px] items-center justify-center p-2"
                >
                  {selectedSubmission ? (
                    <>
                      <button
                        type="button"
                        onClick={goToPrevious}
                        disabled={currentSelectedIndex === 0}
                        aria-label="Previous submission"
                        className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={currentSelectedIndex >= submissions.length - 1}
                        aria-label="Next submission"
                        className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {selectedSubmission.mediaType === "IMAGE" ? (
                        resolvedSelectedUploadUrl ? (
                          <img
                            src={resolvedSelectedUploadUrl}
                            alt={`Submission ${currentSelectedIndex + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <p className="px-6 text-center text-sm text-slate-300">
                            This image does not have a valid preview URL.
                          </p>
                        )
                      ) : resolvedSelectedUploadUrl ? (
                        <video
                          key={selectedSubmission.id}
                          src={resolvedSelectedUploadUrl}
                          controls
                          className="max-h-full max-w-full"
                        />
                      ) : (
                        <p className="px-6 text-center text-sm text-slate-300">
                          This video does not have a valid preview URL.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="px-6 text-center text-sm text-slate-300">
                      There is nothing to preview yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit border-slate-200">
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Current Status
                  </p>
                  <Badge
                    className={cn(
                      "mt-3 rounded-full px-3 py-1 text-white",
                      task.status === "APPROVED"
                        ? "bg-emerald-600"
                        : task.status === "REJECTED"
                          ? "bg-red-600"
                          : "bg-amber-500"
                    )}
                  >
                    {task.status}
                  </Badge>

                  {task.reviewerNote && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Reviewer Note
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {task.reviewerNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Popover
                      open={activeReviewAction === "approve"}
                      onOpenChange={(open) => {
                        setActiveReviewAction(open ? "approve" : null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          className="w-full rounded-full bg-emerald-600 hover:bg-emerald-500"
                          disabled={isSubmittingReview || submissions.length === 0}
                        >
                          Approve
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="left"
                        align="end"
                        sideOffset={12}
                        collisionPadding={16}
                        className="w-80 rounded-2xl border-slate-200 p-5"
                      >
                        <PopoverHeader>
                          <PopoverTitle>Approve this task?</PopoverTitle>
                          <PopoverDescription>
                            This will mark the task as approved. Are you sure?
                          </PopoverDescription>
                        </PopoverHeader>

                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveReviewAction(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => handleReviewSubmit("APPROVED")}
                            disabled={isSubmittingReview}
                          >
                            {isSubmittingReview ? "Submitting..." : "Yes, approve"}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover
                      open={activeReviewAction === "reject"}
                      onOpenChange={(open) => {
                        setActiveReviewAction(open ? "reject" : null);
                        if (!open) {
                          setRejectionNote(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={isSubmittingReview || submissions.length === 0}
                        >
                          Reject
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="left"
                        align="end"
                        sideOffset={12}
                        collisionPadding={16}
                        className="w-96 rounded-2xl border-slate-200 p-5"
                      >
                        <PopoverHeader>
                          <PopoverTitle>Reject this task</PopoverTitle>
                          <PopoverDescription>
                            Add a rejection note to proceed.
                          </PopoverDescription>
                        </PopoverHeader>

                        <div className="mt-4 space-y-2">
                          <label
                            htmlFor="rejection-note"
                            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                          >
                            Rejection Note
                          </label>
                          <Textarea
                            id="rejection-note"
                            value={rejectionNoteValue}
                            onChange={(event) => setRejectionNote(event.target.value)}
                            placeholder="Add a short note explaining why this task is rejected"
                            className="min-h-28 rounded-2xl border-slate-200 bg-white"
                            autoFocus
                          />
                          {!rejectionNoteValue.trim() && (
                            <p className="text-sm text-red-600">
                              A rejection note is required.
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveReviewAction(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="bg-red-600 hover:bg-red-500"
                            onClick={() => handleReviewSubmit("REJECTED")}
                            disabled={isSubmittingReview || !rejectionNoteValue.trim()}
                          >
                            {isSubmittingReview ? "Submitting..." : "Yes, reject"}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {submissions.length === 0 && (
                    <p className="text-sm text-slate-500">
                      A submission is required before you can review this task.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
