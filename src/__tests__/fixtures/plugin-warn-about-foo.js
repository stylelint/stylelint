import stylelint from "../../"

const ruleName = "plugin/warn-about-foo"

const warnAboutFooMessages = stylelint.utils.ruleMessages("plugin/warn-about-foo", {
  found: "found .foo",
})

export default stylelint.createPlugin(ruleName, function (expectation) {
  return (root, result) => {
    root.walkRules(rule => {
      if (rule.selector === ".foo") {
        if (expectation === "always") {
          stylelint.utils.report({
            result,
            ruleName,
            message: warnAboutFooMessages.found,
            node: rule,
          })
        }
      }
    })
  }
})
