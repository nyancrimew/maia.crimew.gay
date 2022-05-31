module.exports = function (eleventyConfig) {
  const parseDate = (str) => {
    if (str instanceof Date) {
      return str;
    }
    const date = DateTime.fromISO(str, { zone: "utc" });
    return date.toJSDate();
  };

  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addFilter("date_to_datetime", (obj) => {
    const date = parseDate(obj);
    return DateTime.fromJSDate(date).toUTC().toISO();
  });

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
