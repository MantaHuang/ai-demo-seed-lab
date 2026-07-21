import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(currentDir, "..");
const defaultDemosDir = path.resolve(projectDir, "..");
const defaultIdeasFile = path.join(projectDir, "idea-dimensions.yaml");
const defaultOutputDir = path.join(projectDir, "src", "_data");
const allowedStatuses = new Set([
  "idea", "qualified", "planned", "building", "review", "showcase", "archived"
]);
const slugPattern = /^[a-z0-9]+$/;
const demoSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const requiredFields = ["title", "author", "tagline"];

function firstSentence(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  const match = text.match(/^.*?[。！？.!?](?:\s|$)/u);
  return (match ? match[0] : text).trim();
}

function safeUrl(value, source, field, warnings) {
  if (!value) return "";
  try {
    const url = new URL(String(value));
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("protocol");
    return url.href;
  } catch {
    warnings.push(`DANGEROUS_URL ${source} ${field}`);
    return "";
  }
}

function normalizeCard(data, source, directoryName, warnings) {
  const status = String(data.status || "idea").toLowerCase();
  if (!allowedStatuses.has(status)) warnings.push(`UNKNOWN_STATUS ${source} ${status}`);

  const slug = String(data.slug || directoryName).trim();
  if (!demoSlugPattern.test(slug)) warnings.push(`ILLEGAL_SLUG ${source} ${slug}`);

  const card = {
    id: String(data.id || directoryName),
    slug,
    title: String(data.title || "").trim(),
    author: String(data.author || "").trim(),
    tagline: String(data.tagline || firstSentence(data.goal)).trim(),
    status: allowedStatuses.has(status) ? status : "idea",
    repo_url: safeUrl(data.links?.repo, source, "links.repo", warnings),
    demo_url: safeUrl(data.links?.demo, source, "links.demo", warnings),
    issue_url: safeUrl(data.links?.issue, source, "links.issue", warnings),
    origin_idea: data.origin_idea ? String(data.origin_idea).trim() : ""
  };

  for (const field of requiredFields) {
    if (!card[field]) {
      warnings.push(`MISSING_REQUIRED_FIELD ${source} ${field}`);
      card[field] = "未填写";
    }
  }
  return card;
}

export async function loadIdeas(ideasFile = defaultIdeasFile) {
  const source = await fs.readFile(ideasFile, "utf8");
  const data = YAML.parse(source);
  const warnings = [];
  const seenSlugs = new Set();
  const dimensions = ["directions", "audiences", "forms"];

  for (const dimension of dimensions) {
    if (!Array.isArray(data[dimension]) || data[dimension].length === 0) {
      throw new Error(`IDEA_DIMENSION_EMPTY ${dimension}`);
    }
    const local = new Set();
    for (const item of data[dimension]) {
      if (!slugPattern.test(item.slug || "")) throw new Error(`IDEA_SLUG_INVALID ${dimension} ${item.slug || ""}`);
      if (local.has(item.slug)) throw new Error(`IDEA_SLUG_DUPLICATE ${dimension} ${item.slug}`);
      local.add(item.slug);
      seenSlugs.add(`${dimension}:${item.slug}`);
    }
  }

  const active = (items) => items.filter((item) => !item.deprecated);
  const ids = new Set();
  for (const direction of active(data.directions)) {
    for (const audience of active(data.audiences)) {
      for (const form of active(data.forms)) {
        const id = `IDEA-${direction.slug}-${audience.slug}-${form.slug}`.toLowerCase();
        if (ids.has(id)) throw new Error(`IDEA_ID_DUPLICATE ${id}`);
        ids.add(id);
      }
    }
  }

  return { data, validIds: ids, warnings };
}

export async function buildCatalog({ demosDir = defaultDemosDir, validIdeaIds = new Set() } = {}) {
  const entries = await fs.readdir(demosDir, { withFileTypes: true });
  const cards = [];
  const warnings = [];
  const seenIds = new Set();

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory() || entry.name === "_template") continue;
    const source = path.join(demosDir, entry.name, "case.yaml");
    try {
      const raw = await fs.readFile(source, "utf8");
      const data = YAML.parse(raw);
      const card = normalizeCard(data || {}, source, entry.name, warnings);
      if (seenIds.has(card.id.toLowerCase())) warnings.push(`DUPLICATE_DEMO_ID ${source} ${card.id}`);
      seenIds.add(card.id.toLowerCase());
      if (card.origin_idea && !validIdeaIds.has(card.origin_idea.toLowerCase())) {
        warnings.push(`UNKNOWN_ORIGIN_IDEA ${source} ${card.origin_idea}`);
      }
      cards.push(card);
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      warnings.push(`YAML_PARSE_ERROR ${source}`);
    }
  }
  return { cards, warnings };
}

export async function generateData({ demosDir, ideasFile, outputDir = defaultOutputDir } = {}) {
  const ideas = await loadIdeas(ideasFile);
  const catalog = await buildCatalog({ demosDir, validIdeaIds: ideas.validIds });
  await fs.mkdir(outputDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outputDir, "catalog.json"), `${JSON.stringify(catalog.cards, null, 2)}\n`),
    fs.writeFile(path.join(outputDir, "ideas.json"), `${JSON.stringify(ideas.data, null, 2)}\n`)
  ]);
  for (const warning of [...ideas.warnings, ...catalog.warnings]) console.warn(warning);
  return { ...catalog, ideas: ideas.data };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateData({
    demosDir: process.env.DEMOS_SOURCE_DIR,
    ideasFile: process.env.IDEAS_SOURCE_FILE
  });
}
