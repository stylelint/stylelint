import postcss from "postcss"
import rcLoader from "rc-loader"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import ruleSeverities from "./ruleSeverities"

export default postcss.plugin("stylelint", explicitConfig => {
  const config = explicitConfig || rcLoader("stylelint")

  return (root, result) => {
    if (!config) { return }
    if (!config.rules) { return }

    if (config.plugins) {
      addPluginsToDefinitions(config.plugins, ruleDefinitions)
    }

    // First check for disabled ranges
    disableRanges(root, result)

    Object.keys(config.rules).forEach(ruleName => {
      if (!ruleDefinitions[ruleName]) {
        throw new Error(`Undefined rule ${ruleName}`)
      }

      // If severity is 0, run nothing
      const ruleSettings = config.rules[ruleName]
      const ruleSeverity = (Array.isArray(ruleSettings))
        ? ruleSettings[0]
        : ruleSettings
      if (ruleSeverity === 0) {
        return
      }

      // Log the rule's severity
      ruleSeverities.set(ruleName, ruleSeverity)

      // Run the rule with the primary and secondary options
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
