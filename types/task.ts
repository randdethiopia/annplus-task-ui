import { z } from "zod";

import { TaskMediaTypeSchema } from "./validator";

export const createTaskSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  mediaType: TaskMediaTypeSchema,
  targetSubmissions: z.coerce.number().min(1, "Target must be at least 1"),
  minQuality: z.string().min(2, "Specify minimum quality (e.g. 1080p)"),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Deadline must be in the future",
  }),
  collectorsNeeded: z.coerce.number().min(1, "Need at least 1 collector"),
  reviewPolicy: z.enum(["manual", "auto", "hybrid"]),
  internalNotes: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
