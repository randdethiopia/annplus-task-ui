import { useQuery } from "@tanstack/react-query";
import { taskApi } from "@/api/task";
import type { Task, TaskWithRelations } from "@/types/validator";

export const taskKeys = {
	all: ["tasks"] as const,
	detail: (id: string) => [...taskKeys.all, id] as const,
};

// 1. Hook for the Table (Simple Task list)
export const useTasks = () =>
	useQuery<Task[]>({
		queryKey: taskKeys.all,
		queryFn: taskApi.getAll,
	});

// 2. Hook for the Sheet (Deep Task data with Relations)
export const useTaskDetail = (id: string | null) =>
	useQuery<TaskWithRelations>({
		queryKey: taskKeys.detail(id ?? ""),
		queryFn: () => taskApi.getById(id as string),
		enabled: Boolean(id), // Manager waits for an ID
	});