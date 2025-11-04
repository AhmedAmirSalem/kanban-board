import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasksByColumn } from "../hooks/useTasksByColumn";
import TaskCard from "./TaskCard";
import type { Task } from "../types";

type Props = { title: string; column: Task["column"]; search: string };

export default function Column({ title, column, search }: Props) {
  const query = useTasksByColumn(column, search);
  const { setNodeRef, isOver } = useDroppable({
    id: column,
    data: { type: "column" },
  });

  if (query.isLoading)
    return (
      <div className="column">
        <h3>{title}</h3>Loading…
      </div>
    );
  if (query.error)
    return (
      <div className="column">
        <h3>{title}</h3>Error
      </div>
    );

  const ids = (query.data ?? []).map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className="column"
      style={{ background: isOver ? "#f2fbff" : undefined }}
    >
      <h3>{title}</h3>
      <SortableContext
        id={column}
        items={ids}
        strategy={verticalListSortingStrategy}
      >
        <div className="column-scroll">
          {query.data?.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
