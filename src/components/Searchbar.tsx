import { TextField, InputAdornment, Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  search: string;
  onSearch(v: string): void;
  onOpenCreate(): void;
  creating?: boolean;
};

export default function SearchBar({
  search,
  onSearch,
  onOpenCreate,
  creating,
}: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        fullWidth
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by task title or description"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 3 },
        }}
      />
      <Button
        variant="contained"
        disableElevation
        onClick={onOpenCreate}
        disabled={creating}
        sx={{ px: 3, borderRadius: 3 }}
      >
        {creating ? "Adding…" : "Add Task"}
      </Button>
    </Stack>
  );
}
