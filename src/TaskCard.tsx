import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./types";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
};

export default function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { column: task.column }, // used to know "from" column on drop
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
    cursor: "grab",
    userSelect: "none",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "10px 12px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>{task.title}</strong>
        <button onClick={() => onDelete(task.id)} style={{ marginLeft: 8 }}>
          x
        </button>
      </div>
      {task.description && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>
          {task.description}
        </div>
      )}
    </div>
  );
}
