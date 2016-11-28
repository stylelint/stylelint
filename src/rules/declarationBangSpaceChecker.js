const declarationValueIndex = require("../../utils/declarationValueIndex")
const report = require("../../utils/report")
const styleSearch = require("style-search")

module.exports = function (_ref) {
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
