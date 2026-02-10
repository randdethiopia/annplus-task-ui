import { useQuery } from "@tanstack/react-query";
import { collectorApi } from "@/api/data-collector";

export const collectorKeys = {
	all: ["collectors"] as const,
	detail: (id: string) => [...collectorKeys.all, id] as const,
};

export const useCollectors = () =>
	useQuery({
		queryKey: collectorKeys.all,
		queryFn: collectorApi.getAll,
	});

export const useCollectorDetail = (id: string | null) =>
	useQuery({
		queryKey: collectorKeys.detail(id ?? ""),
		queryFn: () => collectorApi.getById(id as string),
		enabled: Boolean(id),
	});
