import type { Task } from "./types";

type Props = {
  title: string;
  column: Task["column"];
  tasks: Task[];
  onDelete: (id: string) => void;
  onMove: (id: string, to: Task["column"]) => void;
};

export default function Column({ title, column, tasks, onDelete, onMove }: Props) {
  const options: Task["column"][] = ["backlog", "in-progress", "review", "done"];

  return (
    <div style={{ width: "25%", padding: 12, borderRight: "1px solid #aaa" }}>
      <h3>{title}</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            {t.title}{" "}
            <button onClick={() => onDelete(t.id)}>x</button>
            <select
              value={column}
              onChange={(e) => onMove(t.id, e.target.value as Task["column"])}
            >
              {options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
