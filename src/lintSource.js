/* @flow */
const _ = require("lodash")
const assignDisabledRanges = require("./assignDisabledRanges")
const configurationError = require("./utils/configurationError")
const ruleDefinitions = require("./rules")

// Run stylelint on a PostCSS Result, either one that is provided
// or one that we create
module.exports = function (stylelint/* : stylelint$internalApi*/)/* : Promise<Object>*/ {
  const options/* : {
                  code?: string,
                  codeFilename?: string,
                  filePath?: string,
                  existingPostcssResult?: Object,
                }*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  if (!options.filePath && options.code === undefined && !options.existingPostcssResult) {
    return Promise.reject("You must provide filePath, code, or existingPostcssResult")
  }

  const isCodeNotFile = options.code !== undefined

  const inputFilePath = isCodeNotFile ? options.codeFilename : options.filePath

  const getIsIgnored = stylelint.isPathIgnored(inputFilePath).catch(err => {
    if (isCodeNotFile && err.code === "ENOENT") return false
    throw err
  })

  return getIsIgnored.then(isIgnored => {
    if (isIgnored) {
      const postcssResult = options.existingPostcssResult || createEmptyPostcssResult(inputFilePath)
      postcssResult.stylelint = postcssResult.stylelint || {}
      postcssResult.stylelint.ignored = true
      postcssResult.standaloneIgnored = true // TODO: remove need for this
      return postcssResult
    }

    const configSearchPath = stylelint._options.configFile || inputFilePath

    const getConfig = stylelint.getConfigForFile(configSearchPath).catch(err => {
      if (isCodeNotFile && err.code === "ENOENT") return stylelint.getConfigForFile(process.cwd())
      throw err
    })

    return getConfig.then((_ref) => {
      const config = _ref.config
      const existingPostcssResult = options.existingPostcssResult

      if (existingPostcssResult) {
        return lintPostcssResult(stylelint, existingPostcssResult, config).then(() => existingPostcssResult)
      }

      return stylelint._getPostcssResult({
        code: options.code,
        codeFilename: options.codeFilename,
        filePath: inputFilePath,
        codeProcessors: config.codeProcessors,
      }).then(postcssResult => {
        return lintPostcssResult(stylelint, postcssResult, config).then(() => postcssResult)
      })
    })
  })
}

function lintPostcssResult(stylelint/* : stylelint$internalApi*/, postcssResult/* : Object*/, config/* : stylelint$config*/)/* : Promise<>*/ {
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

  const rules = config.rules ? Object.keys(config.rules) : []

  rules.forEach(ruleName => {
    const ruleFunction = ruleDefinitions[ruleName] || _.get(config, [ "pluginFunctions", ruleName ])

    if (ruleFunction === undefined) {
      throw configurationError(`Undefined rule ${ruleName}`)
    }

    const ruleSettings = _.get(config, [ "rules", ruleName ])
    if (ruleSettings === null || ruleSettings[0] === null) {
      return
    }

    const primaryOption = ruleSettings[0]
    const secondaryOptions = ruleSettings[1]

    // Log the rule's severity in the PostCSS result
    const defaultSeverity = config.defaultSeverity || "error"
    postcssResult.stylelint.ruleSeverities[ruleName] = _.get(secondaryOptions, "severity", defaultSeverity)
    postcssResult.stylelint.customMessages[ruleName] = _.get(secondaryOptions, "message")

    const performRule = Promise.resolve().then(() => {
      ruleFunction(primaryOption, secondaryOptions)(postcssRoot, postcssResult)
    })
    performRules.push(performRule)
  })

  return Promise.all(performRules)
}

function createEmptyPostcssResult(filePath/* :: ?: string*/)/* : Object*/ {
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
