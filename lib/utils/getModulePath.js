/* @flow */
"use strict";

const configurationError = require("./configurationError");
const resolve = require("path").resolve;
const resolveFrom = require("resolve-from");

const GLOBAL_NODE_MODULES = resolve(__dirname, "../../../../node_modules/");

module.exports = function getModulePath(
  basedir /*: string*/,
  lookup /*: string*/
) /*: string*/ {
  // 1. Try to resolve from the provided directory
  // 2. Try to resolve from `process.cwd`
  // 3. Try to resolve from global `node_modules` directory
  let path = resolveFrom.silent(basedir, lookup);
  if (!path) {
    path = resolveFrom.silent(process.cwd(), lookup);
  }
  if (!path) {
    path = resolveFrom.silent(GLOBAL_NODE_MODULES, lookup);
  }
  if (!path) {
    throw configurationError(
      `Could not find "${lookup}". Do you need a \`configBasedir\`?`
    );
  }
  return path;
};
