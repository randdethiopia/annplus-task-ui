import { axiosInstance as axios } from "@/lib/axios";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface RegisterCollectorInput {
  name: string;
  phone: string;
  telegramUsername: string;
}

export interface Collector {
  id: string;
  name: string;
  phone: string;
  telegramUsername: string;
  createdAt?: string;
}

const registerCollectorFn = async (data: RegisterCollectorInput) => {
  const response = await axios.post("/api/data-collector/register", data);
  return response.data;
};

const getAllCollectorsFn = async (): Promise<Collector[]> => {
  const response = await axios.get("/api/data-collector");
  const data = response.data;
  return Array.isArray(data) ? data : data?.data ?? data?.collectors ?? [];
};

export const dataCollectorApi = {
  register: {
    useMutation: (
      options?: UseMutationOptions<unknown, unknown, RegisterCollectorInput>
    ) =>
      useMutation({
        mutationFn: (data: RegisterCollectorInput) => registerCollectorFn(data),
        ...options,
      }),
  },
  getAll: {
    useQuery: (options?: UseQueryOptions<Collector[], unknown>) =>
      useQuery({
        queryKey: ["data-collectors"],
        queryFn: getAllCollectorsFn,
        ...options,
      }),
  },
};