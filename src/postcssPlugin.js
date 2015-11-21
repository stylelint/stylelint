import postcss from "postcss"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import buildConfig from "./buildConfig"

const numberedSeveritiesMap = new Map()
numberedSeveritiesMap.set(0, "ignore")
numberedSeveritiesMap.set(1, "warning")
numberedSeveritiesMap.set(2, "error")

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

      if (config.numberedSeverities) {
        warnForNumberedSeverities(result)
      }

      if (config.plugins) {
        config.plugins.forEach(pluginPath => {
          const plugin = require(pluginPath).default
          ruleDefinitions[plugin.ruleName] = plugin.rule
        })
      }

      // Register details about the configuration
      result.stylelint.quiet = config.quiet

      // First check for disabled ranges, adding them to the result object
      disableRanges(root, result)

      Object.keys(config.rules).forEach(ruleName => {
        if (!ruleDefinitions[ruleName]) {
          throw configurationError(`Undefined rule "${ruleName}"`)
        }

        const ruleSettings = [].concat(config.rules[ruleName])
        const ruleSeverity = numberedSeveritiesMap.get(ruleSettings[0])

        if (ruleSeverity === "ignore") { return }

        // Log the rule's severity in the PostCSS result
        result.stylelint.ruleSeverities[ruleName] = ruleSeverity

        // Run the rule with the primary and secondary options
        ruleDefinitions[ruleName](ruleSettings[1], ruleSettings[2])(root, result)
      })
    })
  }
})

let wasWarned = false
function warnForNumberedSeverities(result) {
  if (wasWarned) { return }
  wasWarned = true
  result.warn((
    "Numbered severities (0, 1, 2) have been deprecated, " +
    "and in 4.0 they will be disabled. "
  ), {
    stylelintType: "deprecation",
    stylelintReference: "http://stylelint.io/?/docs/user-guide/configuration.md",
  })
}
