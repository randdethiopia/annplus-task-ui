import { delay, MOCK_COLLECTORS } from "@/lib/mock-data";
import type { Collector } from "@/types/validator";

export const collectorApi = {
	getAll: async () => {
		await delay(800);
		return MOCK_COLLECTORS;
	},
	getById: async (id: string) => {
		await delay(400);
		return (
			MOCK_COLLECTORS.find((collector) => collector.id === id) ??
			({
				id,
				name: "Unknown Collector",
				phone: "",
				telegramUsername: null,
				telegramChatId: null,
				createdAt: new Date().toISOString(),
			} as Collector)
		);
	},
};
