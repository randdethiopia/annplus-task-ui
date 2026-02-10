import { z } from "zod";

const CollectorCountSchema = z.object({
  tasks: z.number().int().nonnegative().default(0),
  submissions: z.number().int().nonnegative().default(0),
});

const CollectorStatsSchema = z.object({
  approved: z.number().int().nonnegative().default(0),
  pending: z.number().int().nonnegative().default(0),
  rejected: z.number().int().nonnegative().default(0),
});

export const CollectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  telegramUsername: z.string().nullable().optional(),
  telegramChatId: z.coerce.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
  _count: CollectorCountSchema.optional(),
  stats: CollectorStatsSchema.optional(),
});

export type Collector = z.infer<typeof CollectorSchema>;
export type CollectorCount = z.infer<typeof CollectorCountSchema>;
export type CollectorStats = z.infer<typeof CollectorStatsSchema>;