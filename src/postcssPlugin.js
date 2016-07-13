import _ from "lodash"
import buildConfig from "./buildConfig"
import { configurationError } from "./utils"
import disableRanges from "./disableRanges"
import ignore from "ignore"
import multimatch from "multimatch"
import normalizeRuleSettings from "./normalizeRuleSettings"
import path from "path"
import postcss from "postcss"
import ruleDefinitions from "./rules"

export default postcss.plugin("stylelint", (options = {}) => {
  // The Node API (standalone.js) will pass in its own _configPromise
  let configPromise = options._configPromise
  let ignorePatternsFilter

  return (root, result) => {
    if (!configPromise) {
      configPromise = buildConfig(options)
    }

    // result.stylelint is the namespace for passing stylelint-related
    // configuration and data across sub-plugins via the PostCSS Result
    result.stylelint = result.stylelint || {}
    result.stylelint.ruleSeverities = {}
    result.stylelint.customMessages = {}

    return configPromise.then(({ config }) => {
      if (!config) {
        throw configurationError("No configuration provided")
      }

      if (!config.rules) {
        throw configurationError("No rules found within configuration. Have you provided a \"rules\" property?")
      }

      if (!ignorePatternsFilter && config.ignorePatterns) {
        ignorePatternsFilter = ignore().add(config.ignorePatterns).createFilter()
      }

      if (ignorePatternsFilter || config.ignoreFiles) {
        const sourcePath = _.get(root, "source.input.file", "")
        const filepathRelativeToCwd = path.relative(process.cwd(), sourcePath)
        if (
          (ignorePatternsFilter && !ignorePatternsFilter(filepathRelativeToCwd))
          || (config.ignoreFiles && multimatch(sourcePath, config.ignoreFiles).length)
        ) {
          result.stylelint.ignored = true
          return
        }
      }

      if (config.plugins) {
        config.plugins.forEach(pluginPath => {
          let pluginImport = require(pluginPath)
          // Handle either ES6 or CommonJS modules
          pluginImport = pluginImport.default || pluginImport
          ;[].concat(pluginImport).forEach(plugin => {
            if (!plugin.ruleName) {
              throw configurationError(
                "stylelint v3+ requires plugins to expose a ruleName. " +
                `The plugin "${pluginPath}" is not doing this, so will not work ` +
                "with stylelint v3+. Please file an issue with the plugin."
              )
            }
            if (!_.includes(plugin.ruleName, "/")) {
              throw configurationError(
                "stylelint v7+ requires plugin rules to be namspaced, " +
                "i.e. only `plugin-namespace/plugin-rule-name` plugin rule names are supported. " +
                `The plugin rule "${plugin.ruleName}" does not do this, so will not work. ` +
                "Please file an issue with the plugin."
              )
            }
            ruleDefinitions[plugin.ruleName] = plugin.rule
          })
        })
      }

      const defaultSeverity = config.defaultSeverity || "error"

      // Register details about the configuration
      result.stylelint.quiet = config.quiet

      // First check for disabled ranges, adding them to the result object
      disableRanges(root, result)

      Object.keys(config.rules).forEach(ruleName => {
        if (!ruleDefinitions[ruleName]) {
          throw configurationError(`Undefined rule "${ruleName}"`)
        }

        const rule = ruleDefinitions[ruleName]
        const rawRuleSettings = config.rules[ruleName]
        const ruleSettings = normalizeRuleSettings(rawRuleSettings, ruleName, rule.primaryOptionArray)
        const primaryOption = ruleSettings[0]
        const secondaryOptions = ruleSettings[1]

        // Ignore the rule
        if (primaryOption === null) { return }

        // Log the rule's severity in the PostCSS result
        result.stylelint.ruleSeverities[ruleName] = _.get(secondaryOptions, "severity", defaultSeverity)
        result.stylelint.customMessages[ruleName] = secondaryOptions && secondaryOptions.message

        // Run the rule with the primary and secondary options
        rule(primaryOption, secondaryOptions)(root, result)
      })
    })
  }
})
