import { axiosInstance as axios } from "@/lib/axios";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface RegisterCollectorInput {
  name: string;
  phone: string;
  telegramUsername: string;
  password?: string;
}

export interface Collector {
  id: string;
  name: string;
  phone: string;
  telegramUsername: string;
  createdAt?: string;
}

export interface RegisterCollectorResponse {
  message: string;
  collector: Collector;
  redirect: string;
}

export interface ResetCollectorPasswordResponse {
  message: string;
  temporaryPassword?: string;
}

const registerCollectorFn = async (data: RegisterCollectorInput) => {
  const response = await axios.post("/api/data-collector/register", data);
  return response.data;
};

export const getAllCollectorsFn = async (): Promise<Collector[]> => {
  const response = await axios.get("/api/data-collector");
  const data = response.data;
  return Array.isArray(data) ? data : data?.data ?? data?.collectors ?? [];
};

const resetCollectorPasswordFn = async (
  id: string
): Promise<ResetCollectorPasswordResponse> => {
  const response = await axios.post(`/api/auth/data-collector/${id}/reset-password`);
  return response.data;
};

const changePasswordFn = async (
  data: ChangePasswordInput
): Promise<ChangePasswordResponse> => {
  const response = await axios.post("/api/auth/data-collector/change-password", data);
  return response.data;
};

export const dataCollectorApi = {
  register: {
    useMutation: (
      options?: UseMutationOptions<RegisterCollectorResponse, unknown, RegisterCollectorInput>
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
  resetPassword: {
    useMutation: (
      options?: UseMutationOptions<ResetCollectorPasswordResponse, unknown, string>
    ) =>
      useMutation({
        mutationFn: (id: string) => resetCollectorPasswordFn(id),
        ...options,
      }),
  },
  changePassword: {
    useMutation: (
      options?: UseMutationOptions<ChangePasswordResponse, unknown, ChangePasswordInput>
    ) =>
      useMutation({
        mutationFn: (data: ChangePasswordInput) => changePasswordFn(data),
        ...options,
      }),
  },
};