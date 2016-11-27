const declarationValueIndex = require("../../utils/declarationValueIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const styleSearch = require("style-search")

export const ruleName = "declaration-bang-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"!\"",
  rejectedAfter: () => "Unexpected whitespace after \"!\"",
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

    declarationBangSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function declarationBangSpaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkDecls(function (decl) {
    const indexOffset = declarationValueIndex(decl)
    const declString = decl.toString()
    const valueString = decl.toString().slice(indexOffset)
    if (valueString.indexOf("!") == -1) {
      return
    }

    styleSearch({ source: valueString, target: "!" }, match => {
      check(declString, match.startIndex + indexOffset, decl)
    })
  })

  function check(source, index, node) {
    locationChecker({ source, index, err: m => report({
      message: m,
      node,
      index,
      result,
      ruleName: checkedRuleName,
    }),
    })
  }
}
