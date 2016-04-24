import path from "path"
import fs from "fs"
import cosmiconfig from "cosmiconfig"
import resolveFrom from "resolve-from"
import {
  assign,
  merge,
  omit,
} from "lodash"
import { configurationError } from "./utils"

const IGNORE_FILENAME = ".stylelintignore"

export default function (options) {
  const rawConfig = (() => {
    if (options.config) return options.config
    if (options.rules) return options
    return false
  })()
  const configBasedir = options.configBasedir || process.cwd()

  if (rawConfig) {
    return augmentConfig(rawConfig, configBasedir).then(config => {
      return {
        config: merge(config, options.configOverrides),
        configDir: configBasedir,
      }
    })
  }

  const cosmiconfigOptions = {
    // Turn off argv option to avoid hijacking the all-too-common
    // --config argument, when this is used in conjunction with other CLI's
    // (e.g. webpack)
    argv: false,
    // Allow extensions on rc filenames
    rcExtensions: true,
  }

  if (options.configFile) {
    cosmiconfigOptions.configPath = path.resolve(process.cwd(), options.configFile)
  }

  let rootConfigDir

  return cosmiconfig("stylelint", cosmiconfigOptions).then(result => {
    if (!result) throw configurationError("No configuration found")
    rootConfigDir = path.dirname(result.filepath)
    return augmentConfig(result.config, rootConfigDir)
  }).then(augmentedConfig => {
    const finalConfig = (options.configOverrides)
      ? merge({}, augmentedConfig, options.configOverrides)
      : augmentedConfig
    return {
      config: finalConfig,
      configDir: rootConfigDir,
    }
  })
}

function augmentConfig(config, configDir) {
  return setIgnoreFiles(config, configDir).then(augmentedConfig => {
    // Absolutize the plugins here, because here is the place
    // where we know the basedir for this particular config
    return absolutizePlugins(augmentedConfig, configDir)
  }).then(augmentedConfig => {
    if (!config.extends) {
      return Promise.resolve(augmentedConfig)
    }

    const extendLookups = [].concat(augmentedConfig.extends)
    const origConfig = omit(augmentedConfig, "extends")
    const resultPromise = extendLookups.reduce((mergeConfigs, extendLookup) => {
      return mergeConfigs.then(mergedConfig => {
        return loadExtendedConfig(mergedConfig, configDir, extendLookup).then(extendedConfig => {
          return merge({}, mergedConfig, extendedConfig)
        })
      })
    }, Promise.resolve(origConfig))

    return resultPromise.then(mergedConfig => {
      return merge({}, mergedConfig, origConfig)
    })
  })
}

function setIgnoreFiles(config, configDir) {
  return findIgnorePatterns(configDir).then(ignorePatterns => {
    config.ignoreFiles = [].concat(ignorePatterns, config.ignoreFiles || [])
    return config
  })
}

function loadExtendedConfig(config, configDir, extendLookup) {
  const extendPath = getModulePath(configDir, extendLookup)
  const extendDir = path.dirname(extendPath)
  return cosmiconfig(null, {
    configPath: extendPath,
    // In case --config was used: do not pay attention to it again
    argv: false,
  }).then(result => {
    return augmentConfig(stripIgnoreFiles(result.config), extendDir)
  })
}

// Replace all plugin lookups with absolute paths
function absolutizePlugins(config, configDir) {
  if (!config.plugins) { return config }
  return assign({}, config, {
    plugins: config.plugins.map(lookup => getModulePath(configDir, lookup)),
  })
}

function getModulePath(basedir, lookup) {
  const path = resolveFrom(basedir, lookup)
  if (path) return path
  throw configurationError(
    `Could not find "${lookup}". Do you need a \`configBasedir\`?`
  )
}

function findIgnorePatterns(configDir) {
  return new Promise((resolve, reject) => {
    const ignoreFilePath = path.resolve(configDir, IGNORE_FILENAME)

    fs.readFile(ignoreFilePath, "utf8", (err, data) => {
      if (err) {
        // If the file's not found, great, we'll just give in an empty array
        if (err.code === "ENOENT") return resolve([])
        return reject(err)
      }
      const ignorePatterns = data.split(/\r?\n/g)
        .filter(val => val.trim() !== "")     // Remove empty lines
        .filter(val => val.trim()[0] !== "#") // Remove comments
      resolve(ignorePatterns)
    })
  })
}

// The `ignoreFiles` option only works with the
// config that is being directly invoked, not any
// extended configs
function stripIgnoreFiles(config) {
  return omit(config, "ignoreFiles")
}
