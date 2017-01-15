/* @flow */
"use strict"

const hasBlock = require("./hasBlock")
const isSharedLineComment = require("./isSharedLineComment")

module.exports = function (atRule/*: postcss$atRule*/)/*: boolean*/ {
  if (atRule.type !== "atrule") {
    return false
  }

  let previousNode = atRule.prev()
  if (previousNode === undefined) {
    return false
  }

  if (isSharedLineComment(previousNode)) {
    previousNode = previousNode.prev()
  }
  if (previousNode === undefined) {
    return false
  }

  return previousNode.type === "atrule"
    && !hasBlock(previousNode)
    && !hasBlock(atRule)
}
