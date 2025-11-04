import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Paper, Typography, Stack, Divider } from "@mui/material";
import TaskCard from "./TaskCard";
import { useTasksByColumn } from "../hooks/useTasksByColumn";
import type { Task } from "../types";

type Props = { title: string; column: Task["column"]; search: string };

export default function Column({ title, column, search }: Props) {
  const query = useTasksByColumn(column, search);
  const { setNodeRef, isOver } = useDroppable({
    id: column,
    data: { type: "column" },
  });

  const ids = (query.data ?? []).map((t) => t.id);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: isOver ? "grey.50" : "background.paper",
      }}
      ref={setNodeRef}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        {title}
      </Typography>

      <SortableContext
        id={column}
        items={ids}
        strategy={verticalListSortingStrategy}
      >
        <Stack
          spacing={2}
          divider={<Divider flexItem sx={{ display: "none" }} />}
        >
          {query.data?.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  );
}
