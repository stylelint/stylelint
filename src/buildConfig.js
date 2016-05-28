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
const FILE_NOT_FOUND_ERROR_CODE = "ENOENT"

/**
 * - Accept a raw config or look up `.stylelintrc` (using cosmiconfig).
 * - Add patterns from `.stylelintignore` to the config's `ignoreFiles`.
 * - Resolve plugin names to absolute paths.
 * - Resolve extends by finding, augmenting, and merging
 *   extended configs
 *
 * @param {object} options - May either be an options object with a `config` property,
 *   or just the config object itself. All the `options` properties documented below
 *   are for the options object, not a config.
 * @param {object} [options.config]
 * @param {object} [options.configFile] - Specify a configuration file (path) instead
 * @param {object} [options.configBasedir] - Specify a base directory that things should be
 *   considered relative to.
 * @param {object} [options.configOverrides] - An object to merge on top of the
 *   final derived configuration object
 * @param {object} [options.ignorePath] - Specify a file of ignore patterns.
 *   The path can be absolute or relative to `process.cwd()`.
 *   Defaults to `${configDir}/.stylelintignore`.
 * @return {object} Object with `config` and `configDir` properties.
 */
export default function (options) {
  const rawConfig = (() => {
    if (options.config) return options.config
    if (options.rules) return options
    return null
  })()
  const configBasedir = options.configBasedir || process.cwd()

  if (rawConfig) {
    return augmentConfig(rawConfig, configBasedir, {
      addIgnorePatterns: true,
      ignorePath: options.ignorePath,
    }).then(augmentedConfig => {
      return {
        config: merge(augmentedConfig, options.configOverrides),
        configDir: configBasedir,
      }
    })
  }

  const cosmiconfigOptions = {
    // Turn off argv option to avoid hijacking the all-too-common
    // `--config` argument when stylelint is used in conjunction with other CLI's
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
    return augmentConfig(result.config, rootConfigDir, {
      addIgnorePatterns: true,
      ignorePath: options.ignorePath,
    })
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

/**
 * Given a configuration object, return a new augmented version with
 * - Plugins resolved to absolute paths
 * - Extended configs merged in
 *
 * @param {object} config
 * @param {string} configDir
 * @param {object} [options]
 * @param {boolean} [options.addIgnorePatterns=false] - Look for `.stylelintignore` and
 *   add its patterns to `config.ignoreFiles`.
 * @param {string} [options.ignorePath] - See above.
 * @return {object}
 */
export function augmentConfig(config, configDir, options = {}) {
  const start = (options.addIgnorePatterns)
    ? addIgnoreFiles(config, configDir, options.ignorePath)
    : Promise.resolve(config)
  return start.then(configWithIgnorePatterns => {
    const absolutizedConfig = absolutizePlugins(configWithIgnorePatterns, configDir)
    if (absolutizedConfig.extends) {
      return extendConfig(absolutizedConfig, configDir)
    }
    return Promise.resolve(absolutizedConfig)
  })
}

export function addIgnoreFiles(config, configDir, ignorePath) {
  return findIgnorePatterns(configDir, ignorePath).then(ignorePatterns => {
    config.ignoreFiles = [].concat(ignorePatterns, config.ignoreFiles || [])
    return config
  })
}

function findIgnorePatterns(configDir, ignorePath) {
  let defaultedIgnorePath = path.resolve(configDir, IGNORE_FILENAME)
  if (ignorePath) {
    defaultedIgnorePath = (path.isAbsolute(ignorePath))
      ? ignorePath
      : path.resolve(process.cwd(), ignorePath)
  }
  return new Promise((resolve, reject) => {
    fs.readFile(defaultedIgnorePath, "utf8", (err, data) => {
      if (err) {
        // If the file's not found, great, we'll just give an empty array
        if (err.code === FILE_NOT_FOUND_ERROR_CODE) { return resolve([]) }
        return reject(err)
      }
      const ignorePatterns = data.split(/\r?\n/g)
        .filter(val => val.trim() !== "")     // Remove empty lines
        .filter(val => val.trim()[0] !== "#") // Remove comments
      resolve(ignorePatterns)
    })
  })
}

// Replace all plugin lookups with absolute paths
function absolutizePlugins(config, configDir) {
  if (!config.plugins) { return config }
  return assign({}, config, {
    plugins: config.plugins.map(lookup => getModulePath(configDir, lookup)),
  })
}

function extendConfig(config, configDir) {
  const extendLookups = [].concat(config.extends)
  const origConfig = omit(config, "extends")
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
}

function loadExtendedConfig(config, configDir, extendLookup) {
  const extendPath = getModulePath(configDir, extendLookup)
  const extendDir = path.dirname(extendPath)
  return cosmiconfig(null, {
    configPath: extendPath,
    // In case `--config` was used: do not pay attention to it again
    argv: false,
  }).then(result => {
    // Make sure to also augment the config that we're merging in
    // ... but the `ignoreFiles` option only works with the
    // config that is being directly invoked, not any
    // extended configs
    return augmentConfig(stripIgnoreFiles(result.config), extendDir)
  })
}

function getModulePath(basedir, lookup) {
  const path = resolveFrom(basedir, lookup)
  if (path) return path
  throw configurationError(
    `Could not find "${lookup}". Do you need a \`configBasedir\`?`
  )
}

function stripIgnoreFiles(config) {
  return omit(config, "ignoreFiles")
}
