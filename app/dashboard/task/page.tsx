"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import Link from "next/link";
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
import TaskApi, { Task } from "@/api/task";
import { cn } from "@/lib/utils";
import AssignModal from "./assign-modal";
import { dataCollectorApi } from "@/api/data-collector";
import { Pagination } from "@/components/pagination";
import { ExportTask } from "./export-task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const statusOptions = ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [taskToAssign, setTaskToAssign] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<typeof statusOptions[number]>("PENDING");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [totalPages, setTotalPages] = useState(0);

    const { data: tasksData, isLoading, isSuccess: isTaskSuccess } = TaskApi.getAll.useQuery({
        page,
        limit,
        status: statusFilter,
        sortOrder,
    });
    const { data: dataCollectors, isSuccess: isDataCollectorsSuccess } = dataCollectorApi.getAll.useQuery();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);


    useEffect(() => {
        if (isTaskSuccess) {
            setTasks(tasksData.tasks);
            setTotalPages(tasksData.totalPages);
        }
    }, [isTaskSuccess, tasksData, limit]);


    const handleSortOrderChange = (value: "asc" | "desc") => {
        setSortOrder(value);
        setTasks((currentTasks) =>
            [...currentTasks].sort((firstTask, secondTask) => {
                const firstTimestamp = new Date(firstTask.createdAt).getTime();
                const secondTimestamp = new Date(secondTask.createdAt).getTime();

                return value === "asc"
                    ? firstTimestamp - secondTimestamp
                    : secondTimestamp - firstTimestamp;
            })
        );
    };


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
                <Link href="/dashboard/task/new" className="inline-block">
                    <Button className="h-11 rounded-xl bg-blue-500 px-5 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </Link>
            </header>

            <IslandCard className="px-5 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex gap-4">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search tasks..."
                                className="h-12 rounded-xl border-none bg-[#F3F8FF] pl-11"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold uppercase  text-slate-500">
                                Sort
                            </span>
                            <Select value={sortOrder} onValueChange={(value) => handleSortOrderChange(value as "asc" | "desc")}>
                                <SelectTrigger className="shadow-none" >
                                    <SelectValue placeholder="Sort order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest first</SelectItem>
                                    <SelectItem value="asc">Oldest first</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map(
                            (status) => (
                                <Button
                                    key={status}
                                    variant="outline"
                                    className={cn(
                                        "h-9 rounded-full border-slate-200 px-4 text-xs font-semibold uppercase tracking-[0.18em]",
                                        statusFilter === status
                                            ? "border-slate-900 bg-slate-900 text-white"
                                            : "bg-white/80 text-slate-500"
                                    )}
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status}
                                </Button>
                            )
                        )}
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
                                    Images needed
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700">
                                    Videos needed
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700">
                                    Status
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
                                        <TableCell className="py-5">
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <Skeleton className="h-5 w-24" />
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <Skeleton className="h-5 w-16" />
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <Skeleton className="ml-auto h-9 w-9 rounded-xl" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TableRow
                                        key={task.id}
                                        className="border-b border-slate-50 hover:bg-slate-50/50"
                                    >
                                        <TableCell className="py-5 font-semibold text-slate-700">
                                            {task.title}
                                        </TableCell>
                                        <TableCell className="py-5 font-semibold text-slate-700">
                                            {task.imageCount}
                                        </TableCell>
                                        <TableCell className="py-5 font-semibold text-slate-700">
                                            {task.videoCount}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-full border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                                                    (task.status ? task.status : "PENDING") === "APPROVED"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : (task.status ? task.status : "PENDING") === "REJECTED"
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-amber-50 text-amber-600"
                                                )}
                                            >
                                                {task.status ? task.status : "PENDING"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-500">
                                            {task._count.submissions ?? 0} items
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            {
                                                task.status === "APPROVED" &&
                                                <ExportTask taskId={task.id} />
                                            }
                                            <Link
                                            href={`/dashboard/task/${task.id}`}
                                            >
                                             <Button
                                                variant="ghost"
                                                className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100 px-4 mx-4"
                                            >
                                                Submissions
                                            </Button>
                                            </Link>
                                            {
                                             task.isAssigned ?
                                                <Badge> Assigned </Badge> :
                                            <Button
                                                variant="ghost"
                                                className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100 px-4 mx-4"
                                                onClick={() => { setTaskToAssign(task.id); setIsAssignModalOpen(true) }}
                                            >
                                                Assign
                                            </Button>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-500">
                                        No tasks match your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Pagination
                    page={page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    limit={limit}
                    onLimitChange={setLimit}
                    loading={isLoading}
                />
            </IslandCard>

            {/* <TaskDetailsSheet
                id={selectedId as string}
                onClose={() => setSelectedId(null)}
            /> */}

            {isDataCollectorsSuccess &&
                <AssignModal
                    open={isAssignModalOpen}
                    users={dataCollectors}
                    taskId={taskToAssign as string}
                    onClose={() => setIsAssignModalOpen(false)}
                />}
        </div>
    );
}
