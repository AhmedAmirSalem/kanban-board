import axios from "axios";
import type { Task } from "./types";

const api = axios.create({ baseURL: "http://localhost:4000" });

export async function getTasksByColumn(params: { column: Task["column"] }) {
  // prefer server sort; json-server supports _sort by a single field
  const { data } = await api.get<Task[]>("/tasks", {
    params: { column: params.column, _sort: "order", _order: "desc" }
  });
  // backfill for legacy rows
  return data.map(t => ({
    ...t,
    createdAt: t.createdAt ?? 0,
    order: t.order ?? t.createdAt ?? 0
  }));
}

export async function createTask(input: Omit<Task, "id" | "createdAt" | "order">) {
  const now = Date.now();
  const payload = { ...input, createdAt: now, order: now };
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
