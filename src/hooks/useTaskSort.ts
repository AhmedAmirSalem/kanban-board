import { useQueryClient } from "@tanstack/react-query";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Task } from "../types";
import { updateTask } from "../api";
import { computeNewOrder } from "../lib/order";
import { isColumnId, type ColumnId, COLUMNS } from "../constants";

export function useTaskSort(search: string) {
  const qc = useQueryClient();

  // Require movement before drag starts → clicks stay clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // 6–10 is a good range
    })
  );

  async function moveAcrossColumns(id: string, to: ColumnId) {
    await updateTask(id, { column: to, order: Date.now() });
    COLUMNS.forEach((c) =>
      qc.invalidateQueries({ queryKey: ["tasks", c, search] })
    );
  }

  async function reorderWithinColumn(
    from: ColumnId,
    activeId: string,
    overId: string
  ) {
    const key = ["tasks", from, search] as const;
    const items = (qc.getQueryData<Task[]>(key) || []).slice();
    if (!items.length) return;

    const ai = items.findIndex((t) => t.id === activeId);
    const oi = items.findIndex((t) => t.id === overId);
    if (ai === -1 || oi === -1) return;

    const dropPosition = ai < oi ? "below" : "above";
    const order = computeNewOrder({ items, overId, dropPosition });

    await updateTask(activeId, { order });
    qc.invalidateQueries({ queryKey: ["tasks", from, search] });
  }

  function onDragEnd(e: DragEndEvent) {
    const activeId = String(e.active.id);
    const from = e.active.data.current?.column as ColumnId | undefined;
    const over = e.over;
    if (!from || !over) return;

    let to: ColumnId | undefined;
    const od = over.data.current as any;

    if (od?.type === "column" && isColumnId(over.id)) to = over.id;
    else if (od?.type === "task" && isColumnId(od?.sortable?.containerId))
      to = od.sortable.containerId;
    if (!to) return;

    if (to !== from) {
      void moveAcrossColumns(activeId, to);
      return;
    }
    if (!search) {
      void reorderWithinColumn(from, activeId, String(over.id));
    }
  }

  return { sensors, onDragEnd };
}
