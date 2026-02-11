import { MOCK_COLLECTORS, MOCK_SUBMISSIONS, delay } from "@/lib/mock-data";
import { MOCK_TASKS } from "@/lib/mock-task";
import type { ReviewSubmissionInput, Submission } from "@/types/submission";

const resolveSubmission = (submission: (typeof MOCK_SUBMISSIONS)[number]): Submission => {
	const task = MOCK_TASKS.find((item) => item.id === submission.taskId);
	const collector = MOCK_COLLECTORS.find(
		(item) => item.id === submission.collectorId
	);

	return {
		...submission,
		task: {
			title: task?.title ?? "Unknown task",
			mediaType: task?.mediaType ?? "UNKNOWN",
		},
		collector: {
			name: collector?.name ?? "Unknown collector",
		},
	};
};

export const submissionApi = {
	getAll: async () => {
		await delay(400);
		return MOCK_SUBMISSIONS.map(resolveSubmission);
	},

	review: async (id: string, payload: ReviewSubmissionInput) => {
		await delay(250);
		const index = MOCK_SUBMISSIONS.findIndex((item) => item.id === id);
		if (index === -1) {
			throw new Error("Submission not found");
		}

		MOCK_SUBMISSIONS[index] = {
			...MOCK_SUBMISSIONS[index],
			status: payload.status,
			approverNote: payload.approverNote ?? null,
		};

		return resolveSubmission(MOCK_SUBMISSIONS[index]);
	},
};
