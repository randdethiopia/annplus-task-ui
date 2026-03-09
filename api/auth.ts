import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance as axios } from "@/lib/axios";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt?: string;
}

interface DataCollector {
  id: string
  name: string
  phone: string
  telegramUsername: string
  telegramChatId: string
  createdAt: string
  updatedAt: string
}
interface LoginInput {
    email: string;
    password: string;
}

interface DataCollectorLoginInput {
    phone: string;
    password: string;
}

interface LoginResponse {
    user: User;
    token: string;
}


interface DataCollectorLoginResponse {
    dataCollector: DataCollector;
    token: string;
}

interface RegisterInput {
    name: string;
    email: string;
    phone?: string;
    telegramUsername?: string;
    password: string;
    role: "SUPERVISOR" | "ADMIN" | "COLLECTOR";
}

interface RegisterResponse {
    user: User;
}

interface UsersResponse {
    users: User[];
}

const loginFn = async (data: LoginInput) => {
    const response = await axios.post("/api/auth/login", data);
    return response.data;
}

const dataCollectorLoginFn = async (data: DataCollectorLoginInput) => {
    const response = await axios.post("/api/auth/data-collector/login", data);
    return response.data;
}


const registerFn = async (data: RegisterInput) => {
    const response = await axios.post("/api/users/register", data);
    return response.data;
}


const getUsersFn = async (): Promise<UsersResponse> => {
    const response = await axios.get("/api/users");
    const data = response.data;
    return Array.isArray(data) ? { users: data } : data;
};

const getUserByIdFn = async (id: string): Promise<User> => {
    const response = await axios.get(`/api/users/${id}`);
    const data = response.data;
    return data?.user ?? data;
};

const AuthApi = {
    login: {
        useMutation: ( option?: UseMutationOptions<LoginResponse, AxiosError, LoginInput, unknown> ) => 
            useMutation({
                mutationFn: (data: LoginInput) => loginFn(data),
                ...option
            })
    },
    loginDataCollector: {
        useMutation: ( option?: UseMutationOptions<DataCollectorLoginResponse, AxiosError, DataCollectorLoginInput, unknown> ) => 
            useMutation({
                mutationFn: (data) => dataCollectorLoginFn(data),
                ...option
            })
    },
    register: {
        useMutation: ( option?: UseMutationOptions<RegisterResponse, AxiosError, RegisterInput, unknown> ) => 
            useMutation({
                mutationFn: (data: RegisterInput) => registerFn(data),
                ...option
            })
    },
    users: {
        useQuery: ( option?: UseQueryOptions<UsersResponse, AxiosError> ) =>
            useQuery({
                queryKey: ["users"],
                queryFn: () => getUsersFn(),
                ...option
            }),
        useByIdQuery: (id: string, option?: UseQueryOptions<User, AxiosError>) =>
            useQuery({
                queryKey: ["users", id],
                queryFn: () => getUserByIdFn(id),
                enabled: !!id,
                ...option
            }),
    }
};

export default AuthApi;
