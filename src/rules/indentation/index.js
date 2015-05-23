import _ from "lodash"
import {
  ruleMessages,
  valueIndexOf
} from "../../utils"

export const ruleName = "indentation"
export const messages = ruleMessages(ruleName, {
  expected: x => `Expected indentation of ${x}`,
})

/**
 * @param {object} options
 * @param {number|"tab"} space - Number of whitespaces to expect, or else
 *   keyword "tab" for single `\t`
 * @param {"always"|"never"} [block="always"] - Whether extra level of
 *   indentation should be used for nested blocks
 * @param {"always"|"never"} [value="always"] - Whether extra level of
 *   indentation should be used for multi-line values
 */
export default function (options) {
  const isTab = options.space === "tab"

  const indentChar = (isTab) ? "\t" : _.repeat(" ", options.space)

  const warningWord = (isTab) ? "tab" : "space"

  function legibleExpectation(level, line) {
    const count = (isTab) ? level : level * options.space
    const quantifiedWarningWord = (count === 1)
      ? warningWord
      : warningWord + "s"
    return `${count} ${quantifiedWarningWord} at line ${line}`
  }

  return function (css, result) {
    css.eachRule(checkNode)
    css.eachAtRule(checkNode)
    css.eachDecl(checkNode)

    function checkNode(node) {

      // Expected whitespace equals the indent character
      // repated according to the indentation level
      let nodeLevel = indentationLevel(node)

      // unless option.block is "never", in which case
      // everything is taken down a level (all blocks
      // are level 0)
      if (options.block === "never" && nodeLevel > 0) {
        nodeLevel--
      }

      const expectedWhitespace = _.repeat(indentChar, nodeLevel)

      const { before, after } = node

      // Only inspect the spaces before the node
      // if this is the first node in root
      // or there is a newline in the `before` string.
      // (If there are no lines between two statements,
      // we don't want to check for indentation.)
      const inspectBefore = isFirstNodeInRoot(node) || before.indexOf("\n") !== -1

      // Inspect whitespace in the `before` string that is
      // *after* the *last* newline character,
      // because anything besides that is not indentation for this node:
      // it is separation, checked by a separate rule
      if (inspectBefore && before.slice(before.lastIndexOf("\n") + 1) !== expectedWhitespace) {
        result.warn(
          messages.expected(legibleExpectation(nodeLevel, node.source.start.line)),
          { node }
        )
      }

      // Only blocks have the `after` string to check.
      // Only inspect `after` strings that start with a newline,
      // otherwise there's no indentation involved
      if (after && after.indexOf("\n") !== -1
        && after.slice(after.lastIndexOf("\n") + 1) !== expectedWhitespace) {
        result.warn(
          messages.expected(legibleExpectation(nodeLevel, node.source.end.line)),
          { node }
        )
      }

      // If this is a declaration, check the value
      if (node.value) {
        checkValue(node, nodeLevel)
      }
    }

    function isFirstNodeInRoot(node) {
      return css.first === node
    }

    function checkValue(node, declLevel) {
      const value = node.value
      if (value.indexOf("\n") === -1) { return }

      const valueLevel = (options.value === "never")
        ? declLevel
        : declLevel + 1
      const postNewlineExpected = _.repeat(indentChar, valueLevel)

      valueIndexOf({ value, char: "\n" }, (newlineIndex, newlineCount) => {
        // Starting at the index after the newline, we want to
        // check that the whitespace characters before the first
        // non-whitespace character equal the expected indentation
        const postNewlineActual = /^(\s*)\S/.exec(value.slice(newlineIndex + 1))[1]

        if (postNewlineActual !== postNewlineExpected) {
          result.warn(
            messages.expected(legibleExpectation(
              valueLevel,
              node.source.start.line + newlineCount
            )),
            { node }
          )
        }
      })
    }
  }
}

// Indentation level equals the ancestor nodes
// separating this node from root
function indentationLevel(node, level=0) {
  if (node.parent.type !== "root") {
    return indentationLevel(node.parent, level + 1)
  }
  return level
}
