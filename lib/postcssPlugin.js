/* @flow */
"use strict";
const _ = require("lodash");
const createStylelint = require("./createStylelint");
const path = require("path");
const postcss = require("postcss");

module.exports = postcss.plugin("stylelint", function(options) {
  options = options || {};

  const tailoredOptions /*: Object*/ = options.rules
    ? { config: options }
    : options;
  const stylelint = createStylelint(tailoredOptions);

  return (root, result) => {
    let filePath = options.from || _.get(root, "source.input.file");
    if (filePath !== undefined && !path.isAbsolute(filePath)) {
      filePath = path.join(process.cwd(), filePath);
    }

    return stylelint._lintSource({
      filePath,
      existingPostcssResult: result
    });
  };
});
