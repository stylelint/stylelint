const declarationValueIndex = require("../../utils/declarationValueIndex")
const isStandardSyntaxFunction = require("../../utils/isStandardSyntaxFunction")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const _ = require("lodash")
const styleSearch = require("style-search")
const valueParser = require("postcss-value-parser")

export const ruleName = "function-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \",\"",
  rejectedAfter: () => "Unexpected whitespace after \",\"",
  expectedAfterSingleLine: () => "Expected single space after \",\" in a single-line function",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \",\" in a single-line function",
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

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function functionCommaSpaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkDecls(decl => {
    const declValue = _.get(decl, "raws.value.raw", decl.value)

    valueParser(declValue).walk(valueNode => {
      if (valueNode.type !== "function") {
        return
      }

      if (!isStandardSyntaxFunction(valueNode)) {
        return
      }

      // Ignore `url()` arguments, which may contain data URIs or other funky stuff
      if (valueNode.value.toLowerCase() === "url") {
        return
      }

      const functionArguments = (() => {
        let result = valueParser.stringify(valueNode)
        // Remove function name and opening paren
        result = result.slice(valueNode.value.length + 1)
        // Remove closing paren
        result = result.slice(0, result.length - 1)
        // 1. Remove comments including preceeding whitespace (when only succeeded by whitespace)
        // 2. Remove all other comments, but leave adjacent whitespace intact
        result = result.replace(/(\ *\/(\*.*\*\/(?!\S)|\/.*)|(\/(\*.*\*\/|\/.*)))/, "")
        return result
      })()

      styleSearch({
        source: functionArguments,
        target: ",",
        functionArguments: "skip",
      }, match => {
        locationChecker({
          source: functionArguments,
          index: match.startIndex,
          err: message => {
            const index = declarationValueIndex(decl) + valueNode.value.length + 1 + valueNode.sourceIndex + match.startIndex
            report({
              index,
              message,
              node: decl,
              result,
              ruleName: checkedRuleName,
            })
          },
        })
      })
    })
  })
}
