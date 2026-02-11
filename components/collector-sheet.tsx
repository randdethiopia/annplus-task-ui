"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import { useCollectorDetail } from "@/hooks/data-collect";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Clock,
	Loader2,
	Phone,
	Send,
	XCircle,
	User,      // Added icon
	Briefcase, // Added icon
	Info       // Added icon
} from "lucide-react";

type CollectorDetailsSheetProps = {
	id: string | null;
	onClose: () => void;
};

export function CollectorDetailsSheet({
	id,
	onClose,
}: CollectorDetailsSheetProps) {
	// Tracker: Fetching the collector WITH relations
	const { data: collector, isLoading } = useCollectorDetail(id);

	return (
		<Sheet open={Boolean(id)} onOpenChange={onClose}>
			<SheetContent className="flex h-full w-full flex-col gap-6 border-l-0 p-0 sm:max-w-md sm:rounded-l-[2rem]">
				{/* 1. Static Header */}
				<SheetHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
					<SheetTitle className="text-2xl font-bold text-slate-900">
						Collector Profile
					</SheetTitle>
				</SheetHeader>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					</div>
				) : collector ? (
					<Tabs defaultValue="profile" className="flex flex-1 flex-col">
						{/* 2. Professional Tab Navigation */}
						<div className="px-6 sm:px-8">
							<TabsList className="grid w-full grid-cols-2 rounded-xl bg-[#F3F8FF] p-1">
								<TabsTrigger value="profile" className="rounded-lg text-xs font-bold">
									<User className="mr-2 h-3.5 w-3.5" /> Profile
								</TabsTrigger>
								<TabsTrigger value="tasks" className="rounded-lg text-xs font-bold">
									<Briefcase className="mr-2 h-3.5 w-3.5" /> Tasks ({collector.tasks?.length || 0})
								</TabsTrigger>
							</TabsList>
						</div>

						{/* 3. Tab 1: Profile & Performance */}
						<TabsContent value="profile" className="flex-1 overflow-y-auto p-6 sm:p-8 mt-0 space-y-8">
							<section className="grid gap-4 rounded-2xl bg-blue-50/60 p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
										{collector.name?.slice(0, 1) ?? "?"}
									</div>
									<div>
										<h3 className="text-base font-bold text-slate-900">
											{collector.name}
										</h3>
										<p className="text-[10px] font-bold text-slate-400">ID: {collector.id}</p>
									</div>
								</div>

								<div className="flex flex-col gap-2 border-t border-blue-100 pt-3 text-sm text-slate-600">
									<div className="flex items-center gap-2">
										<Phone className="h-3.5 w-3.5 text-slate-400" />
										<span className="font-medium">{collector.phone}</span>
									</div>
									{collector.telegramUsername && (
										<a
											href={`https://t.me/${collector.telegramUsername}`}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
										>
											<Send className="h-3.5 w-3.5" />
											<span>@{collector.telegramUsername}</span>
										</a>
									)}
								</div>
							</section>

							<section className="space-y-4">
								<h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
									Performance Metrics
								</h4>
								<div className="grid grid-cols-3 gap-2">
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
						</TabsContent>

						{/* 4. Tab 2: Relationship (Assigned Tasks) */}
						<TabsContent value="tasks" className="flex-1 overflow-y-auto p-6 sm:p-8 mt-0">
							<div className="space-y-3">
								<h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
									Currently Assigned Tasks
								</h4>

								{collector.tasks && collector.tasks.length > 0 ? (
									collector.tasks.map((task) => (
										<div
											key={task.id}
											className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-blue-200 transition-colors"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-blue-600 group-hover:bg-blue-50 transition-colors">
													<Briefcase className="h-4 w-4" />
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-bold text-slate-800">{task.title}</span>
													<span className="text-[10px] font-bold text-blue-500 uppercase">{task.mediaType}</span>
												</div>
											</div>
										</div>
									))
								) : (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
											<Info className="h-6 w-6 text-slate-200" />
										</div>
										<p className="text-xs text-slate-400 font-medium">No tasks assigned to this collector.</p>
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>
				) : (
					<div className="flex flex-1 items-center justify-center text-sm text-slate-500">
						Collector not found.
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

// Internal Stat Card Helper
function StatCard({ label, value, icon: Icon, colorClass, bgClass }: any) {
	return (
		<div className={cn("flex flex-col items-center gap-1 rounded-2xl p-3 text-center", bgClass)}>
			<Icon className={cn("h-4 w-4", colorClass)} />
			<span className="text-lg font-black text-slate-800">{value}</span>
			<span className="text-[8px] font-bold uppercase tracking-tighter text-slate-500">
				{label}
			</span>
		</div>
	);
}