/* @flow */
"use strict";

const fs = require("fs");
const path = require("path");
const pify = require("pify");
const stripAnsi = require("strip-ansi");

module.exports = (content /*: string*/, filePath /*: string*/) =>
  pify(fs.writeFileSync)(path.normalize(filePath), stripAnsi(content));
