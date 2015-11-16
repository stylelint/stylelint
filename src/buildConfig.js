import path from "path"
import cosmiconfig from "cosmiconfig"
import resolveFrom from "resolve-from"
import { assign, mapValues, merge, omit } from "lodash"
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
    configPath: options.configFile,
  }).then(result => {
    return augmentConfig(result.config, path.dirname(result.filepath))
  }).then(augmentedConfig => {
    return (options.configOverrides)
      ? merge({}, augmentedConfig, options.configOverrides)
      : augmentedConfig
  })
}

function augmentConfig(originalConfig, originalConfigDir) {
  // Returns a Promise ...
  return mergeExtends(originalConfig, originalConfigDir)

  // ... because this returns a Promise
  function mergeExtends(config, configDir) {
    // Absolutize the plugins here, because here is the place
    // where we know the basedir for this particular config
    const configWithAbsolutePlugins = absolutizePlugins(config, configDir)
    if (!config.extends) {
      return Promise.resolve(configWithAbsolutePlugins)
    }

    const extendLookups = [].concat(config.extends)
    const resultPromise = extendLookups.reduce((mergeConfigs, extendLookup) => {
      return mergeConfigs.then((mergedConfig) => {
        return loadExtendedConfig(mergedConfig, extendLookup).then((extendedConfig) => {
          return merge({}, mergedConfig, extendedConfig)
        })
      })
    }, Promise.resolve(omit(config, "extends")))

    return resultPromise

    // Also returns a Promise ...
    function loadExtendedConfig(config, extendLookup) {
      var extendPath = resolveFrom(configDir, extendLookup)
      var extendDir = path.dirname(extendPath)

      return cosmiconfig(null, { configPath: extendPath }).then((result) => {
        return mergeExtends(result.config, extendDir)
      })
    }
  }
}

// Replace all plugin looksup with absolute paths
function absolutizePlugins(config, configDir) {
  if (!config.plugins) { return config }
  return assign({}, config, {
    plugins: mapValues(config.plugins, lookup => getModulePath(configDir, lookup)),
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
