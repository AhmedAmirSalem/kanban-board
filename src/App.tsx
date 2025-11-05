import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // v2 with `size={{}}`
import { DndContext, closestCenter } from "@dnd-kit/core";

import SearchBar from "./components/SearchBar";
import AddTaskDialog from "./components/AddTaskDialog";
import Column from "./components/Column";

import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useTaskSort } from "./hooks/useTaskSort";
import { useCreateTask } from "./hooks/useCreateTask";

export default function App() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const { sensors, onDragEnd } = useTaskSort(debounced);

  const [open, setOpen] = useState(false);
  const create = useCreateTask();

  async function handleCreate(input: {
    title: string;
    description: string;
    column: any;
  }) {
    await create.mutateAsync(input);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <SearchBar
          search={search}
          onSearch={setSearch}
          onOpenCreate={() => setOpen(true)}
          creating={create.isPending}
        />
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Column title="Backlog" column="backlog" search={debounced} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Column
              title="In Progress"
              column="in-progress"
              search={debounced}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Column title="Review" column="review" search={debounced} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Column title="Done" column="done" search={debounced} />
          </Grid>
        </Grid>
      </DndContext>

      <AddTaskDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </Container>
  );
}
