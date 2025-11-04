import { useState } from "react";
import Column from "./components/Column";
import { useDebounce } from "./hooks/useDebounce";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useTaskSort } from "./hooks/useTaskSort";
import { useCreateTask } from "./hooks/useCreateTask";

export default function App() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const { sensors, onDragEnd } = useTaskSort(debounced);

  const [title, setTitle] = useState("");
  const create = useCreateTask();

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t || create.isPending) return;
    await create.mutateAsync({ title: t, column: "backlog" });
    setTitle("");
  }

  return (
    <div className="board">
      <h2>Kanban Board</h2>

      {/* new task + search */}
      <form className="toolbar" onSubmit={addTask}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="new task title"
        />
        <button
          className="button"
          type="submit"
          disabled={create.isPending || !title.trim()}
        >
          {create.isPending ? "Adding..." : "Add to Backlog"}
        </button>

        <input
          className="input search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search title or description"
        />
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="grid">
          <Column title="Backlog" column="backlog" search={debounced} />
          <Column title="In Progress" column="in-progress" search={debounced} />
          <Column title="Review" column="review" search={debounced} />
          <Column title="Done" column="done" search={debounced} />
        </div>
      </DndContext>
    </div>
  );
}
