export default class {
  data() {
    return { permalink: "ideas.json", eleventyExcludeFromCollections: true };
  }

  render({ ideas }) {
    return JSON.stringify(ideas, null, 2);
  }
}
