import {
  assign,
  merge,
  omit,
  union,
} from "lodash"
import { configurationError } from "./utils"
import cosmiconfig from "cosmiconfig"
import fs from "fs"
import globjoin from "globjoin"
import path from "path"
import resolveFrom from "resolve-from"

const IGNORE_FILENAME = ".stylelintignore"
const FILE_NOT_FOUND_ERROR_CODE = "ENOENT"

/**
 * - Accept a raw config or look up `.stylelintrc` (using cosmiconfig).
 * - Add patterns from `.stylelintignore` to the config's `ignoreFiles`.
 * - Resolve plugin and processor names to absolute paths.
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
 * - Plugins and processors resolved to absolute paths
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
function augmentConfig(config, configDir, options = {}) {
  const start = (options.addIgnorePatterns)
    ? addIgnores(config, configDir, options.ignorePath)
    : Promise.resolve(config)
  return start.then(configWithIgnorePatterns => {
    const absolutizedConfig = absolutizeExtras(configWithIgnorePatterns, configDir)
    if (absolutizedConfig.extends) {
      return extendConfig(absolutizedConfig, configDir)
    }
    return Promise.resolve(absolutizedConfig)
  })
}

function addIgnores(config, configDir, ignorePath) {
  // Absoluteize config.ignoreFiles
  if (config.ignoreFiles) {
    config.ignoreFiles = [].concat(config.ignoreFiles).map(glob => {
      if (path.isAbsolute(glob)) return glob
      return globjoin(configDir, glob)
    })
  }

  let defaultedIgnorePath = path.resolve(process.cwd(), IGNORE_FILENAME)
  if (ignorePath) {
    defaultedIgnorePath = (path.isAbsolute(ignorePath))
      ? ignorePath
      : path.resolve(process.cwd(), ignorePath)
  }

  return new Promise((resolve, reject) => {
    fs.readFile(defaultedIgnorePath, "utf8", (err, data) => {
      if (err) {
        // If the file's not found, great, we'll just give an empty array
        if (err.code === FILE_NOT_FOUND_ERROR_CODE) { return resolve(config) }
        return reject(err)
      }
      // Add an ignorePatterns property to the config, containing the
      // .gitignore-patterned globs loaded from .stylelintignore
      config.ignorePatterns = data
      resolve(config)
    })
  })
}

// Replace all plugin and processor lookups with absolute paths
function absolutizeExtras(config, configDir) {
  if (!config.plugins && !config.processors) { return config }
  const result = assign({}, config)
  if (config.plugins) {
    result.plugins = [].concat(config.plugins).map(lookup => getModulePath(configDir, lookup))
  }
  if (config.processors) {
    result.processors = [].concat(config.processors).map(lookup => getModulePath(configDir, lookup))
  }
  return result
}

function extendConfig(config, configDir) {
  const extendLookups = [].concat(config.extends)
  const original = omit(config, "extends")

  const resultPromise = extendLookups.reduce((result, extendLookup) => {
    return result.then(merged => {
      return loadExtendedConfig(merged, configDir, extendLookup).then(extended => {
        return mergeConfigs(merged, extended)
      })
    })
  }, Promise.resolve(original))

  return resultPromise.then(merged => {
    return mergeConfigs(merged, original)
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

function mergeConfigs(a, b) {
  const pluginMerger = {}
  if (a.plugins || b.plugins) {
    pluginMerger.plugins = union(a.plugins, b.plugins)
  }
  const rulesMerger = {}
  if (a.rules || b.rules) {
    rulesMerger.rules = assign({}, a.rules, b.rules)
  }
  return assign({}, b, a, pluginMerger, rulesMerger)
}
