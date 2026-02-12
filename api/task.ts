import { axiosInstance  as axios } from "@/lib/axios";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";


type Task = any; 
type CreateTaskPayload = {
  title: string;
  description?: string;
  mediaType?: "IMAGE" | "VIDEO";
};

type ToggleActivePayload = {
  id: string;
  isActive: boolean;
};

type AssignPayload = {
  collectorIds: string[];
};



export async function fetchTasks() {
  return (await axios.get("/api/tasks")).data;
}

export async function fetchTaskById(id: string) {
  return (await axios.get(`/api/tasks/${id}`)).data;
}

export async function createTaskFn(payload: CreateTaskPayload) {
  return (await axios.post("/api/tasks", payload)).data;
}

export async function toggleTaskActiveFn(payload: ToggleActivePayload) {
  return (await axios.patch(`/api/tasks/active/${payload.id}`, { isActive: payload.isActive })).data;
}

export async function assignUsersToTaskFn(id: string | null, payload: AssignPayload) {
  return (await axios.post(`/api/tasks/assign/${id}`, { collectorIds: payload.collectorIds })).data;
}



const TaskApi = {
  getAll: {
    useQuery: (options?: UseQueryOptions<Task[], AxiosError, any>) =>
      useQuery({
        queryKey: ["tasks"],
        queryFn: () => fetchTasks(),
        ...options,
      }),
  },

  getById: {
    useQuery: (id: string, options?: UseQueryOptions<Task, AxiosError>) =>
      useQuery({
        queryKey: ["tasks", id],
        queryFn: () => fetchTaskById(id),
        ...options,
      }),
  },

  create: {
    useMutation: (options?: UseMutationOptions<any, AxiosError, CreateTaskPayload>) =>
      useMutation({
        mutationFn: (data) => createTaskFn(data),
        onSuccess: (data) => {
          toast("LOADING");
          toast(data.message);
        },
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
    useMutation: (id: string, options?: UseMutationOptions<any, AxiosError, AssignPayload>) =>
      useMutation({
        mutationFn: (data) => assignUsersToTaskFn(id, data),
        ...options,
        onSuccess: (data) => {
          toast("LOADING");
          toast(data.message);
        },
      }),
  },
};

export default TaskApi;