import postcss from "postcss"
import rc from "rc"
import path from "path"
import { merge, cloneDeep } from "lodash"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"
import disableRanges from "./disableRanges"
import ruleSeverities from "./ruleSeverities"

export default postcss.plugin("stylelint", opts => {
  return (root, result) => {
    let initialConfig = opts.hasOwnProperty("config") ? opts.config : opts
    if (!initialConfig) {
      initialConfig = rc("stylelint")
    }

    const configBasedir = opts.configBasedir || path.dirname(initialConfig.config)
    const config = extendConfig(initialConfig, configBasedir)

    if (!config) {
      throw configurationError("No configuration provided")
    }
    if (!config.rules) {
      throw configurationError("No rules found within configuration")
    }

    if (config.plugins) {
      Object.keys(config.plugins).forEach(pluginName => {
        ruleDefinitions[pluginName] = requirePlugin(config.plugins[pluginName], configBasedir)
      })
    }

    // First check for disabled ranges, adding then to the result object
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
      ruleSeverities.set(ruleName, ruleSeverity)

      // Run the rule with the primary and secondary options
      ruleDefinitions[ruleName](ruleSettings[1], ruleSettings[2])(root, result)
    })
  }
})

function extendConfig(config, configBasedir) {
  if (!config.extends) { return config }

  return [].concat(config.extends).reduce((mergedConfig, extendingConfigLookup) => {
    let extendingConfig
    let extendingConfigPath

    if ([ ".", "/", "\\" ].indexOf(extendingConfigLookup[0]) === -1) {
      // If the lookup *is not* a relative path, just require() it
      // and require.resolve() to get its path
      extendingConfigPath = require.resolve(extendingConfigLookup)
      extendingConfig = tryRequiring(extendingConfigLookup)
    } else {
      // If the lookup *is* a relative path, find it relative to configBasedir
      extendingConfigPath = path.resolve(configBasedir || process.cwd(), extendingConfigLookup)
      extendingConfig = tryRequiring(extendingConfigPath)
    }

    // Now we must recursively extend the extending config
    extendingConfig = extendConfig(extendingConfig, path.dirname(extendingConfigPath))

    merge(mergedConfig, extendingConfig)
    return mergedConfig
  }, cloneDeep(config))
}

function requirePlugin(lookup, configBasedir) {
  if ([ ".", "/", "\\" ].indexOf(lookup[0]) === -1) {
    // If the lookup *is not* a relative path, just require() it
    return tryRequiring(lookup)
  } else {
    // If the lookup *is* a relative path, find it relative to configBasedir
    const lookupPath = path.resolve(configBasedir || process.cwd(), lookup)
    return tryRequiring(lookupPath)
  }
}

function tryRequiring(lookup) {
  try {
    return require(lookup)
  } catch(e) {
    throw configurationError(
      `Could not find "${lookup}". ` +
      `Do you need a \`configBasedir\`?`
    )
  }
}
