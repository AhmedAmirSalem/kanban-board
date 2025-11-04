import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api";
import type { Task } from "../types";

type CreateInput = {
  title: string;
  description?: string;
  column?: Task["column"]; // default backlog
};

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description = "",
      column = "backlog",
    }: CreateInput) => {
      return createTask({ title, description, column });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
