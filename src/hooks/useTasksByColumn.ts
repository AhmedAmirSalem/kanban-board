import { useQuery } from "@tanstack/react-query";
import { getTasksByColumn } from "../api";
import type { Task } from "../types";

export function useTasksByColumn(column: Task["column"], q: string) {
  return useQuery({
    queryKey: ["tasks", column, q],
    queryFn: async () => {
      const list = await getTasksByColumn({ column });
      // client fallback + safety
      const sorted = [...list].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
      const k = q.trim().toLowerCase();
      if (!k) return sorted;
      return sorted.filter(
        (t) =>
          t.title.toLowerCase().includes(k) ||
          t.description.toLowerCase().includes(k)
      );
    },
  });
}
