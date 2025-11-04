import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { deleteTask } from "../api";
import type { Task } from "../types";

function isTaskArray(v: unknown): v is Task[] {
  return (
    Array.isArray(v) &&
    v.every((i) => !!i && typeof (i as Task).id === "string")
  );
}
type Snapshot = Array<[QueryKey, unknown]>;
type Ctx = { snapshot: Snapshot };

export function useDeleteTaskOptimistic() {
  const qc = useQueryClient();

  return useMutation<void, Error, string, Ctx>({
    mutationFn: (id: string) => deleteTask(id),
    retry: false,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const snapshot = qc.getQueriesData({ queryKey: ["tasks"] });

      snapshot.forEach(([key, data]) => {
        if (isTaskArray(data))
          qc.setQueryData<Task[]>(
            key,
            data.filter((t) => t.id !== id)
          );
      });

      return { snapshot };
    },

    onError: (_e, _id, ctx) => {
      ctx?.snapshot?.forEach(([key, data]) => qc.setQueryData(key, data));
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
