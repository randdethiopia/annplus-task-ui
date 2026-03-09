import { axiosInstance } from "@/lib/axios";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";


interface Task {
  id: string;
  title: string;
  description: string;
  mediaType: 'IMAGE' | 'VIDEO' | string; // extend as needed
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface Collector {
	id: string;
	name: string;
	phone: string;
	telegramUsername: string | null;
	telegramChatId: string | null;
	activeTaskId: string | null;
	createdAt: string;
	updatedAt: string;
}

interface Submission {
  id: string;
  taskId: string;
  collectorId: string;
  uploadUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverNote: string | null;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  task: Task;
  collector: Collector;
}

interface CreateSubmissionInput {
	taskId: string;
	uploadUrl: string;
	mediaType: 'IMAGE' | 'VIDEO';
}

interface SubmissionUpdateInput {
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  approverNote: string | null;
}


const createSubmissionFn = async (data: CreateSubmissionInput) => {
	return (await axiosInstance.post("/api/submissions", data)).data;
};

const getAllSubmissionsFn = async () => {
	return (await axiosInstance.get("/api/submissions")).data;
}

const updateSubmissionFn = async (id: string, data: SubmissionUpdateInput) => {
	return (await axiosInstance.patch(`/api/submissions/${id}`, data)).data;
};


export const submissionApi = {
	create: {
		useMutation: (options?: UseMutationOptions<Submission, unknown, CreateSubmissionInput>) =>
			useMutation({
				mutationFn: (data: CreateSubmissionInput) =>
					createSubmissionFn(data),
				...options,
			})
	},
	
	getAll:{
		useQuery: (options?: UseQueryOptions<Submission[]>) =>
			useQuery({
				queryKey: ["submissions"],
				queryFn: getAllSubmissionsFn,
				...options,
			}),
	},

	review: {
		useMutation: (id: string, options?: UseMutationOptions<Submission, unknown, SubmissionUpdateInput>) =>
			useMutation({
				mutationFn: (data: SubmissionUpdateInput) =>
					updateSubmissionFn(id, data),
				...options,
			})
	}
};
