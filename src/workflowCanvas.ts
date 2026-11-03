import type { AdminConfig, WorkflowTransition } from "./phase13Domain";

export interface CanvasPoint {
  x: number;
  y: number;
}
export type WorkflowPositions = Record<string, CanvasPoint>;
export const NODE_WIDTH = 184;
export const NODE_HEIGHT = 48;

/** Presentation only. Never normalizes, deletes or recreates domain transitions. */
export function arrangeWorkflow(
  statuses: AdminConfig["statuses"],
): WorkflowPositions {
  return Object.fromEntries(
    statuses.map((status, index) => [
      status.id,
      {
        x: 100 + Math.min(index, 4) * 235,
        y: 100 + index * 106,
      },
    ]),
  );
}

export function readWorkflowPositions(
  raw: string | null,
  statuses: AdminConfig["statuses"],
): WorkflowPositions {
  const positions = arrangeWorkflow(statuses);
  try {
    const saved = JSON.parse(raw ?? "null");
    for (const status of statuses) {
      const point = saved?.[status.id];
      if (
        Number.isFinite(point?.x) &&
        Number.isFinite(point?.y) &&
        point.x >= 24 &&
        point.y >= 48 &&
        point.x < 8000 &&
        point.y < 8000
      )
        positions[status.id] = { x: point.x, y: point.y };
    }
  } catch {
    /* A layout preference cannot replace or corrupt the workflow. */
  }
  return positions;
}

/** Jira-style shorthand is allowed only for an exact, equivalent incoming set. */
export function universalIncoming(
  config: Pick<AdminConfig, "statuses" | "transitions">,
) {
  const groups = new Map<string, WorkflowTransition[]>();
  for (const status of config.statuses) {
    const incoming = config.transitions.filter((t) => t.to === status.id);
    const sources = config.statuses
      .filter((s) => s.id !== status.id)
      .map((s) => s.id);
    if (sources.length < 2 || incoming.length !== sources.length) continue;
    if (
      !sources.every((id) => incoming.filter((t) => t.from === id).length === 1)
    )
      continue;
    const first = incoming[0];
    // Unknown properties are significant too; do not group distinct rules away.
    const rules = (t: WorkflowTransition) =>
      JSON.stringify(
        Object.fromEntries(
          Object.entries(t)
            .filter(([key]) => !["id", "from", "to"].includes(key))
            .sort(([a], [b]) => a.localeCompare(b)),
        ),
      );
    if (incoming.every((t) => rules(t) === rules(first)))
      groups.set(status.id, incoming);
  }
  return groups;
}

export function transitionCaption(
  transition: WorkflowTransition,
  statuses: AdminConfig["statuses"],
) {
  return (
    transition.name?.trim() ||
    `${statuses.find((s) => s.id === transition.from)?.label ?? transition.from} → ${statuses.find((s) => s.id === transition.to)?.label ?? transition.to}`
  );
}

export function routeTransition(
  from: CanvasPoint,
  to: CanvasPoint,
  lane: number,
): { path: string; label: CanvasPoint } {
  const sx = from.x + NODE_WIDTH / 2,
    sy = from.y + NODE_HEIGHT,
    tx = to.x + NODE_WIDTH / 2,
    ty = to.y;
  if (to.y > from.y + NODE_HEIGHT + 22 && to.x === from.x) {
    return {
      path: `M ${sx} ${sy} V ${ty}`,
      label: { x: sx + 90, y: (sy + ty) / 2 },
    };
  }
  if (to.y > from.y + NODE_HEIGHT + 22 && to.x > from.x) {
    const mid = from.y + NODE_HEIGHT + 29 + (lane % 3) * 7;
    return {
      path: `M ${sx} ${sy} V ${mid - 6} Q ${sx} ${mid} ${sx + 6} ${mid} H ${tx - 6} Q ${tx} ${mid} ${tx} ${mid + 6} V ${ty}`,
      label: { x: (sx + tx) / 2, y: mid - 12 },
    };
  }
  const right = Math.max(from.x, to.x) + NODE_WIDTH + 55 + lane * 27;
  const exit = from.y + NODE_HEIGHT / 2,
    entry = to.y + NODE_HEIGHT / 2;
  return {
    path: `M ${from.x + NODE_WIDTH} ${exit} H ${right - 7} Q ${right} ${exit} ${right} ${exit + (entry > exit ? 7 : -7)} V ${entry + (entry > exit ? -7 : 7)} Q ${right} ${entry} ${right - 7} ${entry} H ${to.x + NODE_WIDTH}`,
    label: { x: right + 10, y: (exit + entry) / 2 },
  };
}
