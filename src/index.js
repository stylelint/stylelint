import postcss from "postcss"
import rules from "./rules"

export default postcss.plugin("stylelint", settings => {
  return (css, result) => {
    Object.keys(settings.rules).forEach(rule => {
      if (!rules[rule]) {
        throw new Error(
          `Undefined rule ${rule}`
        )
      }

      // If severity is 0, run nothing
      const ruleSettings = settings[rule]
      const ruleSeverity = (Array.isArray(ruleSettings))
        ? ruleSettings[0]
        : ruleSettings
      if (ruleSeverity === 0) { return }

      // Otherwise, pass the options object to the rule
      rules[rule](ruleSettings[1])(css, result)
    })
  }
})
