import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, updateTask } from "./api";
import type { Task } from "./types";
import Column from "./Column";
import SearchBar from "./components/Searchbar";
import { useDebounce } from "./hooks/useDebounce";

export default function App() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 350);

  async function addTask() {
    if (!title.trim()) return;
    await createTask({ title, description: "", column: "backlog" });
    setTitle("");
    // new items appear in backlog; invalidate that column with current search
    qc.invalidateQueries({ queryKey: ["tasks", "backlog", debounced] });
  }

  async function removeTask(id: string) {
    await deleteTask(id);
    // invalidate all visible columns for current search
    ["backlog", "in-progress", "review", "done"].forEach((c) =>
      qc.invalidateQueries({ queryKey: ["tasks", c, debounced] })
    );
  }

  async function moveTask(id: string, to: Task["column"]) {
    await updateTask(id, { column: to });
    // safest: invalidate all columns in view for this search
    ["backlog", "in-progress", "review", "done"].forEach((c) =>
      qc.invalidateQueries({ queryKey: ["tasks", c, debounced] })
    );
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

      <SearchBar value={search} onChange={setSearch} />

      <div style={{ display: "flex", marginTop: 12 }}>
        <Column
          title="Backlog"
          column="backlog"
          search={debounced}
          onDelete={removeTask}
          onMove={moveTask}
        />
        <Column
          title="In Progress"
          column="in-progress"
          search={debounced}
          onDelete={removeTask}
          onMove={moveTask}
        />
        <Column
          title="Review"
          column="review"
          search={debounced}
          onDelete={removeTask}
          onMove={moveTask}
        />
        <Column
          title="Done"
          column="done"
          search={debounced}
          onDelete={removeTask}
          onMove={moveTask}
        />
      </div>
    </div>
  );
}
