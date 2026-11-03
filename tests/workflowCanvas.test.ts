import { describe, it, expect } from "vitest";
import {
  arrangeWorkflow,
  readWorkflowPositions,
  routeTransition,
  universalIncoming,
  transitionCaption,
} from "../src/workflowCanvas";
import type { AdminConfig, WorkflowTransition } from "../src/phase13Domain";

const statuses: AdminConfig["statuses"] = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "completed",
  "cancelled",
].map((id) => ({
  id: id as AdminConfig["statuses"][number]["id"],
  label: id.replaceAll("_", " "),
}));
const transitions: WorkflowTransition[] = statuses.flatMap((a) =>
  statuses
    .filter((b) => a.id !== b.id)
    .map((b) => ({
      id: `${a.id}->${b.id}`,
      from: a.id,
      to: b.id,
      requiredFields: [],
    })),
);
describe("Workflow canvas presentation preserves the domain graph", () => {
  it("arranges every status without mutating a 28-transition graph or its rule objects", () => {
    const graph = {
      statuses: structuredClone(statuses),
      transitions: structuredClone(transitions.slice(2)),
    };
    graph.transitions[4].requiredFields = ["resolutionNote"];
    const before = JSON.stringify(graph),
      positions = arrangeWorkflow(graph.statuses);
    const groups = universalIncoming(graph),
      grouped = [...groups.values()].flat();
    const individuallyDrawn = graph.transitions.filter(
      (t) => !grouped.some((g) => g.id === t.id),
    );
    expect([...individuallyDrawn, ...grouped].map((t) => t.id).sort()).toEqual(
      graph.transitions.map((t) => t.id).sort(),
    );
    expect(
      new Set([...individuallyDrawn, ...grouped].map((t) => t.id)).size,
    ).toBe(28);
    expect(JSON.stringify(graph)).toBe(before);
    expect(Object.keys(positions)).toHaveLength(6);
  });
  it("represents complete equivalent sets with exact original references", () => {
    const groups = universalIncoming({ statuses, transitions });
    expect(groups.size).toBe(6);
    expect([...groups.values()].flat()).toHaveLength(30);
    expect(
      groups
        .get("completed")
        ?.map((t) => t.from)
        .sort(),
    ).toEqual(["backlog", "todo", "in_progress", "review", "cancelled"].sort());
    expect(groups.get("completed")?.[0]).toBe(
      transitions.find((t) => t.to === "completed"),
    );
  });
  it("does not hide distinct rules, parallel actions, or missing source paths", () => {
    const changed = structuredClone(transitions);
    changed.find((e) => e.to === "completed")!.requiredFields = [
      "resolutionNote",
    ];
    expect(
      universalIncoming({ statuses, transitions: changed }).has("completed"),
    ).toBe(false);
    expect(
      universalIncoming({
        statuses,
        transitions: [
          ...transitions,
          { ...transitions[0], id: "parallel", name: "Escalate" },
        ],
      }).has("todo"),
    ).toBe(false);
    expect(
      universalIncoming({
        statuses,
        transitions: transitions.filter((t) => t.id !== "review->completed"),
      }).has("completed"),
    ).toBe(false);
  });
  it("retains meaningful unknown contract fields when checking group equivalence", () => {
    const changed = structuredClone(transitions);
    Object.assign(changed.find((e) => e.to === "review")!, {
      policyRef: "independent-review",
    });
    expect(
      universalIncoming({ statuses, transitions: changed }).has("review"),
    ).toBe(false);
  });
  it("restores scoped layout coordinates and rejects corrupt or unsafe values", () => {
    const saved = readWorkflowPositions(
      JSON.stringify({
        todo: { x: 490, y: 240 },
        review: { x: Infinity, y: 0 },
        ghost: { x: 100, y: 100 },
      }),
      statuses,
    );
    expect(saved.todo).toEqual({ x: 490, y: 240 });
    expect(saved.review).toEqual(arrangeWorkflow(statuses).review);
    expect(saved).not.toHaveProperty("ghost");
    expect(readWorkflowPositions("{broken", statuses)).toEqual(
      arrangeWorkflow(statuses),
    );
  });
  it("labels named actions and supplies an honest source/destination fallback", () => {
    expect(
      transitionCaption(
        { ...transitions[0], name: "Start development" },
        statuses,
      ),
    ).toBe("Start development");
    expect(transitionCaption(transitions[0], statuses)).toBe("backlog → todo");
  });
  it("routes a return path outside both node boxes with a distinct lane", () => {
    const from = { x: 800, y: 450 },
      to = { x: 300, y: 200 };
    const a = routeTransition(from, to, 0),
      b = routeTransition(from, to, 1);
    expect(a.path).toMatch(/^M 984 474/);
    expect(a.path).toMatch(/H 484$/);
    expect(a.label.x).toBeGreaterThan(984);
    expect(a.path).not.toBe(b.path);
  });
});
