export type Task = {
  id: string;
  title: string;
  description: string;
  column: "backlog" | "in-progress" | "review" | "done";
  createdAt: number;
};
