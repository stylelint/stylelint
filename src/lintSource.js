/* @flow */
import {
  stylelint$config,
  stylelint$internalApi,
} from "./flow-declarations"
import PostcssResult from "postcss/lib/result"
import _ from "lodash"
import assignDisabledRanges from "./assignDisabledRanges"
import { configurationError } from "./utils"
import ruleDefinitions from "./rules"

// Run stylelint on a PostCSS Result, either one that is provided
// or one that we create
export default function (
  stylelint: stylelint$internalApi,
  options: {
    code?: string,
    codeFilename?: string,
    filePath?: string,
    existingPostcssResult?: PostcssResult,
  } = {},
): Promise<PostcssResult> {
  if (!options.filePath && options.code === undefined && !options.existingPostcssResult) {
    return Promise.reject("You must provide filePath, code, or existingPostcssResult")
  }

  const inputFilePath = (options.code !== undefined)
    ? options.codeFilename
    : options.filePath

  return stylelint.isPathIgnored(inputFilePath).then((isIgnored) => {
    if (isIgnored) {
      const postcssResult = options.existingPostcssResult || createEmptyPostcssResult(inputFilePath)
      postcssResult.stylelint = postcssResult.stylelint || {}
      postcssResult.stylelint.ignored = true
      postcssResult.standaloneIgnored = true // TODO: remove need for this
      return postcssResult
    }

    const configSearchPath = stylelint._options.configFile || inputFilePath
    return stylelint.getConfigForFile(configSearchPath).then(({ config }) => {
      const { existingPostcssResult } = options
      if (existingPostcssResult) {
        return lintPostcssResult(stylelint, existingPostcssResult, config)
          .then(() => existingPostcssResult)
      }

      return stylelint._getPostcssResult({
        code: options.code,
        codeFilename: options.codeFilename,
        filePath: inputFilePath,
        codeProcessors: config.codeProcessors,
      }).then((postcssResult) => {
        return lintPostcssResult(stylelint, postcssResult, config)
          .then(() => postcssResult)
      })
    })
  })
}

function lintPostcssResult(
  stylelint: stylelint$internalApi,
  postcssResult: PostcssResult,
  config: stylelint$config,
): Promise<> {
  postcssResult.stylelint = postcssResult.stylelint || {}
  postcssResult.stylelint.ruleSeverities = {}
  postcssResult.stylelint.customMessages = {}
  postcssResult.stylelint.quiet = config.quiet

  const postcssRoot = postcssResult.root
  assignDisabledRanges(postcssRoot, postcssResult)
  if (stylelint._options.reportNeedlessDisables || stylelint._options.ignoreDisables) {
    postcssResult.stylelint.ignoreDisables = true
  }

  // Promises for the rules. Although the rule code runs synchronously now,
  // the use of Promises makes it compatible with the possibility of async
  // rules down the line.
  const performRules = []

  Object.keys(config.rules).forEach((ruleName) => {
    const ruleFunction = ruleDefinitions[ruleName] || config.pluginFunctions[ruleName]

    if (!ruleFunction) {
      throw configurationError(`Undefined rule ${ruleName}`)
    }

    const ruleSettings = config.rules[ruleName]
    const primaryOption = ruleSettings[0]
    const secondaryOptions = ruleSettings[1]

    if (primaryOption === null) { return }

    // Log the rule's severity in the PostCSS result
    const defaultSeverity = config.defaultSeverity || "error"
    postcssResult.stylelint.ruleSeverities[ruleName] = _.get(secondaryOptions, "severity", defaultSeverity)
    postcssResult.stylelint.customMessages[ruleName] = secondaryOptions && secondaryOptions.message

    const performRule = Promise.resolve().then(() => {
      ruleFunction(primaryOption, secondaryOptions)(postcssRoot, postcssResult)
    })
    performRules.push(performRule)
  })

  return Promise.all(performRules)
}

function createEmptyPostcssResult(filePath?: string): Object {
  return {
    root: {
      source: {
        input: { file: filePath },
      },
    },
    messages: [],
    stylelint: { stylelintError: null },
  }
}
