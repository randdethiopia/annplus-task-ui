import type { Collector } from "@/types/validator";
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const MOCK_COLLECTORS: Collector[] = [
	{
		id: "cl-001",
		name: "Abebe Kebede",
		phone: "+251 911 22 33 44",
		telegramUsername: "abebe_k",
		telegramChatId: "12345678",
		createdAt: new Date().toISOString(),
		stats: {
			approved: 45,
			pending: 12,
			rejected: 3,
		},
	},
	{
		id: "cl-002",
		name: "Sara Tekle",
		phone: "+251 922 55 66 77",
		telegramUsername: "sara_t",
		telegramChatId: "87654321",
		createdAt: new Date().toISOString(),
		stats: {
			approved: 120,
			pending: 5,
			rejected: 15,
		},
	},
	{
		id: "cl-003",
		name: "Samuel Ayele",
		phone: "+251 933 88 99 00",
		telegramUsername: null,
		telegramChatId: null,
		createdAt: new Date().toISOString(),
		stats: {
			approved: 0,
			pending: 2,
			rejected: 0,
		},
	},
];
