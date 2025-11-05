import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Paper, Typography, Stack, Box } from "@mui/material";
import TaskCard from "./TaskCard";
import { useTasksByColumn } from "../hooks/useTasksByColumn";
import type { Task } from "../types";

type Props = { title: string; column: Task["column"]; search: string };

// adjust once if your top bar gets taller/shorter
const BOARD_PADDING = 32; // container py spacing
const TOOLBAR_HEIGHT = 72; // search + button stack height area
const VERTICAL_GAP = 16; // grid gap between rows

export default function Column({ title, column, search }: Props) {
  const query = useTasksByColumn(column, search);

  // droppable should be the SCROLLABLE area, not the whole paper
  const { setNodeRef, isOver } = useDroppable({
    id: column,
    data: { type: "column" },
  });

  const ids = (query.data ?? []).map((t) => t.id);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        // viewport-based height with room for toolbar + margins
        height: `calc(100vh - ${
          BOARD_PADDING * 2 + TOOLBAR_HEIGHT + VERTICAL_GAP
        }px)`,
        overflow: "hidden",
        bgcolor: isOver ? "grey.50" : "background.paper",
      }}
    >
      {/* sticky header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      {/* scrollable list */}
      <Box
        ref={setNodeRef}
        sx={{
          overflowY: "auto",
          px: 2,
          py: 2,
        }}
      >
        <SortableContext
          id={column}
          items={ids}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={2}>
            {query.data?.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </Stack>
        </SortableContext>
      </Box>
    </Paper>
  );
}
