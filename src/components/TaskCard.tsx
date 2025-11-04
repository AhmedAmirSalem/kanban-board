import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  const lockRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (lockRef.current || busy || del.isPending) return;
    lockRef.current = true;
    setBusy(true);
    setRemoved(true);
    try {
      await del.mutateAsync(task.id);
    } catch {
      lockRef.current = false;
      setBusy(false);
      setRemoved(false);
    }
  }

  if (removed) return null;

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "grab",
        opacity: isDragging ? 0.7 : 1,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <CardContent sx={{ pb: "12px !important" }}>
        <Typography fontWeight={700} mb={0.5}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" aria-label="edit" disabled>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="delete"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onDelete}
            disabled={busy || del.isPending}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
