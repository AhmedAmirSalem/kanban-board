import axios from "axios";
import type { Task } from "./types";

const api = axios.create({ baseURL: "http://localhost:4000" });

export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get("/tasks");
  return data;
}

export async function createTask(input: Omit<Task, "id">) {
  const { data } = await api.post("/tasks", input);
  return data as Task;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
