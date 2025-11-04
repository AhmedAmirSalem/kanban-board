import { useQuery } from "@tanstack/react-query";
import { getTasksByColumn } from "../api";
import type { Task } from "../types";

export function useTasksByColumn(column: Task["column"], q: string) {
  return useQuery({
    queryKey: ["tasks", column, q],
    queryFn: async () => {
      const all = await getTasksByColumn({ column, q: "" }); // no q server side
      const keyword = q.trim().toLowerCase();

      if (!keyword) return all;

      return all.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          t.description.toLowerCase().includes(keyword)
      );
    },
  });
}
