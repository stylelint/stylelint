import postcss from "postcss"
import multimatch from "multimatch"
import { get, isPlainObject } from "lodash"
import path from "path"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import buildConfig from "./buildConfig"

export default postcss.plugin("stylelint", (options = {}) => {
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

  return (root, result) => {
    const configPromise = buildConfig(options)

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

      if (config.legacyNumberedSeverities) {
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

        const rawSettings = config.rules[ruleName]
        const normalizedSettings = normalizeSettings(rawSettings, ruleName)

        // Ignore the rule
        if (normalizedSettings[0] === null) { return }

        const ruleSeverity = (normalizedSettings[1] && normalizedSettings[1].warn) ? "warning" : "error"

        // Log the rule's severity in the PostCSS result
        result.stylelint.ruleSeverities[ruleName] = ruleSeverity

        // Run the rule with the primary and secondary options
        ruleDefinitions[ruleName](normalizedSettings[0], normalizedSettings[1])(root, result)
      })
    })
  }
})

// These are rules that accept an array as the primary option
const rulesWithPrimaryOptionArray = new Set([
  "rule-properties-order",
  "function-whitelist",
  "function-blacklist",
  "property-whitelist",
  "property-blacklist",
  "property-unit-whitelist",
  "property-unit-blacklist",
  "unit-whitelist",
  "unit-blacklist",
])

function normalizeSettings(rawSettings, ruleName) {
  // Settings can be
  // a. A solitary primitive value or object, in which case put it in an array
  // b. An array with a primary option and a secondary options object, in which case use that array
  // c. A solitary array ... in which case we have trouble and need to special-case it
  //    ... hence the list above

  if (rulesWithPrimaryOptionArray.has(ruleName)) {
    if (
      rawSettings !== null
      && rawSettings.length === 2
      && Array.isArray(rawSettings[0])
      && isPlainObject(rawSettings[1])
    ) {
      return rawSettings
    }
    return [rawSettings]
  }

  if (Array.isArray(rawSettings)) { return rawSettings }
  return [rawSettings]
}
