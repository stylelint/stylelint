const isStandardSyntaxDeclaration = require("../../utils/isStandardSyntaxDeclaration")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const report = require("../../utils/report")
const styleSearch = require("style-search")

module.exports = function (_ref) {
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
