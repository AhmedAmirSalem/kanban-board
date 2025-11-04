import axios from "axios";
import type { Task } from "./types";

const api = axios.create({ baseURL: "http://localhost:4000" });

export async function getTasksByColumn(params: { column: Task["column"]; q: string }) {
  const { data } = await api.get<Task[]>("/tasks", {
    params: {
      column: params.column,
      q: params.q || undefined,
      _sort: "createdAt",
      _order: "desc"
    }
  });
  // backfill createdAt in case old rows exist
  return data.map(t => ({ ...t, createdAt: t.createdAt ?? 0 }));
}

export async function createTask(input: Omit<Task, "id" | "createdAt">) {
  const payload = { ...input, createdAt: Date.now() };
  const { data } = await api.post("/tasks", payload);
  return data as Task;
}

export async function updateTask(id: string, partial: Partial<Task>) {
  const { data } = await api.patch(`/tasks/${id}`, partial);
  return data as Task;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
