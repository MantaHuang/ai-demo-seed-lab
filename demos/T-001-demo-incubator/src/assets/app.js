const generator = document.querySelector("[data-generator]");
const body = document.body;

function track(path) {
  try {
    window.goatcounter?.count?.({ path, title: path, event: true });
  } catch {
    // Analytics is progressive enhancement only.
  }
}

function setupAnalytics() {
  const code = body.dataset.goatcounterCode?.trim();
  if (!code) return;
  const script = document.createElement("script");
  script.async = true;
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  script.src = "https://gc.zgo.at/count.js";
  document.head.append(script);
}

function sample(items) {
  const sequence = window.__ideaRandomSequence;
  const raw = Array.isArray(sequence) && sequence.length ? sequence.shift() : Math.random();
  return items[Math.min(items.length - 1, Math.floor(Math.max(0, raw) * items.length))];
}

function fillTemplate(template, values) {
  return template.replace(/\{(direction|audience|form)\.name\}/g, (_, key) => values[key].name);
}

async function setupGenerator() {
  if (!generator) return;
  const response = await fetch(generator.dataset.ideasUrl);
  const ideas = await response.json();
  const active = (items) => items.filter((item) => !item.deprecated);
  const directions = active(ideas.directions);
  const audiences = active(ideas.audiences);
  const forms = active(ideas.forms);
  const directionSelect = generator.querySelector("[data-direction]");
  const result = generator.querySelector("[data-result]");
  const copyFallback = generator.querySelector("[data-copy-fallback]");
  const copyStatus = generator.querySelector("[data-copy-status]");
  let previousId = "";
  let currentText = "";

  for (const direction of directions) {
    const option = document.createElement("option");
    option.value = direction.slug;
    option.textContent = direction.name;
    directionSelect.append(option);
  }
  generator.querySelector("[data-shake]").disabled = false;

  function makeIdea() {
    let idea;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const selectedDirection = directions.find((item) => item.slug === directionSelect.value) || sample(directions);
      const audience = sample(audiences);
      const form = sample(forms);
      const id = `IDEA-${selectedDirection.slug}-${audience.slug}-${form.slug}`;
      idea = { id, direction: selectedDirection, audience, form };
      if (id !== previousId) break;
    }
    previousId = idea.id;
    idea.sentence = fillTemplate(ideas.idea_template, idea);
    return idea;
  }

  function renderIdea(eventName) {
    const idea = makeIdea();
    generator.querySelector("[data-idea-id]").textContent = idea.id;
    for (const key of ["direction", "audience", "form"]) {
      generator.querySelector(`[data-field="${key}"]`).textContent = idea[key].name;
    }
    generator.querySelector('[data-field="sentence"]').textContent = idea.sentence;
    generator.querySelector("[data-hints]").innerHTML = [idea.direction, idea.audience, idea.form]
      .map((item) => `<p><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.hint)}</span></p>`)
      .join("");
    currentText = `${idea.id}\n方向：${idea.direction.name}\n人群：${idea.audience.name}\n形态：${idea.form.name}\n${idea.sentence}`;
    copyFallback.value = currentText;
    copyFallback.hidden = true;
    copyStatus.textContent = "";
    result.hidden = false;
    track(eventName);
  }

  generator.querySelector("[data-shake]").addEventListener("click", () => renderIdea("shake"));
  generator.querySelector("[data-reshake]").addEventListener("click", () => renderIdea("reshake"));
  generator.querySelector("[data-copy]").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(currentText);
      copyStatus.textContent = "已复制到剪贴板";
    } catch {
      copyFallback.hidden = false;
      copyFallback.select();
      copyStatus.textContent = "剪贴板不可用，请复制已选中的文本";
    }
    track("copy-idea");
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll('[data-event="generator-open"]').forEach((element) => {
  element.addEventListener("click", () => track("generator-open"));
});
document.querySelectorAll("[data-demo-link]").forEach((element) => {
  element.addEventListener("click", () => track("demo-link-click"));
});

setupAnalytics();
setupGenerator().catch(() => {
  if (generator) generator.querySelector(".generator-tool").textContent = "灵感词库暂时无法加载，请稍后重试。";
});
