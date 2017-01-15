/* @flow */
"use strict"

const _ = require("lodash")
const isBlocklessAtRuleAfterBlocklessAtRule = require("./isBlocklessAtRuleAfterBlocklessAtRule")
const isSharedLineComment = require("./isSharedLineComment")

module.exports = function (atRule/*: postcss$atRule*/)/*: boolean*/ {
  if (!isBlocklessAtRuleAfterBlocklessAtRule(atRule)) {
    return false
  }

  let previousNode = atRule.prev()
  if (previousNode === undefined) {
    return false
  }

  if (isSharedLineComment(previousNode)) {
    previousNode = previousNode.prev()
  }

  return _.get(previousNode, "name") == atRule.name
}
