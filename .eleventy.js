const path = require("node:path");

const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const timeToRead = require('eleventy-plugin-time-to-read');
const safeLinks = require('@sardine/eleventy-plugin-external-links');
const related = require("eleventy-plugin-related");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const sass = require("sass");
const footnotes = require('eleventy-plugin-footnotes');

const figure = require('./src/_includes/components/figure.js');
const bounce = require('./src/_includes/components/bounce.js');

module.exports = function (eleventyConfig) {
  const isDev = (process.env.ELEVENTY_ENV || "dev") == "dev";

  const parseDate = (str) => {
    if (str instanceof Date) {
      return str;
    }
    return Date.parse(str);
  };

  const formatPart = (part, date) =>
  new Intl.DateTimeFormat("en", part).format(date);

  eleventyConfig.setNunjucksEnvironmentOptions({
    lstripBlocks: true,
    trimBlocks: true
  });

  const md = markdownIt({ "html": true }).use(markdownItAnchor, { "level": 2 });
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(timeToRead);
  eleventyConfig.addPlugin(safeLinks);
  eleventyConfig.addPlugin(footnotes, {
    "title": "footnotes",
    "baseClass": "footnotes"
  });

  eleventyConfig.addShortcode('figure', figure(md));
  eleventyConfig.addShortcode('bounce', bounce);

  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.addPassthroughCopy({ "node_modules/reveal.js/dist/reveal.css": "reveal.js/reveal.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/reveal.js/dist/reveal.esm.js": "reveal.js/reveal.esm.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/reveal.js/plugin/markdown/markdown.esm.js": "reveal.js/plugin/markdown/markdown.esm.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/reveal.js/plugin/highlight/highlight.esm.js": "reveal.js/plugin/highlight/highlight.esm.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/reveal.js/plugin/highlight/monokai.css": "reveal.js/plugin/highlight/monokai.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/reveal.js/plugin/notes/notes.esm.js": "reveal.js/plugin/notes/notes.esm.js" });

  eleventyConfig.addFilter("date_to_datetime", async (obj) => {
    if (!obj) {
      return "";
    }
    const date = parseDate(obj);
    return date.toISOString();
  });

  eleventyConfig.addFilter("date_formatted", async (obj) => {
    if (!obj) {
      return "";
    }
    const date = parseDate(obj);

    const month = formatPart({ month: "short" }, date);
    const day = formatPart({ day: "numeric" }, date);
    const year = formatPart({ year: "numeric" }, date);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    if (hours != 0 && minutes != 0) {
      return `${month} ${day}, ${year} - ${hours}:${minutes} UTC`;
    }

    return `${month} ${day}, ${year}`;
  });

  eleventyConfig.addFilter('urlescape', async str => {
    return str.split('/').map(part => encodeURI(part)).join('/')
  });

  // TODO: possibly turn this into a post processing step instead of a filter (or at least make it a shortcode)
  eleventyConfig.addFilter("related", async function(obj) {
    const post = this.ctx;
    const posts = this.ctx.collections.posts.map(post => post.data);

    const tagScore = (a, b) => {
      const total = a.tags.length + b.tags.length;
      const intersection = a.tags.filter(tag => b.tags.includes(tag)).length;
      return (intersection * 2) / total;
    }

    const results = related.related({
      serializer: (doc) => [doc.title, doc.description],
      weights: [10, 10],
    })(post, posts).map(result => {
      return {
        relative: result.relative + tagScore(post, result.document),
        document: result.document
      }
    });

    return results.filter(result => result.relative > 0.2).sort((a, b) => a.relative - b.relative).reverse().slice(0,3);
  });

  eleventyConfig.addCollection('posts', collection => {
    return collection.getFilteredByGlob('src/posts/*.md').reverse()
  });

  eleventyConfig.addCollection('decks', collection => {
    return collection.getFilteredByGlob('src/decks/*.md')             
    // append the raw content
    .map(item => {
      const content = item.template.frontMatter.content;
      item.data.rawMarkdown = content || "";
      return item;
    });
  });

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    
    compile: function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);

      let result = sass.compileString(inputContent, {
        style: isDev ? "expanded" : "compressed",
        loadPaths: [
          parsed.dir || "."
       ]
      });

      this.addDependencies(inputPath, result.loadedUrls);

      return async (data) => {
        return result.css;
      };
    }
  })

  return {
    templateFormats: ["njk", "md", "html"],
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "www",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: false,
  };
};
