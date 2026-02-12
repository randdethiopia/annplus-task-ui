"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
	ClipboardCheck,
	FileText,
	Image as ImageIcon,
	Loader2,
	Mic,
	Users,
	Video,
	Info, // Added icon
	UserCheck // Added icon
} from "lucide-react";
import TaskApi from "@/api/task";

type TaskDetailsSheetProps = {
	id: string;
	onClose: () => void;
};

const mediaIcons: Record<string, typeof FileText> = {
	IMAGE: ImageIcon,
	VIDEO: Video,
	AUDIO: Mic,
	TEXT: FileText,
	DOC: FileText,
};

export function TaskDetailsSheet({ id, onClose }: TaskDetailsSheetProps) {
	// Tracker: Fetching the task WITH relations
	const { data: task, isLoading } = TaskApi.getById.useQuery(id);
	const Icon = task?.mediaType ? mediaIcons[task.mediaType] : FileText;

	return (
		<Sheet open={Boolean(id)} onOpenChange={onClose}>
			<SheetContent className="flex h-full w-full flex-col gap-6 border-l-0 p-0 sm:max-w-md sm:rounded-l-[2rem]">
				{/* 1. Static Header */}
				<SheetHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
					<SheetTitle className="text-2xl font-bold text-slate-900">
						Task Workspace
					</SheetTitle>
				</SheetHeader>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					</div>
				) : task ? (
					<Tabs defaultValue="details" className="flex flex-1 flex-col">
						{/* 2. Professional Tab Navigation */}
						<div className="px-6 sm:px-8">
							<TabsList className="grid w-full grid-cols-2 rounded-xl bg-[#F3F8FF] p-1">
								<TabsTrigger value="details" className="rounded-lg text-xs font-bold">
									<Info className="mr-2 h-3.5 w-3.5" /> Details
								</TabsTrigger>
								<TabsTrigger value="team" className="rounded-lg text-xs font-bold">
									<Users className="mr-2 h-3.5 w-3.5" /> Team ({task.collectors?.length || 0})
								</TabsTrigger>
							</TabsList>
						</div>

						{/* 3. Tab 1: Basic Information */}
						<TabsContent value="details" className="flex-1 overflow-y-auto p-6 sm:p-8 mt-0 space-y-8">
							<section className="grid gap-4 rounded-2xl bg-blue-50/60 p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm text-blue-700">
										<Icon className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-base font-bold text-slate-900">{task.title}</h3>
										<Badge className="mt-1 border-none bg-blue-100 text-[10px] font-bold text-blue-700">
											{task.mediaType}
										</Badge>
									</div>
								</div>
								<p className="text-sm leading-relaxed text-slate-600">
									{task.description || "No description provided."}
								</p>
							</section>

							<section className="grid grid-cols-2 gap-3">
								<StatCard label="Collectors" value={task._count?.collectors ?? 0} icon={Users} />
								<StatCard label="Submissions" value={task._count?.submissions ?? 0} icon={ClipboardCheck} />
							</section>
						</TabsContent>

						{/* 4. Tab 2: The Relationship (Assigned Team) */}
						<TabsContent value="team" className="flex-1 overflow-y-auto p-6 sm:p-8 mt-0">
							<div className="space-y-3">
								<h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
									Assigned Data Collectors
								</h4>
								
								{task.collectors && task.collectors.length > 0 ? (
									task.collectors.map((collector: any) => (
										<div 
											key={collector.id} 
											className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
													{collector.name[0]}
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-bold text-slate-800">{collector.name}</span>
													<span className="text-[10px] text-slate-400">{collector.phone}</span>
												</div>
											</div>
											<div className="h-2 w-2 rounded-full bg-emerald-500" title="Active" />
										</div>
									))
								) : (
									<div className="flex flex-col items-center justify-center py-10 text-center">
										<UserCheck className="h-10 w-10 text-slate-200 mb-2" />
										<p className="text-xs text-slate-400">No collectors assigned yet.</p>
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>
				) : (
					<div className="flex flex-1 items-center justify-center text-sm text-slate-500">
						Task not found.
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

// Internal Stat Card Helper
function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
	return (
		<div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-4 text-center">
			<Icon className="h-4 w-4 text-slate-400" />
			<span className="text-lg font-black text-slate-800">{value}</span>
			<span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
		</div>
	);
}