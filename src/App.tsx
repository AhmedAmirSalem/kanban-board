import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { DndContext, closestCenter } from "@dnd-kit/core";

import SearchBar from "./components/SearchBar";
import Column from "./components/Column";

import { useDebounce } from "./hooks/useDebounce";
import { useTaskSort } from "./hooks/useTaskSort";
import { useCreateTask } from "./hooks/useCreateTask";

export default function App() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);

  const { sensors, onDragEnd } = useTaskSort(debounced);
  const create = useCreateTask();

  async function onAdd() {
    if (create.isPending) return;
    await create.mutateAsync({ title: "New task", column: "backlog" });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <SearchBar
          search={search}
          onSearch={setSearch}
          onAdd={onAdd}
          adding={create.isPending}
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
    </Container>
  );
}
