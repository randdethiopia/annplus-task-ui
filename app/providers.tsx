"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { fetchTasks } from "@/api/task";
import { getAllCollectorsFn } from "@/api/data-collector";

export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60_000,
						gcTime: 5 * 60_000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			})
	);

	useEffect(() => {
		const warmup = async () => {
			await Promise.allSettled([
				queryClient.prefetchQuery({
					queryKey: ["tasks"],
					queryFn: fetchTasks,
				}),
				queryClient.prefetchQuery({
					queryKey: ["data-collectors"],
					queryFn: getAllCollectorsFn,
				}),
			]);
		};

		warmup();
	}, [queryClient]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster position="top-right" />
		</QueryClientProvider>
	);
}
