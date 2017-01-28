"use strict"

const execall = require("execall")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const styleSearch = require("style-search")

const ruleName = "max-line-length"

const messages = ruleMessages(ruleName, {
  expected: l => `Expected line length to be no more than ${l} characters`,
})

const rule = function (maxLength, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: maxLength,
      possible: _.isNumber,
    }, {
      actual: options,
      possible: {
        ignore: [
          "non-comments",
          "comments",
        ],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    const rootString = root.toString()

    const ignoreNonComments = optionsMatches(options, "ignore", "non-comments")
    const ignoreComments = optionsMatches(options, "ignore", "comments")

    // Check first line
    checkNewline({ endIndex: 0 })

    // Check subsequent lines
    styleSearch({ source: rootString, target: ["\n"], comments: "check" }, checkNewline)

    function complain(index) {
      report({
        index,
        result,
        ruleName,
        message: messages.expected(maxLength),
        node: root,
      })
    }

    function checkNewline(match) {
      let nextNewlineIndex = rootString.indexOf("\n", match.endIndex)
      if (rootString[nextNewlineIndex - 1] === "\r") {
        nextNewlineIndex -= 1
      }

      // Accommodate last line
      if (nextNewlineIndex === -1) {
        nextNewlineIndex = rootString.length
      }

      const rawLineLength = nextNewlineIndex - match.endIndex
      const lineText = rootString.slice(match.endIndex, nextNewlineIndex)

      const urlArgumentsLength = execall(/url\((.*)\)/ig, lineText).reduce((result, match) => {
        return result + _.get(match, "sub[0].length", 0)
      }, 0)

      const importUrlsLength = execall(/\@import\s+(['"].*['"])/ig, lineText).reduce((result, match) => {
        return result + _.get(match, "sub[0].length", 0)
      }, 0)

      // If the line's length is less than or equal to the specified
      // max, ignore it ... So anything below is liable to be complained about.
      // **Note that the length of any url arguments or import urls
      // are excluded from the calculation.**
      if (rawLineLength - urlArgumentsLength - importUrlsLength <= maxLength) {
        return
      }

      const complaintIndex = nextNewlineIndex - 1

      if (ignoreComments) {
        if (match.insideComment) {
          return
        }

        // This trimming business is to notice when the line starts a
        // comment but that comment is indented, e.g.
        //       /* something here */
        const nextTwoChars = rootString.slice(match.endIndex).trim().slice(0, 2)
        if (nextTwoChars === "/*" || nextTwoChars === "//") {
          return
        }
      }

      if (ignoreNonComments) {
        if (match.insideComment) {
          return complain(complaintIndex)
        }

        // This trimming business is to notice when the line starts a
        // comment but that comment is indented, e.g.
        //       /* something here */
        const nextTwoChars = rootString.slice(match.endIndex).trim().slice(0, 2)
        if (nextTwoChars !== "/*" && nextTwoChars !== "//") {
          return
        }
        return complain(complaintIndex)
      }

      // If there are no spaces besides initial (indent) spaces, ignore it
      const lineString = rootString.slice(match.endIndex, nextNewlineIndex)
      if (lineString.replace(/^\s+/, "").indexOf(" ") === -1) {
        return
      }

      return complain(complaintIndex)
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
