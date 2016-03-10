import postcss from "postcss"
import multimatch from "multimatch"
import globjoin from "globjoin"
import { get } from "lodash"
import path from "path"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import buildConfig from "./buildConfig"
import normalizeRuleSettings from "./normalizeRuleSettings"

export default postcss.plugin("stylelint", (options = {}) => {
  return (root, result) => {
    const configPromise = buildConfig(options)

    // result.stylelint is the namespace for passing stylelint-related
    // configuration and data across sub-plugins via the PostCSS Result
    result.stylelint = result.stylelint || {}
    result.stylelint.ruleSeverities = {}
    result.stylelint.customMessages = {}

    return configPromise.then(({ config, configDir }) => {
      if (!config) {
        throw configurationError("No configuration provided")
      }

      if (!config.rules) {
        throw configurationError("No rules found within configuration. Have you provided a \"rules\" property?")
      }

      if (config.ignoreFiles) {
        const absoluteIgnoreFiles = [].concat(config.ignoreFiles).map(glob => {
          if (path.isAbsolute(glob)) return glob
          return globjoin(configDir, glob)
        })
        const sourcePath = get(root, "source.input.file", "")
        if (multimatch(sourcePath, absoluteIgnoreFiles).length) { return }
      }

      if (config.plugins) {
        config.plugins.forEach(pluginPath => {
          const pluginImport = require(pluginPath)
          // Handle either ES6 or CommonJS modules
          const plugin = pluginImport.default || pluginImport
          if (!plugin.ruleName) {
            throw configurationError(
              "stylelint v3+ requires plugins to expose a ruleName. " +
              `The plugin "${pluginPath}" is not doing this, so will not work ` +
              "with stylelint v3+. Please file an issue with the plugin."
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

        const rawRuleSettings = config.rules[ruleName]
        const ruleSettings = normalizeRuleSettings(rawRuleSettings, ruleName)
        const primaryOption = ruleSettings[0]
        const secondaryOptions = ruleSettings[1]

        // Ignore the rule
        if (primaryOption === null) { return }

        let ruleSeverity
        if (get(secondaryOptions, "warn")) {
          result.warn((
            "'warn: true' has been deprecated and in 5.0 it will be removed. " +
            "Use 'severity: \"warning\"' instead."
          ), {
            stylelintType: "deprecation",
            stylelintReference: "http://stylelint.io/user-guide/configuration/",
          })
          ruleSeverity = "warning"
        } else {
          ruleSeverity = get(secondaryOptions, "severity", "error")
        }

        // Log the rule's severity and custom message in the PostCSS result
        result.stylelint.ruleSeverities[ruleName] = ruleSeverity
        result.stylelint.customMessages[ruleName] = get(secondaryOptions, "message")
          || get(options, [ "customMessages", ruleName ])

        // Run the rule with the primary and secondary options
        ruleDefinitions[ruleName](primaryOption, secondaryOptions)(root, result)
      })
    })
  }
})
