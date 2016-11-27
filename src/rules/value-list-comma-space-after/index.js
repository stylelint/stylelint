const isStandardSyntaxDeclaration = require("../../utils/isStandardSyntaxDeclaration")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const styleSearch = require("style-search")

export const ruleName = "value-list-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \",\"",
  rejectedAfter: () => "Unexpected whitespace after \",\"",
  expectedAfterSingleLine: () => "Expected single space after \",\" in a single-line list",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \",\" in a single-line list",
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never", "always-single-line", "never-single-line" ],
    })
    if (!validOptions) {
      return
    }

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function valueListCommaWhitespaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkDecls(decl => {
    if (!isStandardSyntaxDeclaration(decl) || !isStandardSyntaxProperty(decl.prop)) {
      return
    }
    styleSearch({
      source: decl.toString(),
      target: ",",
      functionArguments: "skip",
    }, match => {
      checkComma(decl.toString(), match.startIndex, decl)
    })
  })

  function checkComma(source, index, node) {
    locationChecker({
      source,
      index,
      err: m => {
        report({
          message: m,
          node,
          index,
          result,
          ruleName: checkedRuleName,
        })
      },
    })
  }
}
