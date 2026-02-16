import { CollectorWithRelations, TaskWithRelations, Submission } from "@/types/validator";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- 1. THE SUBMISSIONS (The Bridge) ---
// These connect a specific Collector to a specific Task.
export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    taskId: "task-1",
    collectorId: "cl-001", // Abebe
    uploadUrl: "https://www.youtube.com/watch?v=6AyWxcviAFo&list=RD6AyWxcviAFo&start_radio=1",
    status: "APPROVED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-2",
    taskId: "task-1",
    collectorId: "cl-002", // Sara
    uploadUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  }
];

// --- 2. THE COLLECTORS ---
export const MOCK_COLLECTORS: CollectorWithRelations[] = [
  {
    id: "cl-001",
    name: "Abebe Kebede",
    phone: "+251 911 22 33 44",
    telegramUsername: "abebe_k",
    telegramChatId: "12345678",
    createdAt: new Date().toISOString(),
    stats: { approved: 45, pending: 12, rejected: 3 },
    // THE DOT: Abebe sees his assigned tasks
    tasks: [
      { id: "task-1", title: "Street Sign Collection", mediaType: "IMAGE", createdById: "admin-1", createdAt: new Date().toISOString() }
    ],
    submissions: [MOCK_SUBMISSIONS[0]]
  },
  {
    id: "cl-002",
    name: "Sara Tekle",
    phone: "+251 922 55 66 77",
    telegramUsername: "sara_t",
    telegramChatId: "87654321",
    createdAt: new Date().toISOString(),
    stats: { approved: 120, pending: 5, rejected: 15 },
    tasks: [
      { id: "task-1", title: "Street Sign Collection", mediaType: "IMAGE", createdById: "admin-1", createdAt: new Date().toISOString() }
    ],
    submissions: [MOCK_SUBMISSIONS[1]]
  },
  {
    id: "cl-003",
    name: "Samuel Ayele",
    phone: "+251 933 88 99 00",
    telegramUsername: null,
    telegramChatId: null,
    createdAt: new Date().toISOString(),
    stats: { approved: 0, pending: 2, rejected: 0 },
    tasks: [],
    submissions: []
  },
];

// --- 3. THE TASKS ---
