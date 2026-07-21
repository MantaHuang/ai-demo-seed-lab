const normalizePrefix = (value) => {
  if (!value || value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
};

export default function (eleventyConfig) {
  const pathPrefix = normalizePrefix(process.env.ELEVENTY_PATH_PREFIX);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("idea-dimensions.yaml");
  eleventyConfig.addWatchTarget("../*/case.yaml");
  eleventyConfig.addGlobalData("site", {
    pathPrefix,
    goatcounterCode: process.env.GOATCOUNTER_CODE || ""
  });
  eleventyConfig.addFilter("assetUrl", (path) => {
    const clean = String(path).replace(/^\/+/, "");
    return `${pathPrefix}${clean}`;
  });
  eleventyConfig.addFilter("statusLabel", (status) => ({
    idea: "想法",
    qualified: "已筛选",
    planned: "已规划",
    building: "开发中",
    review: "验收中",
    showcase: "可展示",
    archived: "已归档"
  })[status] || status);

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    pathPrefix
  };
}
