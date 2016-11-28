const declarationValueIndex = require("../../utils/declarationValueIndex")
const isStandardSyntaxDeclaration = require("../../utils/isStandardSyntaxDeclaration")
const report = require("../../utils/report")

module.exports = function (_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkDecls(decl => {
    if (!isStandardSyntaxDeclaration(decl)) {
      return
    }

    // Get the raw prop, and only the prop
    const endOfPropIndex = declarationValueIndex(decl) + decl.raws.between.length - 1

    // The extra characters tacked onto the end ensure that there is a character to check
    // after the colon. Otherwise, with `background:pink` the character after the
    const propPlusColon = decl.toString().slice(0, endOfPropIndex) + "xxx"

    for (let i = 0, l = propPlusColon.length; i < l; i++) {
      if (propPlusColon[i] !== ":") {
        continue
      }
      locationChecker({
        source: propPlusColon,
        index: i,
        lineCheckStr: decl.value,
        err: m => {
          report({
            message: m,
            node: decl,
            index: decl.prop.toString().length + 1,
            result,
            ruleName: checkedRuleName,
          })
        },
      })
      break
    }
  })
}
