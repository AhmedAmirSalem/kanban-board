export const COLUMNS = ["backlog", "in-progress", "review", "done"] as const;
export type ColumnId = typeof COLUMNS[number];

export function isColumnId(v: unknown): v is ColumnId {
  return typeof v === "string" && (COLUMNS as readonly string[]).includes(v);
}
