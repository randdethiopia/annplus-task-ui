"use client";

import { useMemo, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import Link from "next/link";
import { TaskDetailsSheet } from "@/components/task-sheet";
import { IslandCard } from "@/components/icard";
import { Badge } from "@/components/ui/badge";
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
import TaskApi from "@/api/task";
import AssignModal from "./assign-modal";
import { dataCollectorApi } from "@/api/data-collector";


export default function TasksPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [ taskToAssign, setTaskToAssign] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const { data: tasks, isLoading } = TaskApi.getAll.useQuery();
    const { data: dataCollectors, isSuccess: isDataCollectorsSuccess } = dataCollectorApi.getAll.useQuery();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

    const filteredTasks = useMemo(() => {
        if (!tasks) return [];
        const normalized = search.trim().toLowerCase();
        if (!normalized) return tasks;
        return tasks.filter((task: any) =>
            task.title.toLowerCase().includes(normalized)
        );
    }, [tasks, search]);

    return (
        <div className="min-h-screen space-y-6 bg-[#E2EDF8] px-4 py-6 sm:px-6 lg:px-10">
            <header className="flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between sm:px-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Tasks
                    </h1>
                    <p className="text-sm font-medium text-slate-500 sm:text-base">
                        Create and monitor data collection jobs
                    </p>
                </div>
                <Link href="/dashboard/Task/new" className="inline-block">
                    <Button className="h-11 rounded-xl bg-blue-500 px-5 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </Link>
            </header>

            <IslandCard className="px-5 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search tasks..."
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
                                    Task Title
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700">
                                    Media Type
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700">
                                    Submissions
                                </TableHead>
                                <TableHead className="pr-6 text-right font-semibold text-slate-700">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={`task-skeleton-${index}`}>
                                        <TableCell className="py-5">
                                            <Skeleton className="h-5 w-44" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-24" />
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <Skeleton className="ml-auto h-9 w-9 rounded-xl" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredTasks.length ? (
                                filteredTasks.map((task: any) => (
                                    <TableRow
                                        key={task.id}
                                        className="border-b border-slate-50 hover:bg-slate-50/50"
                                    >
                                        <TableCell className="py-5 font-semibold text-slate-700">
                                            {task.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="rounded-lg border-slate-200 font-semibold text-slate-500"
                                            >
                                                {task.mediaType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-500">
                                            {task._count?.submissions ?? 0} items
                                            {/* _count not defined in Task type above — leave as-is or add to Task type if desired */}
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <Link
                                            href={`/dashboard/submissions?taskId=${task.id}`}
                                            >
                                             <Button
                                                variant="ghost"
                                                className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100 px-4 mx-4"
                                            >
                                                Submissions
                                            </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100 px-4 mx-4"
                                                onClick={() => {setTaskToAssign(task.id); setIsAssignModalOpen(true)}}
                                            >
                                                Assign
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100"
                                                onClick={() => setSelectedId(task.id)}
                                            >
                                                <Eye className="h-5 w-5 text-blue-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-500">
                                        No tasks match your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </IslandCard>

            <TaskDetailsSheet
                id={selectedId as string}
                onClose={() => setSelectedId(null)}
            />

            {isDataCollectorsSuccess &&
                <AssignModal
                    open={isAssignModalOpen}
                    users={dataCollectors}
                    taskId={ taskToAssign as string}
                    onClose={() => setIsAssignModalOpen(false)}
                />}
        </div>
    );
}
