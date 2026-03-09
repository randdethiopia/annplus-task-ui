import { axiosInstance  as axios } from "@/lib/axios";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";


export type TaskStatus = "PENDING" | "APPROVED" | "SUBMITTED" | "REJECTED"

export type MediaType = "IMAGE" | "VIDEO"

export interface Submission {
  id: string
  taskId: string
  collectorId: string
  mediaType: MediaType
  uploadUrl: string
  createdAt: string
  updatedAt: string
}
export interface Task {
  id: string
  title: string
  description: string
  videoCount: number
  imageCount: number
  isAssigned: boolean
  isActive: boolean
  status: TaskStatus
  createdById: string
  createdAt: string
  updatedAt: string
  _count: {
    submissions: number
  }
}

export interface TaskWithSubmissions {
  id: string
  title: string
  description: string
  videoCount: number
  imageCount: number
  isActive: boolean
  status: TaskStatus
  createdById: string
  reviewedById: string | null
  reviewerNote: string | null
  createdAt: string
  updatedAt: string
  submissions: Submission[]
}

export interface TaskDetailsResponse {
  task: TaskWithSubmissions
}

export interface TasksResponse {
  tasks: Task[]
  totalPages: number
  page: string
  limit: string
}

interface CollectorTasksResponse {
  collectorId: string;
  tasks: Task[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
  status: TaskStatus | null;
}



type CreateTaskPayload = {
  title: string;
  description?: string;
  imageCount: number;
  videoCount: number;
};

type ToggleActivePayload = {
  id: string;
  isActive: boolean;
};

type AssignPayload = {
  collectorIds: string[];
};


interface TaskQuery {
  page?: number;
  limit?: number;
  status?: string;
}

interface ReviewTaskInput { 
  status: TaskStatus;
  reviewerNote: string;
 }

export async function getTasksFn(pagination: TaskQuery) {
  return (await axios.get("/api/tasks", { params: pagination })).data;
}

export async function getTaskByIdFn(id: string) {
  return (await axios.get(`/api/tasks/${id}`)).data;
}

export async function getCollectorTasksFn(pagination: TaskQuery) {
  return (await axios.get(`/api/tasks/collector-tasks`, { params: pagination })).data;
}

export async function createTaskFn(payload: CreateTaskPayload) {
  return (await axios.post("/api/tasks", payload)).data;
}

export async function toggleTaskActiveFn(payload: ToggleActivePayload) {
  return (await axios.patch(`/api/tasks/active/${payload.id}`, { isActive: payload.isActive })).data;
}

export async function assignUsersToTaskFn(id: string | null, collectorId: string) {
  return (await axios.post(`/api/tasks/assign/${id}`, { collectorId })).data;
}

export async function reviewTaskFn(id: string, data: ReviewTaskInput) {
  return (await axios.post(`/api/tasks/review/${id}`, data)).data;
}

const TaskApi = {
  getAll: {
    useQuery: (
      query: TaskQuery,
      options?: UseQueryOptions<TasksResponse, AxiosError, any>
    ) =>
      useQuery({
        queryKey: ["tasks", query],
        queryFn: () => getTasksFn(query),
        ...options,
      }),
  },

  getById: {
    useQuery: (id: string | null, options?: UseQueryOptions<TaskDetailsResponse, AxiosError>) =>
      useQuery({
        queryKey: ["tasks", id],
        enabled: !!id,
        queryFn: () => getTaskByIdFn(id!),
        ...options,
      }),
  },
  getCollectorTasks: {
    useQuery: (query: TaskQuery, options?: UseQueryOptions<CollectorTasksResponse, AxiosError>) =>
      useQuery({
        queryKey: ["collector-tasks", query],
        queryFn: () => getCollectorTasksFn(query),
        ...options,
      }),
  },

  create: {
    useMutation: (options?: UseMutationOptions<any, AxiosError, CreateTaskPayload>) =>
      useMutation({
        mutationFn: (data) => createTaskFn(data),
        ...options
      }),
  },

  toggleActive: {
    useMutation: (options?: UseMutationOptions<any, AxiosError, ToggleActivePayload>) =>
      useMutation({
        mutationFn: (data) => toggleTaskActiveFn(data),
        ...options,
        onSuccess: (data) => {
        },
      }),
  },

  assign: {
    useMutation: (id: string, options?: UseMutationOptions<any, AxiosError, string>) =>
      useMutation({
        mutationFn: (collectorId) => assignUsersToTaskFn(id, collectorId),
        ...options,
        onSuccess: (data) => {
          toast("LOADING");
          toast(data.message);
        },
      }),
  },
  review: {
      useMutation: (id: string, options?: UseMutationOptions<AxiosError, Task, ReviewTaskInput>) =>
        useMutation({
          mutationFn: (data) =>
            reviewTaskFn(id, data),
          ...options,
        })
    }
};

export default TaskApi;