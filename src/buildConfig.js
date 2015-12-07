import path from "path"
import cosmiconfig from "cosmiconfig"
import resolveFrom from "resolve-from"
import { assign, merge, omit, values, mapValues } from "lodash"
import { configurationError } from "./utils"

export default function (options) {
  const rawConfig = (() => {
    if (options.config) return options.config
    if (options.rules) return options
    return false
  })()
  const configBasedir = options.configBasedir || process.cwd()

  if (rawConfig) {
    return augmentConfig(rawConfig, configBasedir).then(config => {
      return merge(config, options.configOverrides)
    })
  }

  return cosmiconfig("stylelint", {
    configPath: path.resolve(process.cwd(), options.configFile || ""),
  }).then(result => {
    return augmentConfig(result.config, path.dirname(result.filepath))
  }).then(augmentedConfig => {
    return (options.configOverrides)
      ? merge({}, augmentedConfig, options.configOverrides)
      : augmentedConfig
  })
}

function augmentConfig(nonnormalizedConfig, configDir) {
  const config = normalizeSeverities(nonnormalizedConfig)
  // Absolutize the plugins here, because here is the place
  // where we know the basedir for this particular config
  const configWithAbsolutePlugins = absolutizePlugins(config, configDir)
  if (!config.extends) {
    return Promise.resolve(configWithAbsolutePlugins)
  }

  const extendLookups = [].concat(config.extends)
  const resultPromise = extendLookups.reduce((mergeConfigs, extendLookup) => {
    return mergeConfigs.then(mergedConfig => {
      return loadExtendedConfig(mergedConfig, extendLookup).then(extendedConfig => {
        return merge({}, mergedConfig, extendedConfig)
      })
    })
  }, Promise.resolve(omit(config, "extends")))

  return resultPromise

  function loadExtendedConfig(config, extendLookup) {
    var extendPath = resolveFrom(configDir, extendLookup)
    var extendDir = path.dirname(extendPath)
    return cosmiconfig(null, {
      configPath: extendPath,
      // In case --config was used: do not pay attention to it again
      argv: false,
    }).then(result => {
      return augmentConfig(result.config, extendDir)
    })
  }
}

// Replace all plugin lookups with absolute paths
function absolutizePlugins(config, configDir) {
  if (!config.plugins) { return config }
  return assign({}, config, {
    plugins: config.plugins.map(lookup => getModulePath(configDir, lookup)),
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

// Temporary measure while there are 2 severity syntaxes ...
// This makes all severities numbered (the old syntax).
function normalizeSeverities(config) {
  if (!config.rules) { return config }

  // We'll have to assume that if all the rule settings start with a number,
  // then the config is using numbered severities
  const configHasNumberedSeverities = values(config.rules).every(ruleSettings => {
    return typeof [].concat(ruleSettings)[0] === "number"
  })

  if (configHasNumberedSeverities) {
    return assign({}, config, {
      numberedSeverities: true,
    })
  }

  return assign({}, config, {
    rules: mapValues(config.rules, ruleSettings => {
      if (ruleSettings === null) { return 0 }
      if (ruleSettings === true) { return 2 }

      if (ruleSettings[1] && ruleSettings[1].warn) {
        return [1].concat(ruleSettings)
      }

      return [2].concat(ruleSettings)
    }),
  })
}
