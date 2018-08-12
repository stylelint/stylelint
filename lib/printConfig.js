/* @flow */
"use strict";

const _ = require("lodash");
const createStylelint = require("./createStylelint");
const path = require("path");

module.exports = function(
  options /*: stylelint$standaloneOptions */
) /*: Promise<stylelint$config>*/ {
  const code = options.code;
  const config = options.config;
  const configBasedir = options.configBasedir;
  const configFile = options.configFile;
  const configOverrides = options.configOverrides;
  const globbyOptions = options.globbyOptions;
  const files = options.files;

  const isCodeNotFile = code !== undefined;
  if (isCodeNotFile) {
    throw new Error(
      "The --print-config option is not available for piped-in code."
    );
  }

  if (!files || files.length !== 1) {
    throw new Error(
      "The --print-config option must be used with exactly one file path."
    );
  }

  const stylelint = createStylelint({
    config,
    configFile,
    configBasedir,
    configOverrides
  });

  const filePath = files[0];
  const cwd = _.get(globbyOptions, "cwd", process.cwd());
  const absoluteFilePath = !path.isAbsolute(filePath)
    ? path.join(cwd, filePath)
    : path.normalize(filePath);

  const configSearchPath = stylelint._options.configFile || absoluteFilePath;

  return stylelint
    .getConfigForFile(configSearchPath)
    .then(result => result.config);
};
