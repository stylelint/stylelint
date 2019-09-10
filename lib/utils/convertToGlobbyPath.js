"use strict";

const isWin = process.platform === "win32";

/**
 * Convert file path to globby paths
 * If you want escape any symbol use double backslashes, this way we can correctly support windows-like paths
 * @param {string} path
 * @return {string} result of conversion
 */
module.exports = function convertToGlobbyPath(path) {
  if (!isWin) {
    return path.replace(/\\\\/g, "\\");
  }

  return path.replace(/\\/g, "/").replace(/\/\//g, "\\");
};
