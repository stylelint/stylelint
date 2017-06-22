/* @flow */
"use strict"

const _ = require("lodash")
const fs = require("fs")
const postcss = require("postcss")
const autoSyntax = require("postcss-html")
const safeParser = require("postcss-safe-parser")
const dynamicRequire = require("./dynamicRequire")

const syntaxes = {
  // stylus: require("sugarss"),
  // sass: require("postcss-sass"),
  scss: require("postcss-scss"),
  sugarss: require("sugarss"),
  less: require("postcss-less"),
}

const postcssProcessor = postcss()

function requireSyntax(syntax/*: string*/)/*: postcss$syntax*/ {
  try {
    syntax = dynamicRequire(syntax)
  } catch (e) {
    throw new Error(`Cannot resolve custom syntax module ${syntax}`)
  }
  if (syntax.stringify) {
    return syntax
  }
  return {
    stringify: postcss.stringify,
    parse: syntax,
  }
}

function getSyntax(syntax/*: string*/)/*: postcss$syntax*/ {
  if (syntaxes[syntax]) {
    return syntax = syntaxes[syntax]
  } else {
    throw new Error("You must use a valid syntax option, either: scss, less or sugarss")
  }
}

function detectionSyntax(fix, filePath)/*: postcss$syntax*/ {
  const cssSyntax = {
    stringify: postcss.stringify,
    parse: fix ? safeParser : postcss.parse,
  }

  const styleExtNames = {
    // styl: syntaxes.stylus,
    // sass: syntaxes.sass,
    scss: syntaxes.scss,
    sss: syntaxes.sugarss,
    less: syntaxes.less,
    css: cssSyntax,
  }

  return filePath && styleExtNames[filePath.replace(/^.*\.(\w+)$/, "$1").toLowerCase()] ||
    autoSyntax(_.assign({
      css: cssSyntax,
    }, syntaxes))
}

module.exports = function (stylelint/*: stylelint$internalApi*/)/*: Promise<?Object>*/ {
  const options/*: {
    code?: string,
    codeFilename?: string,
    filePath?: string,
    codeProcessors?: Array<Function>,
    syntax?: stylelint$syntaxes,
    customSyntax?: string
  }*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  const cached/*: ?postcss$result*/ = stylelint._postcssResultCache.get(options.filePath)
  if (cached) return Promise.resolve(cached)

  let getCode
  if (options.code !== undefined) {
    getCode = Promise.resolve(options.code)
  } else if (options.filePath) {
    getCode = readFile(options.filePath)
  }

  if (!getCode) {
    throw new Error("code or filePath required")
  }

  return getCode.then(code => {
    const stylelintOpts = stylelint._options
    let syntax/*: postcss$syntax*/

    if (stylelintOpts.customSyntax) {
      syntax = requireSyntax(stylelintOpts.customSyntax)
    } else if (stylelintOpts.syntax) {
      syntax = getSyntax(stylelintOpts.syntax)
    } else {
      syntax = detectionSyntax(stylelintOpts.fix, options.filePath)
    }

    const postcssOptions/*: postcss$options*/ = {
      from: options.filePath,
      syntax,
    }

    const source = options.code ? options.codeFilename : options.filePath
    let preProcessedCode = code
    if (options.codeProcessors) {
      options.codeProcessors.forEach(codeProcessor => {
        preProcessedCode = codeProcessor(preProcessedCode, source)
      })
    }

    return postcssProcessor.process(preProcessedCode, postcssOptions)
  }).then(postcssResult => {
    stylelint._postcssResultCache.set(options.filePath, postcssResult)
    return postcssResult
  })
}

function readFile(filePath/*: string*/)/*: Promise<string>*/ {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        return reject(err)
      }
      resolve(content)
    })
  })
}
