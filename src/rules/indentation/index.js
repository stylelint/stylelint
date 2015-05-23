import { ruleMessages } from "../../utils"

export const ruleName = "indentation"
export const messages = ruleMessages(ruleName, {
  expected: x => `Expected indentation of ${x}`,
})

/**
 * @param {object} options
 * @param {number|"tab"} space - Number of whitespaces to expect, or else
 *   keyword "tab" for single `\t`
 * @param {"always"|"never"} block - Whether extra level of indentation should
 *   be used for nested blocks
 * @param {"always"|"never"} value - Whether extra level of indentation should
 *   be used for multi-line values
 */
export default function (options) {
  const isTab = options.space === "tab"

  const indentChar = (isTab) ? "\t" : (() => {
    let r = ""
    for (let i = 0; i < options.space; i++) {
      r += " "
    }
    return r
  }())

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
    css.eachDecl(checkNode)
    css.eachAtRule(checkNode)

    function checkNode(node) {

      // Expected whitespace equals the indent character
      // repated according to the indentation level
      const nodeLevel = indentationLevel(node)
      let expectedWhitespace = ""
      for (let i = 0; i < nodeLevel; i++) {
        expectedWhitespace += indentChar
      }

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

      // Only blocks have the `after` string to check
      if (!after) { return }

      // Only inspect `after` strings that start with a newline,
      // otherwise there's no indentation involved
      if (after.indexOf("\n") !== -1 && after.slice(1) !== expectedWhitespace) {
        result.warn(
          messages.expected(legibleExpectation(nodeLevel, node.source.end.line)),
          { node }
        )
      }
    }

    function isFirstNodeInRoot(node) {
      return css.first === node
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
