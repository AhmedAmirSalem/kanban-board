import type { Task } from "./types";
import { useTasksByColumn } from "./hooks/useTaskByColumn";

type Props = {
  title: string;
  column: Task["column"];
  search: string;
  onDelete: (id: string) => void;
  onMove: (id: string, to: Task["column"]) => void;
};

export default function Column({ title, column, search, onDelete, onMove }: Props) {
  const query = useTasksByColumn(column, search);
  const columns: Task["column"][] = ["backlog", "in-progress", "review", "done"];

  if (query.isLoading) return <div style={{ width: "25%", padding: 12 }}>Loading {title}...</div>;
  if (query.error) return <div style={{ width: "25%", padding: 12 }}>Error loading {title}</div>;

  return (
    <div style={{ width: "25%", padding: 12, borderRight: "1px solid #aaa" }}>
      <h3>{title}</h3>
      <ul>
        {query.data?.map(t => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            {t.title}
            <button onClick={() => onDelete(t.id)} style={{ marginLeft: 8 }}>x</button>
            <select
              value={column}
              onChange={e => onMove(t.id, e.target.value as Task["column"])}
              style={{ marginLeft: 8 }}
            >
              {columns.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
