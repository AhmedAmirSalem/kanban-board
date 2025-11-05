import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api";
import type { Task } from "../types";

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      title: string;
      description?: string;
      column?: Task["column"];
    }) =>
      createTask({
        title: input.title,
        description: input.description ?? "",
        column: input.column ?? "backlog",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
