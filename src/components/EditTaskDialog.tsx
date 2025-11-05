import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import type { Task } from "../types";

type Props = {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: (patch: {
    title: string;
    description: string;
    column: Task["column"];
  }) => Promise<void>;
};

const COLUMNS: { id: Task["column"]; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

export default function EditTaskDialog({ open, task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [column, setColumn] = useState<Task["column"]>(task.column);
  const [busy, setBusy] = useState(false);

  // reset when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setColumn(task.column);
  }, [task]);

  const disabled = useMemo(() => !title.trim() || busy, [title, busy]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setBusy(true);
    await onSave({
      title: title.trim(),
      description: description.trim(),
      column,
    });
    setBusy(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            <TextField
              select
              label="Column"
              value={column}
              onChange={(e) => setColumn(e.target.value as Task["column"])}
              fullWidth
            >
              {COLUMNS.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={busy} variant="text">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={disabled}
          >
            {busy ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
