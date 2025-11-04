import { useState } from "react";
import type { Task } from "./types";
import { createTask, deleteTask, updateTask } from "./api";
import Column from "./Column";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter
} from "@dnd-kit/core";

export default function App() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  async function addTask() {
    if (!title.trim()) return;
    await createTask({ title, description: "", column: "backlog" });
    setTitle("");
    qc.invalidateQueries({ queryKey: ["tasks", "backlog"] });
  }

  async function removeTask(id: string) {
    await deleteTask(id);
    (["backlog","in-progress","review","done"] as Task["column"][]).forEach(c =>
      qc.invalidateQueries({ queryKey: ["tasks", c] })
    );
  }

  async function moveTask(id: string, to: Task["column"]) {
    await updateTask(id, { column: to });
    (["backlog","in-progress","review","done"] as Task["column"][]).forEach(c =>
      qc.invalidateQueries({ queryKey: ["tasks", c] })
    );
  }

  function onDragEnd(e: DragEndEvent) {
    const taskId = String(e.active.id);
    const from = e.active.data.current?.column as Task["column"] | undefined;
    const to = e.over?.id as Task["column"] | undefined;

    if (!to || !from || to === from) return;
    moveTask(taskId, to);
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Kanban Board</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="task title"
          style={{ padding: 8 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 12 }}>
          <Column title="Backlog"     column="backlog"     onDelete={removeTask} />
          <Column title="In Progress" column="in-progress" onDelete={removeTask} />
          <Column title="Review"      column="review"      onDelete={removeTask} />
          <Column title="Done"        column="done"        onDelete={removeTask} />
        </div>
      </DndContext>
    </div>
  );
}
