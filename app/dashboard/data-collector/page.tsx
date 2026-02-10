"use client";

import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

import { CollectorDetailsSheet } from "@/components/collector-sheet";
import { IslandCard } from "@/components/icard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCollectors } from "@/hooks/data-collect";

export default function DataCollectorsPage() {
	const { data: collectors, isLoading } = useCollectors();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	const filteredData = useMemo(() => {
		if (!collectors) return [];
		const normalized = search.trim().toLowerCase();
		if (!normalized) return collectors;
		return collectors.filter(
			(collector) =>
				collector.name.toLowerCase().includes(normalized) ||
				collector.phone.includes(normalized)
		);
	}, [collectors, search]);

	return (
		<div className="min-h-screen space-y-6 bg-[#E2EDF8] px-4 py-6 sm:px-6 lg:px-10">
			<header className="flex flex-col gap-1 px-2 sm:px-4">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
					Data Collectors
				</h1>
				<p className="text-sm font-medium text-slate-500 sm:text-base">
					Manage assignments and track performance
				</p>
			</header>

			<IslandCard className="px-5 py-6 sm:px-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative w-full sm:max-w-sm">
						<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							placeholder="Search by name or phone..."
							className="h-12 rounded-xl border-none bg-[#F3F8FF] pl-11"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
					</div>
				</div>

				<div className="mt-6 overflow-hidden rounded-2xl border border-slate-50">
					<Table>
						<TableHeader className="border-none bg-[#E2EDF8]/50">
							<TableRow className="border-none hover:bg-transparent">
								<TableHead className="h-14 font-semibold text-slate-700">
									Full Name
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Phone Number
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Telegram
								</TableHead>
								<TableHead className="pr-6 text-right font-semibold text-slate-700">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={`collector-skeleton-${index}`}>
										<TableCell className="py-5">
											<Skeleton className="h-5 w-40" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-5 w-32" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-5 w-28" />
										</TableCell>
										<TableCell className="pr-4 text-right">
											<Skeleton className="ml-auto h-9 w-9 rounded-xl" />
										</TableCell>
									</TableRow>
								))
							) : filteredData.length ? (
								filteredData.map((collector) => (
									<TableRow
										key={collector.id}
										className="border-b border-slate-50 hover:bg-slate-50/50"
									>
										<TableCell className="py-5 font-semibold text-slate-700">
											{collector.name}
										</TableCell>
										<TableCell className="font-medium text-slate-500">
											{collector.phone}
										</TableCell>
										<TableCell className="text-slate-500">
											{collector.telegramUsername
												? `@${collector.telegramUsername}`
												: "-"}
										</TableCell>
										<TableCell className="pr-4 text-right">
											<Button
												variant="ghost"
												size="icon"
												className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100"
												onClick={() => setSelectedId(collector.id)}
											>
												<Eye className="h-5 w-5 text-blue-600" />
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="py-12 text-center text-sm text-slate-500">
										No collectors match your search.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</IslandCard>

			<CollectorDetailsSheet
				id={selectedId}
				onClose={() => setSelectedId(null)}
			/>
		</div>
	);
}
