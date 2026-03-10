"use client";

import { use, useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/api/task";
import { toast } from "sonner";

type TaskReviewPageProps = {
  params: Promise<{ id: string }>;
};

const reviewStatuses: Array<Extract<TaskStatus, "APPROVED" | "REJECTED">> = [
  "APPROVED",
  "REJECTED",
];

export default function TaskReviewPage({ params }: TaskReviewPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const taskId = id as string;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviewerNote, setReviewerNote] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = api.task.getById.useQuery(taskId);

  const { mutate: submitReview, isPending: isSubmittingReview } = api.task.review.useMutation(
    taskId,
    {
      onSuccess: () => {
        toast.success("Review submitted.");
        void refetch();
      },
      onError: () => {
        toast.error("Failed to submit review.");
      },
    }
  );

  const task = data?.task;
  const submissions = task?.submissions ?? [];

  const selectedSubmission = submissions[selectedIndex] ?? null;
  const resolvedSelectedUploadUrl = selectedSubmission?.uploadUrl ?? "";

  useEffect(() => {
    if (!task) return;

    setReviewerNote(task.reviewerNote ?? "");
    setReviewStatus(task.status === "REJECTED" ? "REJECTED" : "APPROVED");
  }, [task]);

  useEffect(() => {
    if (submissions.length === 0) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((currentIndex) => Math.min(currentIndex, submissions.length - 1));
  }, [submissions.length]);

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
    setSelectedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const goToNext = () => {
    setSelectedIndex((currentIndex) => Math.min(currentIndex + 1, submissions.length - 1));
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

  const handleReviewSubmit = () => {
    if (reviewStatus === "REJECTED" && !reviewerNote.trim()) {
      toast.error("A reviewer note is required when rejecting a task.");
      return;
    }

    submitReview({
      status: reviewStatus,
      reviewerNote: reviewerNote.trim(),
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
                        selectedIndex === index
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            selectedIndex === index ? "bg-white/15" : "bg-slate-100"
                          )}
                        >
                          {submission.mediaType === "IMAGE" ? (
                            <FileImage
                              className={cn( "h-4 w-4", selectedIndex === index ? "text-white" : "text-slate-600" )}
                            />
                          ) : (
                            <Video
                              className={cn( "h-4 w-4", selectedIndex === index ? "text-white" : "text-slate-600")}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Submission {index + 1}</p>
                          <p
                            className={cn( "text-xs uppercase tracking-[0.18em]",selectedIndex === index ? "text-slate-300" : "text-slate-500")}
                          >
                            {submission.mediaType}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn("text-xs font-semibold", selectedIndex === index ? "text-slate-300" : "text-slate-400" )}
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
                        ? `Viewing ${selectedIndex + 1} of ${submissions.length}`
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
                        disabled={selectedIndex === 0}
                        aria-label="Previous submission"
                        className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={selectedIndex >= submissions.length - 1}
                        aria-label="Next submission"
                        className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {selectedSubmission.mediaType === "IMAGE" ? (
                        resolvedSelectedUploadUrl ? (
                          <img
                            src={resolvedSelectedUploadUrl}
                            alt={`Submission ${selectedIndex + 1}`}
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
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  <div className="flex gap-2">
                    {reviewStatuses.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={reviewStatus === status ? "default" : "outline"}
                        className={cn(
                          "flex-1 rounded-full",
                          reviewStatus === status && status === "APPROVED" && "bg-emerald-600 hover:bg-emerald-500",
                          reviewStatus === status && status === "REJECTED" && "bg-red-600 hover:bg-red-500"
                        )}
                        onClick={() => setReviewStatus(status)}
                      >
                        {status === "APPROVED" ? "Approve" : "Reject"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="reviewer-note"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Reviewer Note
                  </label>
                  <Textarea
                    id="reviewer-note"
                    value={reviewerNote}
                    onChange={(event) => setReviewerNote(event.target.value)}
                    placeholder={
                      reviewStatus === "REJECTED"
                        ? "Add a short note explaining why this task is rejected"
                        : "Add a short note for the collector"
                    }
                    className="min-h-32 rounded-2xl border-slate-200 bg-white"
                  />
                  {reviewStatus === "REJECTED" && !reviewerNote.trim() && (
                    <p className="text-sm text-red-600">
                      A reviewer note is required when rejecting a task.
                    </p>
                  )}
                </div>

                <Button
                  className="w-full rounded-full"
                  onClick={handleReviewSubmit}
                  disabled={
                    isSubmittingReview ||
                    submissions.length === 0 ||
                    (reviewStatus === "REJECTED" && !reviewerNote.trim())
                  }
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
