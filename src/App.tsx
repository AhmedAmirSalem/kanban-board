import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "./api";
import type { Task } from "./types";
import Column from "./Column";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  async function addTask() {
    if (!title.trim()) return;
    const newTask = await createTask({
      title,
      description: "",
      column: "backlog",
    });
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
  }

  async function removeTask(id: string) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function moveTask(id: string, to: Task["column"]) {
    const updated = await updateTask(id, { column: to });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  const backlog = tasks.filter((t) => t.column === "backlog");
  const inProgress = tasks.filter((t) => t.column === "in-progress");
  const review = tasks.filter((t) => t.column === "review");
  const done = tasks.filter((t) => t.column === "done");

  return (
    <div style={{ padding: 24 }}>
      <h2>Kanban Board</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="task title"
      />
      <button onClick={addTask}>Add</button>

      <div style={{ display: "flex", marginTop: 20 }}>
        <Column
          title="Backlog"
          column="backlog"
          tasks={backlog}
          onDelete={removeTask}
          onMove={moveTask}
        />
        <Column
          title="In Progress"
          column="in-progress"
          tasks={inProgress}
          onDelete={removeTask}
          onMove={moveTask}
        />
        <Column
          title="Review"
          column="review"
          tasks={review}
          onDelete={removeTask}
          onMove={moveTask}
        />
        <Column
          title="Done"
          column="done"
          tasks={done}
          onDelete={removeTask}
          onMove={moveTask}
        />
      </div>
    </div>
  );
}
