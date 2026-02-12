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
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // adjust as per your enums
  approverNote: string | null;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  task: Task;
  collector: Collector;
}


interface SubmissionUpdateInput {
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  approverNote: string | null;
}


const getAllSubmissionsFn = async () => {
	return (await axiosInstance.get("/api/submissions")).data;
}

const updateSubmissionFn = async (id: string, data: SubmissionUpdateInput) => {
	return (await axiosInstance.patch(`/api/submissions/${id}`, data)).data;
};


export const submissionApi = {
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
