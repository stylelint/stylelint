import path from "path"
import cosmiconfig from "cosmiconfig"
import resolveFrom from "resolve-from"
import { assign, mapValues, merge, omit } from "lodash"
import { configurationError } from "./utils"

export default function (options) {
  return new Promise((resolve, reject) => {
    const rawConfig = (() => {
      if (options.config) return options.config
      if (options.rules) return options
    })()
    const basedir = options.configBasedir || process.cwd()

    if (rawConfig) {
      augmentConfig(rawConfig, basedir).then(config => {
        if (options.configOverrides) {
          merge(config, options.configOverrides)
        }
        resolve(config)
      }).catch(reject)
      return
    }

    cosmiconfig("stylelint", {
      configPath: options.configFile,
    })
      .then(result => {
        return augmentConfig(result.config, path.dirname(result.filepath))
      })
      .then(augmentedConfig => {
        const config = (options.configOverrides)
          ? merge({}, augmentedConfig, options.configOverrides)
          : augmentedConfig
        resolve(config)
      })
      .catch(reject)
  })
}

function augmentConfig(originalConfig, originalConfigDir) {
  return mergeExtends(originalConfig, originalConfigDir)

  // Returns a Promise
  function mergeExtends(config, configDir) {
    // Absolutize the plugins here, because here is the place
    // where we know the basedir for this particular config
    const configWithAbsolutePlugins = absolutizePlugins(config, configDir)
    if (!config.extends) {
      return Promise.resolve(configWithAbsolutePlugins)
    }

    const extendLookups = [].concat(config.extends)
    const resultPromise = extendLookups.reduce((mergedConfigPromise, extendLookup) => {
      return mergedConfigPromise.then((priorMergedConfig) => {
        return loadExtendConfig(priorMergedConfig, configDir, extendLookup)
          .then((extendConfig) => {
            return Promise.resolve(merge({}, priorMergedConfig, extendConfig))
          })
      })
    }, Promise.resolve(omit(config, "extends")))

    return resultPromise

    function loadExtendConfig(config, configDir, extendLookup) {
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
