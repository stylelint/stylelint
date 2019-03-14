/* @flow */
"use strict";

/**
 * Check whether a combinator is standard
 *
 * @param {Node} postcss-selector-parser node (of type combinator)
 * @return {boolean} If `true`, the combinator is standard
 */

module.exports = function(node /*: Object*/) /*: boolean*/ {
  // Ghost descendant combinators around reference combinators like `/deep/`
  // postcss-selector-parser parsers references combinators as tag selectors surrounded
  // by descendant combinators
  return (
    node.type === "combinator" &&
    !node.value.startsWith("/") &&
    !node.value.endsWith("/")
  );
};
