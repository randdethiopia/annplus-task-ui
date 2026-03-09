"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { getTasksFn } from "@/api/task";
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
					queryKey: ["tasks", { page: 1, limit: 10 }],
					queryFn: () => getTasksFn({ page: 1, limit: 10 }),
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
