import { delay, MOCK_COLLECTORS } from "@/lib/mock-data";
import type { Collector, CollectorWithRelations } from "@/types/validator";

export const collectorApi = {
  // 1. GET ALL: For the table
  getAll: async (): Promise<Collector[]> => {
    await delay(800);
    return MOCK_COLLECTORS;
  },

  // 2. GET BY ID: For the Sheet (Includes their assigned Tasks)
  getById: async (id: string): Promise<CollectorWithRelations> => {
    await delay(400);
    const collector = MOCK_COLLECTORS.find((c) => c.id === id);

    return (
      (collector as CollectorWithRelations) ??
      ({
        id,
        name: "Unknown Collector",
        phone: "N/A",
        telegramUsername: null,
        telegramChatId: null,
        createdAt: new Date().toISOString(),
        tasks: [], // Safety net: no tasks found
        submissions: [], // Safety net: no submissions found
      } as CollectorWithRelations)
    );
  },
};