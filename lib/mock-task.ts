import { MOCK_COLLECTORS } from "./mock-data";
import { MOCK_SUBMISSIONS } from "./mock-data";
import type { TaskWithRelations } from "../types/validator"; // Adjust the path if needed

export const MOCK_TASKS: TaskWithRelations[] = [
  {
    id: "task-1",
    title: "Street Sign Collection",
    description: "Take photos of all stop signs in the neighborhood.",
    mediaType: "IMAGE",
    createdById: "admin-1",
    createdAt: new Date().toISOString(),
    _count: { collectors: 2, submissions: 150 },
    // THE DOT: The Task knows who is working on it
    collectors: [MOCK_COLLECTORS[0], MOCK_COLLECTORS[1]],
    submissions: [MOCK_SUBMISSIONS[0], MOCK_SUBMISSIONS[1]]
  },
  {
    id: "task-2",
    title: "Traffic Flow Video",
    description: "Record 30 seconds of traffic at main intersections.",
    mediaType: "VIDEO",
    createdById: "admin-1",
    createdAt: new Date().toISOString(),
    _count: { collectors: 0, submissions: 12 },
    collectors: [],
    submissions: []
  }
];