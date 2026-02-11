import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionApi } from "@/api/submission";
import type { ReviewSubmissionInput } from "@/types/submission";
import { toast } from "sonner";

export const useSubmissions = () => {
	return useQuery({
		queryKey: ["submissions"],
		queryFn: submissionApi.getAll,
	});
};

export const useReviewSubmission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ReviewSubmissionInput }) =>
			submissionApi.review(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["submissions"] });
			toast.success("Submission reviewed successfully");
		},
		onError: () => {
			toast.error("Failed to update submission");
		},
	});
};