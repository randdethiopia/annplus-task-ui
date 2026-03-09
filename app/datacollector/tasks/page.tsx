"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import api from "@/api";
import { IslandCard } from "@/components/icard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskStatus } from "@/api/task";
import { cn } from "@/lib/utils";

const statusOptions: TaskStatus[] = ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"];

export default function DataCollectorTasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("PENDING");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: tasksData, isLoading } = api.task.getCollectorTasks.useQuery({
    page,
    limit,
    status: statusFilter,
  });
  const totalPages = tasksData?.totalPages ?? 0;

  const filteredTasks = useMemo(() => {
    const tasks = tasksData?.tasks ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );
  }, [tasksData, search]);

  return (
    <div className="min-h-screen space-y-6 bg-[#E2EDF8] px-4 py-6 sm:px-6 lg:px-10">
      <header className="flex flex-col gap-4 px-2 sm:px-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tasks
          </h1>
          <p className="text-sm font-medium text-slate-500 sm:text-base">
            View and complete your assigned tasks
          </p>
        </div>
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
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant="outline"
                className={cn(
                  "h-9 rounded-full border-slate-200 px-4 text-xs font-semibold uppercase tracking-[0.18em]",
                  statusFilter === status
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "bg-white/80 text-slate-500"
                )}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
              >
                {status}
              </Button>
            ))}
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
                  Images
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Videos
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Submissions
                </TableHead>
                <TableHead className="pr-6 text-right font-semibold text-slate-700">
                  view
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`collector-task-skeleton-${index}`}>
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
                    <TableCell className="pr-4 text-right">
                      <Skeleton className="ml-auto h-9 w-9 rounded-xl" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50"
                  >
                    <TableCell className="py-5 font-semibold text-slate-700">
                      {task.title}
                    </TableCell>
                    <TableCell className="py-5 font-semibold text-slate-700">
                     {task.uploaded.images} / {task.imageCount}
                    </TableCell>
                    <TableCell className="py-5 font-semibold text-slate-700">
                      {task.uploaded.videos} / {task.videoCount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                          (task.status ?? "PENDING") === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600"
                            : (task.status ?? "PENDING") === "REJECTED"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                        )}
                      >
                        {task.status ?? "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-500">
                      {task._count?.submissions ?? 0} items
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <Link href={`/datacollector/tasks/${task.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl bg-[#E2EDF8] hover:bg-blue-100"
                        >
                          <Eye className="h-5 w-5 text-blue-600" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
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
    </div>
  );
}
