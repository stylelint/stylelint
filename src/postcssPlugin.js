import postcss from "postcss"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import buildConfig from "./buildConfig"

export default postcss.plugin("stylelint", (options = {}) => {
  return (root, result) => {
    // result.stylelint is the namespace for passing stylelint-related
    // configuration and data across sub-plugins via the PostCSS Result
    result.stylelint = result.stylelint || {}
    result.stylelint.ruleSeverities = {}

    return buildConfig(options).then(config => {
      if (!config) {
        throw configurationError("No configuration provided")
      }
      if (!config.rules) {
        throw configurationError("No rules found within configuration")
      }
      if (config.plugins) {
        config.plugins.forEach(pluginPath => {
          const plugin = require(pluginPath)
          ruleDefinitions[plugin.ruleName] = plugin.rule
        })
      }

      // Register details about the configuration
      result.stylelint.quiet = config.quiet

      // First check for disabled ranges, adding them to the result object
      disableRanges(root, result)

      Object.keys(config.rules).forEach(ruleName => {
        if (!ruleDefinitions[ruleName]) {
          throw configurationError(`Undefined rule ${ruleName}`)
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
        result.stylelint.ruleSeverities[ruleName] = ruleSeverity

        // Run the rule with the primary and secondary options
        ruleDefinitions[ruleName](ruleSettings[1], ruleSettings[2])(root, result)
      })
    })
  }
})
