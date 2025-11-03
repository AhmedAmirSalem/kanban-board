import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "./api";
import type { Task } from "./types";

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

  return (
    <div style={{ padding: 24 }}>
      <h2>Tasks</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="task title"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title}
            <button onClick={() => removeTask(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
