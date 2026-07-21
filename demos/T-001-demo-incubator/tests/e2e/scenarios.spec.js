import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const siteRoot = path.resolve(import.meta.dirname, "../../_site");
const artifactDir = path.resolve(siteRoot, "..", "artifacts");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

test.beforeEach(async ({ page }) => {
  await page.route("http://t001.local/**", async (route) => {
    const url = new URL(route.request().url());
    const relative = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
    const file = path.resolve(siteRoot, relative);
    try {
      const body = await fs.readFile(file);
      await route.fulfill({ status: 200, body, contentType: contentTypes[path.extname(file)] });
    } catch {
      await route.fulfill({ status: 404, body: "Not found" });
    }
  });
});

test("S1 first view exposes title, showcase card, and generator entry", async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 667 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("AI Demo");
    await expect(page.locator("h1")).toContainText("展示");
    await expect(page.getByRole("heading", { name: "作品墙" })).toBeVisible();
    await expect(page.locator("[data-demo-id]").first()).toBeVisible();
    await expect(page.locator(".generator-entry")).toBeVisible();
    for (const selector of ["#showcase-title", "[data-demo-id]", ".generator-entry"]) {
      const box = await page.locator(selector).first().boundingBox();
      expect(box.y).toBeLessThan(viewport.height);
    }
    await fs.mkdir(artifactDir, { recursive: true });
    await page.screenshot({
      path: path.join(artifactDir, viewport.width === 375 ? "t001-mobile.png" : "t001-desktop.png"),
      fullPage: true
    });
  }
});

test("S2 configured card links are safe and trigger navigation", async ({ page, context }) => {
  await page.goto("/");
  const links = page.locator("[data-demo-link]");
  expect(await links.count()).toBeGreaterThan(0);
  for (const href of await links.evaluateAll((nodes) => nodes.map((node) => node.href))) {
    expect(["http:", "https:"]).toContain(new URL(href).protocol);
  }
  await context.route("https://github.com/**", (route) => route.fulfill({ status: 200, body: "ok" }));
  const popupPromise = page.waitForEvent("popup");
  await page.locator('[data-demo-link="repo"]').first().click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL("https://github.com/MantaHuang/ai-demo-seed-lab");
});

test("S3 shake shows all fields and copy text contains a stable ID", async ({ page }) => {
  await page.addInitScript(() => {
    window.__copiedText = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text) => { window.__copiedText = text; } }
    });
  });
  await page.goto("/");
  await page.locator("[data-shake]").click();
  await expect(page.locator("[data-result]")).toBeVisible({ timeout: 3000 });
  for (const field of ["direction", "audience", "form", "sentence"]) {
    await expect(page.locator(`[data-field="${field}"]`)).not.toBeEmpty();
  }
  await page.locator("[data-copy]").click();
  await expect.poll(() => page.evaluate(() => window.__copiedText)).toMatch(/^IDEA-/);

  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }));
  await page.locator("[data-copy]").click();
  await expect(page.locator("[data-copy-fallback]")).toBeVisible();
  await expect(page.locator("[data-copy-fallback]")).toHaveValue(/^IDEA-/);
});

test("S4 five seeded shakes never repeat adjacent IDs", async ({ page }) => {
  await page.addInitScript(() => {
    window.__ideaRandomSequence = [0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2, 0.3, 0.3, 0.3, 0.4, 0.4, 0.4];
  });
  await page.goto("/");
  const ids = [];
  for (let index = 0; index < 5; index += 1) {
    await page.locator(index === 0 ? "[data-shake]" : "[data-reshake]").click();
    ids.push(await page.locator("[data-idea-id]").textContent());
  }
  for (let index = 1; index < ids.length; index += 1) expect(ids[index]).not.toBe(ids[index - 1]);
});

test("S7 core flow works with external requests blocked", async ({ page }) => {
  await page.route("https://**", (route) => route.abort());
  await page.goto("/");
  await page.locator("[data-shake]").click();
  await expect(page.locator("[data-result]")).toBeVisible();
  await page.locator("[data-reshake]").click();
  await expect(page.locator("[data-idea-id]")).toContainText("IDEA-");
});

test("S8 mobile layout has no horizontal overflow and controls remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.locator("[data-shake]").click();
  await expect(page.locator("[data-reshake]")).toBeVisible();
  await expect(page.locator("[data-copy]")).toBeVisible();
  for (const selector of ["[data-demo-id]", "[data-shake]", "[data-reshake]", "[data-copy]"]) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
  }
});

test("desktop generator does not create horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const generator = await page.locator(".generator").boundingBox();
  expect(generator.x).toBeGreaterThanOrEqual(0);
  expect(generator.x + generator.width).toBeLessThanOrEqual(1280);
});
