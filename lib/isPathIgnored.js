/* @flow */
"use strict";

const filterFilePaths = require("./utils/filterFilePaths");
const getFileIgnorer = require("./utils/getFileIgnorer");
const micromatch = require("micromatch");
const path = require("path");
const slash = require("slash");

// To find out if a path is ignored, we need to load the config,
// which may have an ignoreFiles property. We then check the path
// against these.
module.exports = function(
  stylelint /*: stylelint$internalApi*/,
  filePathArg /*:: ?: string*/
) /*: Promise<boolean>*/ {
  const filePath = filePathArg; // to please Flow

  if (!filePath) {
    return Promise.resolve(false);
  }

  const cwd = process.cwd();
  const ignorer = getFileIgnorer(stylelint._options);

  return stylelint.getConfigForFile(filePath).then(result => {
    // Glob patterns for micromatch should be in POSIX-style
    const ignoreFiles = (result.config.ignoreFiles || []).map(slash);

    const absoluteFilePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    if (micromatch(absoluteFilePath, ignoreFiles).length) {
      return true;
    }

    // Check filePath with .stylelintignore file
    if (
      filterFilePaths(ignorer, [path.relative(cwd, absoluteFilePath)])
        .length === 0
    ) {
      return true;
    }

    return false;
  });
};
