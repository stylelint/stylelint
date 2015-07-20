import postcss from "postcss"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"

export default postcss.plugin("stylelint", settings => {
  return (root, result) => {
    if (!settings) { return }
    if (!settings.rules) { return }

    if (settings.plugins) {
      addPluginsToDefinitions(settings.plugins, ruleDefinitions)
    }

    // First check for disabled ranges
    disableRanges(root, result)

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

      // Otherwise, run the rule with the primary and secondary options
      ruleDefinitions[ruleName](ruleSettings[1], ruleSettings[2])(root, result)
    })
  }
})

function addPluginsToDefinitions(plugins, definitions) {
  Object.keys(plugins).forEach(name => {
    if (typeof plugins[name] !== "function") {
      addPluginsToDefinitions(plugins[name], definitions)
      return
    }
    definitions[name] = plugins[name]
  })
}
