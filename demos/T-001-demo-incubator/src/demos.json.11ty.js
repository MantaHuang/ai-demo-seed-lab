export default class {
  data() {
    return { permalink: "demos.json", eleventyExcludeFromCollections: true };
  }

  render({ catalog }) {
    return JSON.stringify(catalog, null, 2);
  }
}
