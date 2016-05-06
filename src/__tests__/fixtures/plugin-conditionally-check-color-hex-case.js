import stylelint from "../../"

const ruleName = "plugin/conditionally-check-color-hex-case"

export default stylelint.createPlugin(ruleName, function (expectation) {
  const colorHexCaseRule = stylelint.rules["color-hex-case"](expectation)
  return (root, result) => {
    if (root.toString().indexOf("@@check-color-hex-case") === -1) return
    colorHexCaseRule(root, result)
  }
})
