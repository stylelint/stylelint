/* @flow */
"use strict"

const _ = require("lodash")
const isBlocklessAtRuleAfterBlocklessAtRule = require("./isBlocklessAtRuleAfterBlocklessAtRule")
const getPreviousNonSharedLineCommentNode = require("./getPreviousNonSharedLineCommentNode")

module.exports = function (atRule/*: postcss$atRule*/)/*: boolean*/ {
  if (!isBlocklessAtRuleAfterBlocklessAtRule(atRule)) {
    return false
  }

  const previousNode = getPreviousNonSharedLineCommentNode(atRule)

  return _.get(previousNode, "name") === atRule.name
}
