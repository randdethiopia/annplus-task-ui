"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCollectorDetail } from "@/hooks/data-collect";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Clock,
	Loader2,
	Phone,
	Send,
	XCircle,
} from "lucide-react";

type CollectorDetailsSheetProps = {
	id: string | null;
	onClose: () => void;
};

type StatCardProps = {
	label: string;
	value: number;
	icon: typeof CheckCircle2;
	colorClass: string;
	bgClass: string;
};

export function CollectorDetailsSheet({
	id,
	onClose,
}: CollectorDetailsSheetProps) {
	const { data: collector, isLoading } = useCollectorDetail(id);

	return (
		<Sheet open={Boolean(id)} onOpenChange={onClose}>
			<SheetContent className="flex h-full w-full flex-col gap-6 border-l-0 p-6 sm:max-w-md sm:rounded-l-[2rem] sm:p-8">
				<SheetHeader className="p-0">
					<SheetTitle className="text-2xl font-semibold text-slate-900">
						Collector Details
					</SheetTitle>
				</SheetHeader>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					</div>
				) : collector ? (
					<div className="flex flex-col gap-8">
						<section className="grid gap-4 rounded-2xl bg-blue-50/60 p-4 sm:p-5">
							<div className="flex items-center gap-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
									{collector.name?.slice(0, 1) ?? "?"}
								</div>
								<div>
									<h3 className="text-base font-semibold text-slate-900">
										{collector.name}
									</h3>
									<p className="text-xs text-slate-500">ID: {collector.id}</p>
								</div>
							</div>

							<div className="flex flex-col gap-2 border-t border-blue-100 pt-3 text-sm text-slate-600">
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4" />
									<span>{collector.phone}</span>
								</div>
								{collector.telegramUsername ? (
									<a
										href={`https://t.me/${collector.telegramUsername}`}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-2 text-blue-600 hover:underline"
									>
										<Send className="h-4 w-4" />
										<span>@{collector.telegramUsername}</span>
									</a>
								) : null}
							</div>
						</section>

						<section className="flex flex-col gap-4">
							<h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
								Task Performance
							</h4>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
								<StatCard
									label="Approved"
									value={collector.stats?.approved ?? 0}
									icon={CheckCircle2}
									colorClass="text-emerald-600"
									bgClass="bg-emerald-50"
								/>
								<StatCard
									label="Pending"
									value={collector.stats?.pending ?? 0}
									icon={Clock}
									colorClass="text-amber-600"
									bgClass="bg-amber-50"
								/>
								<StatCard
									label="Rejected"
									value={collector.stats?.rejected ?? 0}
									icon={XCircle}
									colorClass="text-red-600"
									bgClass="bg-red-50"
								/>
							</div>
						</section>
					</div>
				) : (
					<div className="flex flex-1 items-center justify-center text-sm text-slate-500">
						No collector selected.
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

function StatCard({
	label,
	value,
	icon: Icon,
	colorClass,
	bgClass,
}: StatCardProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center gap-2 rounded-2xl p-4 text-center",
				bgClass
			)}
		>
			<Icon className={cn("h-5 w-5", colorClass)} />
			<span className="text-xl font-bold text-slate-800">{value}</span>
			<span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
				{label}
			</span>
		</div>
	);
}
