import postcss from "postcss"
import multimatch from "multimatch"
import { get } from "lodash"
import path from "path"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import buildConfig from "./buildConfig"

export default postcss.plugin("stylelint", (options = {}) => {
  const configPromise = buildConfig(options)

  return (root, result) => {
    // result.stylelint is the namespace for passing stylelint-related
    // configuration and data across sub-plugins via the PostCSS Result
    result.stylelint = result.stylelint || {}
    result.stylelint.ruleSeverities = {}

    return configPromise.then(({ config, configDir }) => {
      if (!config) {
        throw configurationError("No configuration provided")
      }

      if (!config.rules) {
        throw configurationError("No rules found within configuration")
      }

      if (config.ignoreFiles) {
        const pathFromConfigToSource = path.relative(configDir, get(root, "source.input.file", ""))
        if (multimatch(pathFromConfigToSource, config.ignoreFiles).length) { return }
      }

      if (config.numberedSeverities) {
        warnForNumberedSeverities(result)
      }

      if (config.plugins) {
        config.plugins.forEach(pluginPath => {
          const pluginImport = require(pluginPath)
          // Handle either ES6 or CommonJS modules
          const plugin = pluginImport.default || pluginImport
          if (!plugin.ruleName) {
            throw configurationError(
              `stylelint v3+ requires plugins to expose a ruleName. ` +
              `The plugin "${pluginPath}" is not doing this, so will not work ` +
              `with stylelint v3+. Please file an issue with the plugin to upgrade.`
            )
          }
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

        // Ignore the rule
        if (ruleSettings[0] === null) { return }

        const ruleSeverity = (ruleSettings[1] && ruleSettings[1].warn) ? "warning" : "error"

        // Log the rule's severity in the PostCSS result
        result.stylelint.ruleSeverities[ruleName] = ruleSeverity

        // Run the rule with the primary and secondary options
        ruleDefinitions[ruleName](ruleSettings[0], ruleSettings[1])(root, result)
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
