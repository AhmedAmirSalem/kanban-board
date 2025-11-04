// src/TaskCard.tsx
import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";
import { useDeleteTaskOptimistic } from "../hooks/useDeleteTaskOptimistic";

type Props = { task: Task };

export default function TaskCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      data: { type: "task", column: task.column },
    });

  const del = useDeleteTaskOptimistic();

  // hard guard + instant local removal
  const lockRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (lockRef.current || busy || del.isPending) return;
    lockRef.current = true;
    setBusy(true);
    setRemoved(true); // disappear immediately

    try {
      await del.mutateAsync(task.id);
      // success → stay unmounted
    } catch {
      // rollback only on failure
      lockRef.current = false;
      setBusy(false);
      setRemoved(false);
    }
  }

  if (removed) return null;

  return (
    <div
      ref={setNodeRef}
      className="card"
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.65 : 1,
        userSelect: "none",
        cursor: "grab",
      }}
      {...attributes}
      {...listeners} // whole card is draggable
    >
      <div className="card-title">
        <span>{task.title}</span>

        <button
          className="delete"
          // block drag initiation so a click is just a click
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          disabled={busy || del.isPending}
        >
          {busy || del.isPending ? "…" : "x"}
        </button>
      </div>

      {task.description && <div className="card-desc">{task.description}</div>}
    </div>
  );
}
