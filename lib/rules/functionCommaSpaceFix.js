"use strict";

module.exports = function(
  div,
  index,
  nodes,
  expectation,
  symbolAfter,
  symbolBefore
) {
  if (expectation.indexOf("always") === 0) {
    if (symbolAfter) {
      div.after = symbolAfter;
    }

    if (symbolBefore) {
      div.before = symbolBefore;
    }

    return true;
  } else if (expectation.indexOf("never") === 0) {
    if (symbolAfter) {
      div.after = "";
    }

    if (symbolBefore) {
      div.before = "";
    }

    for (let i = index + 1; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type === "comment") {
        continue;
      }

      if (node.type === "space") {
        node.value = "";
        continue;
      }

      break;
    }

    return true;
  }
};
