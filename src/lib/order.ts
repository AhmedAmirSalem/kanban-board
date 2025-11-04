import type { Task } from "../types";

export function computeNewOrder({
  items,
  overId,
  dropPosition, // "above" | "below"
}: {
  items: Task[];
  overId: string;
  dropPosition: "above" | "below";
}) {
  const sorted = [...items].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
  const overIndex = sorted.findIndex((t) => t.id === overId);
  const idxTarget = dropPosition === "above" ? overIndex : overIndex + 1;

  const prev = sorted[idxTarget - 1] ?? null;
  const next = sorted[idxTarget] ?? null;

  if (prev && next) return (prev.order + next.order) / 2;
  if (!prev && next) return next.order + 1000;
  if (prev && !next) return prev.order - 1000;
  return Date.now();
}
