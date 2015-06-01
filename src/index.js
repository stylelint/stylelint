import postcss from "postcss"
import ruleDefinitions from "./rules"

export default postcss.plugin("stylelint", settings => {
  return (css, result) => {
    if (!settings) { return }
    if (!settings.rules) { return }

    Object.keys(settings.rules).forEach(ruleName => {
      if (!ruleDefinitions[ruleName]) {
        throw new Error(
          `Undefined rule ${ruleName}`
        )
      }

      // If severity is 0, run nothing
      const ruleSettings = settings.rules[ruleName]

      const ruleSeverity = (Array.isArray(ruleSettings))
        ? ruleSettings[0]
        : ruleSettings
      if (ruleSeverity === 0) { return }

      // Otherwise, pass the options object to the rule
      ruleDefinitions[ruleName](ruleSettings[1])(css, result)
    })
  }
})
