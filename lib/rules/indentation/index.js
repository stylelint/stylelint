"use strict"

const beforeBlockString = require("../../utils/beforeBlockString")
const hasBlock = require("../../utils/hasBlock")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const styleSearch = require("style-search")

const ruleName = "indentation"
const messages = ruleMessages(ruleName, {
  expected: x => `Expected indentation of ${x}`,
})

/**
 * @param {number|"tab"} space - Number of whitespaces to expect, or else
 *   keyword "tab" for single `\t`
 * @param {object} [options]
 */
const rule = function (space) {
  const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  const isTab = space === "tab"
  const indentChar = isTab ? "\t" : _.repeat(" ", space)
  const warningWord = isTab ? "tab" : "space"

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: space,
      possible: [
        _.isNumber,
        "tab",
      ],
    }, {
      actual: options,
      possible: {
        except: [
          "block",
          "value",
          "param",
        ],
        ignore: [
          "value",
          "param",
          "inside-parens",
        ],
        indentInsideParens: [
          "twice",
          "once-at-root-twice-in-block",
        ],
        indentClosingBrace: [_.isBoolean],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    // Cycle through all nodes using walk.
    root.walk(node => {
      const nodeLevel = indentationLevel(node)
      const expectedWhitespace = _.repeat(indentChar, nodeLevel)

      let before = (node.raws.before || "")
      const after = (node.raws.after || "")

      // Only inspect the spaces before the node
      // if this is the first node in root
      // or there is a newline in the `before` string.
      // (If there is no newline before a node,
      // there is no "indentation" to check.)
      const inspectBefore = root.first === node || before.indexOf("\n") !== -1

      // Cut out any * hacks from `before`
      before = before[before.length - 1] === "*" || before[before.length - 1] === "_" ? before.slice(0, before.length - 1) : before

      // Inspect whitespace in the `before` string that is
      // *after* the *last* newline character,
      // because anything besides that is not indentation for this node:
      // it is some other kind of separation, checked by some separate rule
      if (inspectBefore && before.slice(before.lastIndexOf("\n") + 1) !== expectedWhitespace) {
        report({
          message: messages.expected(legibleExpectation(nodeLevel)),
          node,
          result,
          ruleName,
        })
      }

      // Only blocks have the `after` string to check.
      // Only inspect `after` strings that start with a newline;
      // otherwise there's no indentation involved.
      // And check `indentClosingBrace` to see if it should be indented an extra level.
      const closingBraceLevel = options.indentClosingBrace ? nodeLevel + 1 : nodeLevel
      if (hasBlock(node) && after && after.indexOf("\n") !== -1 && after.slice(after.lastIndexOf("\n") + 1) !== _.repeat(indentChar, closingBraceLevel)) {
        report({
          message: messages.expected(legibleExpectation(closingBraceLevel)),
          node,
          index: node.toString().length - 1,
          result,
          ruleName,
        })
      }

      // If this is a declaration, check the value
      if (node.value) {
        checkValue(node, nodeLevel)
      }

      // If this is a rule, check the selector
      if (node.selector) {
        checkSelector(node, nodeLevel)
      }

      // If this is an at rule, check the params
      if (node.type === "atrule") {
        checkAtRuleParams(node, nodeLevel)
      }
    })

    function indentationLevel(node) {
      const level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0

      if (node.parent.type === "root") {
        return level
      }

      let calculatedLevel

      // Indentation level equals the ancestor nodes
      // separating this node from root; so recursively
      // run this operation
      calculatedLevel = indentationLevel(node.parent, level + 1)

      // If options.except includes "block",
      // blocks are taken down one from their calculated level
      // (all blocks are the same level as their parents)
      if (optionsMatches(options, "except", "block") && (node.type === "rule" || node.type === "atrule") && hasBlock(node)) {
        calculatedLevel--
      }

      return calculatedLevel
    }

    function checkValue(decl, declLevel) {
      if (decl.value.indexOf("\n") === -1) {
        return
      }
      if (optionsMatches(options, "ignore", "value")) {
        return
      }

      const declString = decl.toString()
      const valueLevel = optionsMatches(options, "except", "value") ? declLevel : declLevel + 1

      checkMultilineBit(declString, valueLevel, decl)
    }

    function checkSelector(rule, ruleLevel) {
      const selector = rule.selector

      // Less mixins have params, and they should be indented extra
      if (rule.params) {
        ruleLevel += 1
      }

      checkMultilineBit(selector, ruleLevel, rule)
    }

    function checkAtRuleParams(atRule, ruleLevel) {
      if (optionsMatches(options, "ignore", "param")) {
        return
      }

      // @nest rules should be treated like regular rules, not expected
      // to have their params (selectors) indented
      const paramLevel = optionsMatches(options, "except", "param") || atRule.name === "nest" ? ruleLevel : ruleLevel + 1
      checkMultilineBit(beforeBlockString(atRule).trim(), paramLevel, atRule)
    }

    function checkMultilineBit(source, newlineIndentLevel, node) {
      if (source.indexOf("\n") === -1) {
        return
      }
      // `outsideParens` because function arguments and also non-standard parenthesized stuff like
      // Sass maps are ignored to allow for arbitrary indentation
      let parentheticalDepth = 0
      styleSearch({
        source,
        target: "\n",
        outsideParens: optionsMatches(options, "ignore", "inside-parens"),
      }, (match, matchCount) => {
        const precedesClosingParenthesis = /^[ \t]*\)/.test(source.slice(match.startIndex + 1))

        if (optionsMatches(options, "ignore", "inside-parens") && (precedesClosingParenthesis || match.insideParens)) {
          return
        }

        let expectedIndentLevel = newlineIndentLevel
        // Modififications for parenthetical content
        if (!optionsMatches(options, "ignore", "inside-parens") && match.insideParens) {
          // If the first match in is within parentheses, reduce the parenthesis penalty
          if (matchCount === 1) parentheticalDepth -= 1
          // Account for windows line endings
          let newlineIndex = match.startIndex
          if (source[match.startIndex - 1] === "\r") {
            newlineIndex--
          }
          const followsOpeningParenthesis = /\([ \t]*$/.test(source.slice(0, newlineIndex))
          if (followsOpeningParenthesis) {
            parentheticalDepth += 1
          }
          expectedIndentLevel += parentheticalDepth
          if (precedesClosingParenthesis) {
            parentheticalDepth -= 1
          }

          switch (options.indentInsideParens) {
            case "twice":
              if (!precedesClosingParenthesis || options.indentClosingBrace) {
                expectedIndentLevel += 1
              }
              break
            case "once-at-root-twice-in-block":
              if (node.parent === root) {
                if (precedesClosingParenthesis && !options.indentClosingBrace) {
                  expectedIndentLevel -= 1
                }
                break
              }
              if (!precedesClosingParenthesis || options.indentClosingBrace) {
                expectedIndentLevel += 1
              }
              break
            default:
              if (precedesClosingParenthesis && !options.indentClosingBrace) {
                expectedIndentLevel -= 1
              }
          }
        }

        // Starting at the index after the newline, we want to
        // check that the whitespace characters (excluding newlines) before the first
        // non-whitespace character equal the expected indentation
        const afterNewlineSpaceMatches = /^([ \t]*)\S/.exec(source.slice(match.startIndex + 1))
        if (!afterNewlineSpaceMatches) {
          return
        }
        const afterNewlineSpace = afterNewlineSpaceMatches[1]

        if (afterNewlineSpace !== _.repeat(indentChar, expectedIndentLevel)) {
          report({
            message: messages.expected(legibleExpectation(expectedIndentLevel)),
            node,
            index: match.startIndex + afterNewlineSpace.length + 1,
            result,
            ruleName,
          })
        }
      })
    }
  }

  function legibleExpectation(level) {
    const count = isTab ? level : level * space
    const quantifiedWarningWord = count === 1 ? warningWord : warningWord + "s"
    return `${count} ${quantifiedWarningWord}`
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
