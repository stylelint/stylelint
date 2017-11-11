/* @flow */
"use strict";
const _ = require("lodash");
const augmentConfig = require("./augmentConfig");
const cosmiconfig = require("cosmiconfig");
const createStylelintResult = require("./createStylelintResult");
const getConfigForFile = require("./getConfigForFile");
const getPostcssResult = require("./getPostcssResult");
const isPathIgnored = require("./isPathIgnored");
const lintSource = require("./lintSource");
const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

const DEFAULT_IGNORE_FILENAME = ".stylelintignore";
const FILE_NOT_FOUND_ERROR_CODE = "ENOENT";

// The stylelint "internal API" is passed among functions
// so that methods on a stylelint instance can invoke
// each other while sharing options and caches
module.exports = function(
  options /*: stylelint$options*/
) /*: stylelint$internalApi*/ {
  options = options || {};
  const stylelint /*: Object*/ = { _options: options };

  // The ignorer will be used to filter file paths after the glob is checked,
  // before any files are actually read
  const ignoreFilePath = options.ignorePath || DEFAULT_IGNORE_FILENAME;
  const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
    ? ignoreFilePath
    : path.resolve(process.cwd(), ignoreFilePath);
  let ignoreText = "";
  try {
    ignoreText = fs.readFileSync(absoluteIgnoreFilePath, "utf8");
  } catch (readError) {
    if (readError.code !== FILE_NOT_FOUND_ERROR_CODE) throw readError;
  }
  const ignorePattern = options.ignorePattern || [];
  stylelint.ignorer = ignore()
    .add(ignoreText)
    .add(options.ignoreFiles)
    .add(ignorePattern);

  // Two separate explorers so they can each have their own transform
  // function whose results are cached by cosmiconfig
  stylelint._fullExplorer = cosmiconfig("stylelint", {
    argv: false,
    rcExtensions: true,
    transform: _.partial(augmentConfig.augmentConfigFull, stylelint)
  });
  stylelint._extendExplorer = cosmiconfig(null, {
    argv: false,
    transform: _.partial(augmentConfig.augmentConfigExtended, stylelint)
  });

  stylelint._specifiedConfigCache = new Map();
  stylelint._postcssResultCache = new Map();
  stylelint._createStylelintResult = _.partial(
    createStylelintResult,
    stylelint
  );
  stylelint._getPostcssResult = _.partial(getPostcssResult, stylelint);
  stylelint._lintSource = _.partial(lintSource, stylelint);

  stylelint.getConfigForFile = _.partial(getConfigForFile, stylelint);
  stylelint.isPathIgnored = _.partial(isPathIgnored, stylelint);

  return stylelint;
};
