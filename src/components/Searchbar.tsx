import { TextField, InputAdornment, Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  search: string;
  onSearch(v: string): void;
  onAdd(): void;
  adding?: boolean;
};

export default function SearchBar({ search, onSearch, onAdd, adding }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <TextField
        fullWidth
        placeholder="Search by task title or description"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        disableElevation
        onClick={onAdd}
        disabled={adding}
        sx={{ px: 3, borderRadius: 2 }}
      >
        {adding ? "Adding…" : "Add Task"}
      </Button>
    </Stack>
  );
}
