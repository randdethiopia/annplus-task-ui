import { z } from "zod";

export const SubmissionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const SubmissionSchema = z.object({
	id: z.string(),
	taskId: z.string(),
	collectorId: z.string(),
	uploadUrl: z.string().url(),
	status: SubmissionStatusSchema,
	approverNote: z.string().nullable().optional(),
	createdAt: z.string().or(z.date()),

	// Related data populated by the API
	task: z.object({
		title: z.string(),
		mediaType: z.string(),
	}),
	collector: z.object({
		name: z.string(),
	}),
});

export const ReviewSubmissionSchema = z.object({
	status: SubmissionStatusSchema,
	approverNote: z
		.string()
		.min(2, "Please provide a reason for the decision"),
});

export type Submission = z.infer<typeof SubmissionSchema>;
export type ReviewSubmissionInput = z.infer<typeof ReviewSubmissionSchema>;