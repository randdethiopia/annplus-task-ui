import { useQuery } from "@tanstack/react-query";
import { collectorApi } from "@/api/data-collector";
import type { Collector, CollectorWithRelations } from "@/types/validator";

export const collectorKeys = {
	all: ["collectors"] as const,
	detail: (id: string) => [...collectorKeys.all, id] as const,
};

// 1. Hook for the Table (Simple Collector list)
export const useCollectors = () =>
	useQuery<Collector[]>({
		queryKey: collectorKeys.all,
		queryFn: collectorApi.getAll,
	});

// 2. Hook for the Sheet (Deep Collector data with Relations)
export const useCollectorDetail = (id: string | null) =>
	useQuery<CollectorWithRelations>({
		queryKey: collectorKeys.detail(id ?? ""),
		queryFn: () => collectorApi.getById(id as string),
		enabled: Boolean(id),
	});