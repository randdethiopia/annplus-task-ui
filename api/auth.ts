import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance as axios } from "@/lib/axios";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface LoginInput {
    email: string;
    password: string;
}

interface LoginResponse {
    user: User;
    token: string;
}

const loginFn = async (data: LoginInput) => {
    const response = await axios.post("/api/auth/login", data);
    return response.data;
}



const AuthApi = {
    login: {
        useMutation: ( option?: UseMutationOptions<LoginResponse, AxiosError, LoginInput, unknown> ) => 
            useMutation({
                mutationFn: (data: LoginInput) => loginFn(data),
                ...option
            })
    }
};

export default AuthApi;