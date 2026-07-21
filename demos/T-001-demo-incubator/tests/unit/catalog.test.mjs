import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import nunjucks from "nunjucks";
import { buildCatalog, loadIdeas } from "../../scripts/build-data.mjs";

const projectDir = path.resolve(import.meta.dirname, "../..");
const ideasFile = path.join(projectDir, "idea-dimensions.yaml");

async function fixtureDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), "t001-catalog-"));
}

async function writeCase(root, name, content) {
  const directory = path.join(root, name);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "case.yaml"), content, "utf8");
}

test("idea vocabulary produces 343 stable combinations", async () => {
  const { data, validIds } = await loadIdeas(ideasFile);
  assert.equal(validIds.size, 343);
  assert.equal(data.idea_template, "为「{audience.name}」做一个「{form.name}」，帮 TA 在「{direction.name}」场景里拿到一个具体的结果。");
});

test("S5 dirty YAML degrades without aborting and missing fields use placeholders", async () => {
  const root = await fixtureDir();
  await writeCase(root, "broken", "title: [not closed");
  await writeCase(root, "missing", "id: T-900\nslug: missing\nstatus: idea\n");

  const { cards, warnings } = await buildCatalog({ demosDir: root });
  assert.equal(cards.length, 1);
  assert.equal(cards[0].title, "未填写");
  assert.ok(warnings.some((item) => item.startsWith("YAML_PARSE_ERROR") && item.includes("broken")));
  assert.ok(warnings.some((item) => item.startsWith("MISSING_REQUIRED_FIELD") && item.includes("title")));
});

test("S6 a compliant directory appears without frontend changes", async () => {
  const root = await fixtureDir();
  await writeCase(root, "new-demo", `id: T-901
slug: newdemo
title: 新 Demo
author: Tester
status: building
goal: 解决一个真实问题。
links:
  repo: https://example.com/repo
`);
  const { cards } = await buildCatalog({ demosDir: root });
  assert.equal(cards.length, 1);
  assert.equal(cards[0].id, "T-901");
  assert.equal(cards[0].tagline, "解决一个真实问题。");
});

test("S9 origin idea is retained and rendered by the production card template", async () => {
  const { validIds } = await loadIdeas(ideasFile);
  const root = await fixtureDir();
  await writeCase(root, "origin-demo", `id: T-902
slug: origindemo
title: 灵感作品
author: Tester
status: showcase
goal: 从灵感长出的作品。
origin_idea: IDEA-product-community-tool
`);
  const { cards, warnings } = await buildCatalog({ demosDir: root, validIdeaIds: validIds });
  assert.equal(warnings.length, 0);
  const environment = nunjucks.configure(path.join(projectDir, "src", "_includes"), { autoescape: true });
  environment.addFilter("statusLabel", (status) => status);
  const html = environment.render("demo-card.njk", { demo: cards[0] });
  assert.match(html, /源自灵感 #IDEA-product-community-tool/);
});
