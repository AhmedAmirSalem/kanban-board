import type { Task } from "./types";
import { useTasksByColumn } from "./hooks/useTaskByColumn";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

type Props = {
  title: string;
  column: Task["column"];
  onDelete: (id: string) => void;
};

export default function Column({ title, column, onDelete }: Props) {
  const query = useTasksByColumn(column, ""); // if you added search later, pass it
  const { setNodeRef, isOver } = useDroppable({ id: column });

  if (query.isLoading)
    return <div style={{ width: "25%", padding: 12 }}>Loading {title}...</div>;
  if (query.error)
    return (
      <div style={{ width: "25%", padding: 12 }}>Error loading {title}</div>
    );

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "25%",
        padding: 12,
        borderRight: "1px solid #aaa",
        background: isOver ? "#f5fbff" : "transparent",
        minHeight: 400,
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          maxHeight: 520,
        }}
      >
        {query.data?.map((t) => (
          <TaskCard key={t.id} task={t} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
