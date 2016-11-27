const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const styleSearch = require("style-search")

export const ruleName = "media-feature-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \":\"",
  rejectedAfter: () => "Unexpected whitespace after \":\"",
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    })
    if (!validOptions) {
      return
    }

    mediaFeatureColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function mediaFeatureColonSpaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkAtRules(/^media$/i, atRule => {
    const params = atRule.params

    styleSearch({ source: params, target: ":" }, match => {
      checkColon(params, match.startIndex, atRule)
    })
  })

  function checkColon(source, index, node) {
    locationChecker({ source, index, err: m => report({
      message: m,
      node,
      index: index + atRuleParamIndex(node),
      result,
      ruleName: checkedRuleName,
    }),
    })
  }
}
