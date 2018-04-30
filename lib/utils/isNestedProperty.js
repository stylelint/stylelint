/* @flow */
"use strict";

const _ = require("lodash");
const hasBlock = require("../utils/hasBlock");

/**
 * Check whether a Node is a nested property
 */
module.exports = function(node /*: Object*/) /*: boolean*/ {
  const selector = _.get(node, "raws.selector.raw", node.selector);

  return node.type === "rule" && hasBlock(node) && selector.slice(-1) === ":";
};
