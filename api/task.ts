import { MOCK_TASKS } from "@/lib/mock-task";
// Update the path below to the correct relative location of 'delay'
import { delay } from "@/lib/mock-data";
import type { Task } from "../types/validator";

export const taskApi = {
  // 1. GET ALL: For the table (Lightweight)
  getAll: async (): Promise<Task[]> => {
    await delay(600);
    return MOCK_TASKS;
  },

  // 2. GET BY ID: For the Sheet
  getById: async (id: string): Promise<Task> => {
    await delay(400);
    const task = MOCK_TASKS.find((t) => t.id === id);

    return (
      (task as Task) ??
      ({
        id,
        title: "Unknown Task",
        description: "This task could not be found.",
        mediaType: "TEXT",
        createdById: "system",
        createdAt: new Date().toISOString(),
        _count: { collectors: 0, submissions: 0 },
      } as Task)
    );
  },
};