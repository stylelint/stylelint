/* @flow */
import type {
  stylelint$config,
  stylelint$configAugmented,
  stylelint$configProcessors,
  stylelint$internalApi,
} from "./flow-declarations"
import _ from "lodash"
import { configurationError } from "./utils"
import fs from "fs"
import globjoin from "globjoin"
import normalizeRuleSettings from "./normalizeRuleSettings"
import path from "path"
import resolveFrom from "resolve-from"
import rules from "./rules"

const DEFAULT_IGNORE_FILENAME = ".stylelintignore"
const FILE_NOT_FOUND_ERROR_CODE = "ENOENT"

// - Makes all paths absolute
// - Merges extends
function augmentConfigBasic(
  stylelint: Object,
  config: stylelint$config,
  configDir: string,
): Promise<stylelint$config> {
  return Promise.resolve()
    .then(() => {
      return absolutizePaths(config, configDir)
    })
    .then((augmentedConfig) => {
      return extendConfig(stylelint, augmentedConfig, configDir)
    })
}

// Extended configs need to be run through augmentConfigBasic
// but do not need the full treatment. Things like pluginFunctions
// will be resolved and added by the parent config.
function augmentConfigExtended(
  stylelint: Object,
  cosmiconfigResultArg: ?{
    config: stylelint$config,
    filepath: string,
  },
): Promise<?{
  config: stylelint$config,
  filepath: string,
}> {
  const cosmiconfigResult = cosmiconfigResultArg // Lock in for Flow
  if (!cosmiconfigResult) return Promise.resolve(null)

  const configDir = path.dirname(cosmiconfigResult.filepath || "")
  const cleanedConfig = _.omit(cosmiconfigResult.config, "ignoreFiles")
  return augmentConfigBasic(stylelint, cleanedConfig, configDir).then((augmentedConfig) => {
    return {
      config: augmentedConfig,
      filepath: cosmiconfigResult.filepath,
    }
  })
}

function augmentConfigFull(
  stylelint: stylelint$internalApi,
  cosmiconfigResultArg: ?{
    config: stylelint$config,
    filepath: string,
  },
): Promise<stylelint$configAugmented> {
  const cosmiconfigResult = cosmiconfigResultArg // Lock in for Flow
  if (!cosmiconfigResult) return Promise.resolve(null)

  const { config, filepath } = cosmiconfigResult

  const configDir = stylelint._options.configBasedir
    || path.dirname(filepath || "")

  return addIgnorePatterns(stylelint, config, configDir)
    .then((augmentedConfig) => {
      return augmentConfigBasic(stylelint, augmentedConfig, configDir)
    })
    .then((augmentedConfig) => {
      return addPluginFunctions(augmentedConfig)
    })
    .then((augmentedConfig) => {
      return addProcessorFunctions(augmentedConfig)
    })
    .then((augmentedConfig) => {
      const configWithOverrides = _.merge(augmentedConfig, stylelint._options.configOverrides)

      if (!configWithOverrides.rules) {
        throw configurationError("No rules found within configuration. Have you provided a \"rules\" property?")
      }

      return configWithOverrides
    })
    .then((augmentedConfig) => {
      return normalizeAllRuleSettings(augmentedConfig)
    })
    .then((augmentedConfig) => {
      return {
        config: augmentedConfig,
        filepath: cosmiconfigResult.filepath,
      }
    })
}

// Load a file ignore ignore patterns, if there is one;
// then add them to the config as an ignorePatterns property
function addIgnorePatterns(
  stylelint: stylelint$internalApi,
  config: stylelint$config,
): Promise<stylelint$config> {
  const ignoreFilePath = stylelint._options.ignorePath || DEFAULT_IGNORE_FILENAME
  const absoluteIgnoreFilePath = (path.isAbsolute(ignoreFilePath))
    ? ignoreFilePath
    : path.resolve(process.cwd(), ignoreFilePath)

  return new Promise((resolve, reject) => {
    fs.readFile(absoluteIgnoreFilePath, "utf8", (err, data) => {
      if (err) {
        // If the file's not found, fine, we'll just
        // consider it an empty array of globs
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

// Make all paths in the config absolute:
// - ignoreFiles
// - plugins
// - processors
// (extends handled elsewhere)
function absolutizePaths(
  config: stylelint$config,
  configDir: string,
): stylelint$config {
  if (config.ignoreFiles) {
    config.ignoreFiles = [].concat(config.ignoreFiles).map((glob) => {
      if (path.isAbsolute(glob.replace(/^!/, ""))) return glob
      return globjoin(configDir, glob)
    })
  }

  if (config.plugins) {
    config.plugins = [].concat(config.plugins).map(lookup => {
      return getModulePath(configDir, lookup)
    })
  }

  if (config.processors) {
    config.processors = absolutizeProcessors(config.processors, configDir)
  }

  return config
}

// First try to resolve from the provided directory,
// then try to resolve from process.cwd.
function getModulePath(
  basedir: string,
  lookup: string,
): string {
  let path = resolveFrom(basedir, lookup)
  if (!path) {
    path = resolveFrom(process.cwd(), lookup)
  }
  if (!path) {
    throw configurationError(
      `Could not find "${lookup}". Do you need a \`configBasedir\`?`
    )
  }
  return path
}

// Processors are absolutized in their own way because
// they can be and return a string or an array
function absolutizeProcessors(
  processors: stylelint$configProcessors,
  configDir: string,
): stylelint$configProcessors {
  return [].concat(processors).map((item) => {
    if (typeof item === "string") {
      return getModulePath(configDir, item)
    }

    return [
      getModulePath(configDir, item[0]),
      item[1],
    ]
  })
}

function extendConfig(
  stylelint: Object,
  config: stylelint$config,
  configDir: stylelint$config,
): Promise<stylelint$config> {
  if (!config.extends) return Promise.resolve(config)

  const originalWithoutExtends = _.omit(config, "extends")
  const loadExtends = [].concat(config.extends).reduce((resultPromise, extendLookup) => {
    return resultPromise.then((resultConfig) => {
      return loadExtendedConfig(stylelint, resultConfig, configDir, extendLookup).then((extendResult) => {
        return mergeConfigs(resultConfig, extendResult.config)
      })
    })
  }, Promise.resolve(originalWithoutExtends))

  return loadExtends.then((resultConfig) => {
    return mergeConfigs(resultConfig, originalWithoutExtends)
  })
}

function loadExtendedConfig(
  stylelint: Object,
  config: stylelint$config,
  configDir: string,
  extendLookup: string,
): Promise<stylelint$config> {
  const extendPath = getModulePath(configDir, extendLookup)
  return stylelint._extendExplorer.load(null, extendPath)
}

// When merging configs (via extends)
// - plugin and processor arrays are joined
// - rules are merged via Object.assign, so there is no attempt made to
//   merge any given rule's settings. If b contains the same rule as a,
//   b's rule settings will override a's rule settings entirely.
// - Everything else is merged via Object.assign
function mergeConfigs(
  a: stylelint$config,
  b: stylelint$config,
): stylelint$config {
  const pluginMerger = {}
  if (a.plugins || b.plugins) {
    pluginMerger.plugins = _.union(a.plugins, b.plugins)
  }

  const processorMerger = {}
  if (a.processors || b.processors) {
    processorMerger.processors = _.union(a.processors, b.processors)
  }

  const rulesMerger = {}
  if (a.rules || b.rules) {
    rulesMerger.rules = Object.assign({}, a.rules, b.rules)
  }

  return Object.assign({}, b, a, pluginMerger, rulesMerger)
}

function addPluginFunctions(
  config: stylelint$configAugmented,
): stylelint$configAugmented {
  if (!config.plugins) return config

  const pluginFunctions = config.plugins.reduce((result, pluginLookup) => {
    let pluginImport = require(pluginLookup)
    // Handle either ES6 or CommonJS modules
    pluginImport = pluginImport.default || pluginImport

    ;[].concat(pluginImport).forEach((plugin) => {
      if (!plugin.ruleName) {
        throw configurationError(
          "stylelint v3+ requires plugins to expose a ruleName. " +
          `The plugin "${pluginLookup}" is not doing this, so will not work ` +
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

      result[plugin.ruleName] = plugin.rule
    })

    return result
  }, {})

  config.pluginFunctions = pluginFunctions
  return config
}

function normalizeAllRuleSettings(
  config: stylelint$configAugmented,
): stylelint$configAugmented {
  const normalizedRules = {}
  Object.keys(config.rules).forEach((ruleName) => {
    const rawRuleSettings = config.rules[ruleName]
    const rule = rules[ruleName] || _.get(config, [ "pluginFunctions", ruleName ])
    if (!rule) {
      throw configurationError(`Undefined rule ${ruleName}`)
    }
    normalizedRules[ruleName] = normalizeRuleSettings(rawRuleSettings, ruleName, _.get(rule, "primaryOptionArray"))
  })
  config.rules = normalizedRules
  return config
}

// Given an array of processors strings, we want to add two
// properties to the augmented config:
// - codeProcessors: functions that will run on code as it comes in
// - resultProcessors: functions that will run on results as they go out
//
// To create these properties, we need to:
// - Find the processor module
// - Intialize the processor module by calling its functions with any
//   provided options
// - Push the processor's code and result processors to their respective arrays
const processorCache = new Map()
function addProcessorFunctions(
  config: stylelint$configAugmented
): stylelint$configAugmented {
  if (!config.processors) return config

  const codeProcessors = []
  const resultProcessors = []

  ;[].concat(config.processors).forEach((processorConfig) => {
    const processorKey = JSON.stringify(processorConfig)

    let initializedProcessor
    if (processorCache.has(processorKey)) {
      initializedProcessor = processorCache.get(processorKey)
    } else {
      processorConfig = [].concat(processorConfig)
      const processorLookup = processorConfig[0]
      const processorOptions = processorConfig[1]
      let processor = require(processorLookup)
      processor = processor.default || processor
      initializedProcessor = processor(processorOptions)
      processorCache.set(processorKey, initializedProcessor)
    }

    if (initializedProcessor && initializedProcessor.code) {
      codeProcessors.push(initializedProcessor.code)
    }
    if (initializedProcessor && initializedProcessor.result) {
      resultProcessors.push(initializedProcessor.result)
    }
  })

  config.codeProcessors = codeProcessors
  config.resultProcessors = resultProcessors
  return config
}

export {
  augmentConfigExtended,
  augmentConfigFull,
}
