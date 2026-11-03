import { expect, test, type Page } from "@playwright/test";
const route = "/o/demo/p/payment/settings?design=current&section=workflow";
const designer = (page: Page) =>
  page.getByRole("region", { name: "Workflow designer" });

test("canvas is open, readable and all original transitions survive arranging and reload", async ({
  page,
}) => {
  await page.goto(route);
  const d = designer(page);
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("30");
  await expect(d.locator(".wfd-inspector")).toHaveCount(0);
  await expect(d.locator(".wfd-node")).toHaveCount(6);
  const before = await d
    .locator(".wfd-node-wrap")
    .first()
    .getAttribute("style");
  await d.getByRole("button", { name: "Arrange layout" }).click();
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("30");
  await expect(d.getByRole("status")).toContainText(
    "All original transitions and rules are unchanged",
  );
  await expect(d.locator(".wfd-node-wrap")).toHaveCount(6);
  await expect(d.locator(".wfd-node-wrap").first()).toHaveAttribute(
    "style",
    before!,
  );
  await page.reload();
  await expect(
    designer(page).getByTestId("workflow-transition-count"),
  ).toHaveText("30");
  await page.screenshot({
    path: "docs/screenshots/workflow-redesign-canvas.png",
    fullPage: true,
  });
  await designer(page)
    .getByRole("button", { name: "Large view", exact: true })
    .click();
  const fills=await designer(page).locator('.wfd-path > path:not(.wfd-hit)').evaluateAll(paths=>paths.map(path=>getComputedStyle(path).fill));
  expect(fills.length).toBeGreaterThan(0);
  expect(fills.every(fill=>fill==='none')).toBe(true);
  await page.screenshot({
    path: "docs/screenshots/workflow-redesign-large.png",
  });
  await designer(page).getByRole('button',{name:'All statuses to backlog',exact:true}).click();
  await designer(page).locator('.wfd-transition-list').getByText('in progress → backlog',{exact:true}).click();
  await expect(designer(page).locator('.wfd-edge-label.selected')).toHaveText('in progress → backlog');
});

test("a dragged connection handle creates an explicit transition without toggling other edges", async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole("button", { name: "Create draft", exact: true }).click();
  const d = designer(page);
  await d
    .getByRole("button", { name: "Show every individual transition" })
    .click();
  await d.locator('[data-transition-id="backlog->todo"]').click();
  await d.getByText("Remove this transition", { exact: true }).click();
  await d.getByRole("button", { name: "Confirm removal" }).click();
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("29");
  const handle = d.getByRole("button", {
      name: "Connect from backlog",
      exact: true,
    }),
    target = d.getByRole("button", { name: "Status: todo", exact: true });
  const a = await handle.boundingBox(),
    b = await target.boundingBox();
  await page.mouse.move(a!.x + a!.width / 2, a!.y + a!.height / 2);
  await page.mouse.down();
  await page.mouse.move(b!.x + b!.width / 2, b!.y + b!.height / 2, {
    steps: 10,
  });
  await page.mouse.up();
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("30");
  await expect(d.getByLabel("Action name")).toBeVisible();
  await expect(
    d.getByRole("button", { name: "Add transition", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
});

test("existing paths are selected without deletion; edits keep IDs and need explicit draft save", async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole("button", { name: "Create draft", exact: true }).click();
  const d = designer(page);
  await d.getByRole("button", { name: "Add transition", exact: true }).click();
  await d.getByRole("button", { name: "Status: todo", exact: true }).click();
  await d
    .getByRole("button", { name: "Status: in progress", exact: true })
    .click();
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("30");
  await expect(d.getByRole("status")).toContainText("nothing was removed");
  await d.getByLabel("Action name").fill("Start development");
  await d.getByLabel("Required field keys").fill("resolutionNote");
  await d.getByRole("button", { name: "Apply to draft", exact: true }).click();
  await d.getByRole("button", { name: "Close properties" }).click();
  await d
    .getByRole("button", { name: "Show every individual transition" })
    .click();
  await expect(
    d.locator('[data-transition-id="todo->in_progress"]'),
  ).toHaveText("Start development");
  await page.getByRole("button", { name: "Save draft revision" }).click();
  await expect(page.locator(".p13-notice")).toContainText(
    "Draft revision saved",
  );
  expect(
    await page.evaluate(() =>
      localStorage.getItem("empire-phase13-published-v1:payment"),
    ),
  ).toBeNull();
  await d.getByRole("button", { name: "Large view", exact: true }).click();
  await page.screenshot({
    path: "docs/screenshots/workflow-redesign-connections.png",
  });
  await page.keyboard.press("Escape");
});

test("28 transitions remain 28 through layout, save, approval, publication and reload", async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole("button", { name: "Create draft", exact: true }).click();
  const d = designer(page);
  await d
    .getByRole("button", { name: "Show every individual transition" })
    .click();
  for (const id of ["backlog->todo", "cancelled->completed"]) {
    await d.locator(`[data-transition-id="${id}"]`).click();
    await d.getByText("Remove this transition", { exact: true }).click();
    await d.getByRole("button", { name: "Confirm removal" }).click();
  }
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("28");
  const originalIds = await d
    .locator("[data-transition-id]")
    .evaluateAll((els) =>
      els.map((e) => e.getAttribute("data-transition-id")).sort(),
    );
  await d.getByRole("button", { name: "Arrange layout" }).click();
  expect(
    await d
      .locator("[data-transition-id]")
      .evaluateAll((els) =>
        els.map((e) => e.getAttribute("data-transition-id")).sort(),
      ),
  ).toEqual(originalIds);
  await page.getByRole("button", { name: "Save draft revision" }).click();
  await page
    .getByRole("button", { name: "Validate & preview migration" })
    .click();
  await page.getByRole("button", { name: "Approve current revision" }).click();
  await page.getByRole("button", { name: "Publish with receipt" }).click();
  const persisted = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("empire-phase13-published-v1:payment")!)
        .transitions,
  );
  expect(persisted).toHaveLength(28);
  expect(persisted.map((t: { id: string }) => t.id).sort()).toEqual(
    originalIds,
  );
  await page.reload();
  await expect(
    designer(page).getByTestId("workflow-transition-count"),
  ).toHaveText("28");
});

test("large view preserves selection, closes with Escape and returns keyboard focus", async ({
  page,
}) => {
  await page.goto(route);
  const d = designer(page);
  await d.getByRole("button", { name: "Status: review", exact: true }).click();
  await expect(d.getByRole("complementary")).toBeVisible();
  await d.getByRole("button", { name: "Large view", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Large workflow designer" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Status name")).toHaveValue("review");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    designer(page).getByRole("button", { name: "Large view", exact: true }),
  ).toBeFocused();
});

test("dragging and keyboard movement affect layout only and persist on reload", async ({
  page,
}) => {
  await page.goto(route);
  const d = designer(page),
    node = d.getByRole("button", { name: "Status: todo", exact: true });
  const before = await node.boundingBox();
  await node.focus();
  await node.press("Alt+ArrowRight");
  const after = await node.boundingBox();
  expect(after!.x - before!.x).toBe(20);
  await expect(d.getByTestId("workflow-transition-count")).toHaveText("30");
  await node.hover();
  await page.mouse.down();
  await page.mouse.move(after!.x + 140, after!.y + 80, { steps: 8 });
  await page.mouse.up();
  const saved = await node.boundingBox();
  expect(saved!.y).toBeGreaterThan(after!.y);
  const savedPosition = await d
    .locator(".wfd-category-todo")
    .getAttribute("style");
  await page.reload();
  const restored = await designer(page)
    .getByRole("button", { name: "Status: todo", exact: true })
    .boundingBox();
  expect(restored!.width).toBe(saved!.width);
  await expect(designer(page).locator(".wfd-category-todo")).toHaveAttribute(
    "style",
    savedPosition!,
  );
});

test("restricted policy cannot edit transitions and a new scope does not reuse selection", async ({
  page,
}) => {
  await page.goto(route);
  await page
    .getByRole("combobox", { name: "Demo policy lens" })
    .selectOption("ali-reviewer");
  const d = designer(page);
  await expect(
    d.getByRole("button", { name: "Add transition", exact: true }),
  ).toBeDisabled();
  await expect(d.locator(".wfd-port")).toHaveCount(0);
  await d.getByRole("button", { name: "Status: review", exact: true }).click();
  await expect(d.getByLabel("Status name")).toBeDisabled();
  await page.goto("/o/demo/p/empire/settings?design=current&section=workflow");
  await expect(designer(page).locator(".wfd-inspector")).toHaveCount(0);
});

test("short mobile viewport, Persian, Arabic and Dark remain usable without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await page.goto(route);
  await page.getByRole("combobox", { name: "Language" }).selectOption("fa");
  let d = page.locator(".wfd");
  await d.getByRole("button", { name: "نمای بزرگ", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await d.getByRole("button", { name: "وضعیت: todo", exact: true }).click();
  await expect(d.getByLabel("نام وضعیت")).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/workflow-redesign-mobile-fa.png",
  });
  await page.keyboard.press("Escape");
  await page.getByRole("combobox", { name: "زبان" }).selectOption("ar");
  await page.getByRole("button", { name: "تبديل المظهر" }).click();
  d = page.locator(".wfd");
  await d.getByRole("button", { name: "عرض كبير", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "docs/screenshots/workflow-redesign-mobile-ar-dark.png",
  });
});
