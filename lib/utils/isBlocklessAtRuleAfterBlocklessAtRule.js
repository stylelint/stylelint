/* @flow */
"use strict"

const hasBlock = require("./hasBlock")
const getPreviousNonSharedLineCommentNode = require("./getPreviousNonSharedLineCommentNode")

module.exports = function (atRule/*: postcss$atRule*/)/*: boolean*/ {
  if (atRule.type !== "atrule") {
    return false
  }

  const previousNode = getPreviousNonSharedLineCommentNode(atRule)
  if (previousNode === undefined) {
    return false
  }

  return previousNode.type === "atrule"
    && !hasBlock(previousNode)
    && !hasBlock(atRule)
}
