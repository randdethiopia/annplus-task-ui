import { z } from "zod";


export const TaskMediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);
export const SubmissionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export const TaskStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const CountSchema = z.object({
  tasks: z.number().default(0),
  submissions: z.number().default(0),
  collectors: z.number().default(0), 
});

const CollectorStatsSchema = z.object({
  approved: z.number().default(0),
  pending: z.number().default(0),
  rejected: z.number().default(0),
});


export const SubmissionSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  collectorId: z.string(),
  uploadUrl: z.string(),
  status: SubmissionStatusSchema.default("PENDING"),
  approverNote: z.string().nullable().optional(),
  reviewedById: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
});


export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  mediaType: TaskMediaTypeSchema,
  status: TaskStatusSchema.default("PENDING"),
  createdById: z.string(),
  createdAt: z.string().or(z.date()),
  _count: CountSchema.optional(),
});

// Collector 
export const CollectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  telegramUsername: z.string().nullable().optional(),
  telegramChatId: z.coerce.string().nullable().optional(), // Senior Tip: Coerce BigInt to String
  createdAt: z.string().or(z.date()),
  _count: CountSchema.optional(),
  stats: CollectorStatsSchema.optional(),
});


export const CreateCollectorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  telegramUsername: z.string().trim().min(1, "Telegram username is required"),
});

export type CreateCollectorInput = z.infer<typeof CreateCollectorSchema>;

export const TaskWithRelationsSchema = TaskSchema.extend({
  collectors: z.array(CollectorSchema).optional(),
  submissions: z.array(SubmissionSchema).optional(),
});

// This version of a Collector includes their assigned tasks
export const CollectorWithRelationsSchema = CollectorSchema.extend({
  tasks: z.array(TaskSchema).optional(),
  submissions: z.array(SubmissionSchema).optional(),
});

export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required"),
  description: z.string().trim().min(1, "Description is required"),
  mediaType: TaskMediaTypeSchema,
});

export const CreateUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPERVISOR", "ADMIN", "COLLECTOR"]),
});

export const RegisterCollectorSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().min(6, "Enter a valid phone number"),
    telegramUsername: z
      .string()
      .trim()
      .regex(/^@\w{2,}$/, "Telegram username must start with @"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type RegisterCollectorInput = z.infer<typeof RegisterCollectorSchema>;

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskWithRelations = z.infer<typeof TaskWithRelationsSchema>;
export type Collector = z.infer<typeof CollectorSchema>;
export type CollectorWithRelations = z.infer<typeof CollectorWithRelationsSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;