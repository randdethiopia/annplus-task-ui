import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="flex-1 px-6 py-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-8 w-56" />
						<Skeleton className="h-4 w-72" />
					</div>
					<div className="flex gap-3">
						<Skeleton className="h-10 w-28 rounded-xl" />
						<Skeleton className="h-10 w-32 rounded-xl" />
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
					<div className="space-y-6">
						<Skeleton className="h-40 w-full rounded-2xl" />
						<Skeleton className="h-56 w-full rounded-2xl" />
						<Skeleton className="h-48 w-full rounded-2xl" />
					</div>
					<div className="space-y-4">
						<Skeleton className="h-32 w-full rounded-2xl" />
						<Skeleton className="h-40 w-full rounded-2xl" />
					</div>
				</div>
			</div>
		</div>
	);
}
