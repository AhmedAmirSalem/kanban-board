import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api";
import type { Task } from "../types";

type Patch = Partial<Pick<Task, "title" | "description" | "column">>;

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Patch }) =>
      updateTask(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
