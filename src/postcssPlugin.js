import postcss from "postcss"
import rc from "rc"
import path from "path"
import resolveFrom from "resolve-from"
import { assign, mapValues, merge, isEmpty } from "lodash"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"

export default postcss.plugin("stylelint", (options = {}) => {
  return (root, result) => {
    // result.stylelint is the namespace for passing stylelint-related
    // configuration and data across sub-plugins via the PostCSS Result
    result.stylelint = result.stylelint || {}
    result.stylelint.ruleSeverities = {}

    const config = buildConfig(options)

    if (!config) {
      throw configurationError("No configuration provided")
    }
    if (!config.rules) {
      throw configurationError("No rules found within configuration")
    }

    if (config.plugins) {
      merge(ruleDefinitions, mapValues(config.plugins, plugin => require(plugin)))
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
  }
})

function buildConfig(options) {
  let initialConfig
  let configBasedir

  if (options.hasOwnProperty("configFile")) {
    const absoluteConfigPath = (path.isAbsolute(options.configFile))
      ? options.configFile
      : path.join(process.cwd(), options.configFile)
    try {
      initialConfig = require(absoluteConfigPath)
      configBasedir = path.dirname(absoluteConfigPath)
    } catch (e) {
      throw configurationError(
        `configFile path "${options.configFile}" corresponded to no file`
      )
    }
  } else {
    const passedConfig = options.hasOwnProperty("config")
      ? options.config
      : options
    initialConfig = (isEmpty(passedConfig))
      ?  rc("stylelint")
      : passedConfig
    configBasedir = options.configBasedir || path.dirname(initialConfig.config)
  }

  const config = extendConfig(initialConfig, configBasedir)

  if (options.configOverrides) {
    merge(config, options.configOverrides)
  }

  return config
}

function extendConfig(config, basedir = process.cwd()) {
  // Absolutize the plugins here, because here is the place
  // where we know the basedir for this particular config
  const configWithAbsolutePlugins = absolutizePlugins(config, basedir)
  if (!config.extends) return configWithAbsolutePlugins

  return [].concat(config.extends).reduce((mergedConfig, extendingConfigLookup) => {
    const extendingConfigPath = getModulePath(basedir, extendingConfigLookup)
    const extendingConfigDir = path.dirname(extendingConfigPath)

    // Now we must recursively extend the extending config
    const extendingConfig = extendConfig(require(extendingConfigPath), extendingConfigDir)

    return merge({}, extendingConfig, mergedConfig)
  }, configWithAbsolutePlugins)
}

// Replace all plugin looksup with absolute paths
function absolutizePlugins(config, basedir) {
  if (!config.plugins) { return config }
  return assign({}, config, {
    plugins: mapValues(config.plugins, lookup => getModulePath(basedir, lookup)),
  })
}

function getModulePath(basedir, lookup) {
  try {
    return resolveFrom(basedir, lookup)
  } catch (e) {
    throw configurationError(
      `Could not find "${lookup}". ` +
      `Do you need a \`configBasedir\`?`
    )
  }
}
