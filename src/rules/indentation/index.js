import { repeat, isNumber, isBoolean } from "lodash"
import {
  optionsHaveException,
  optionsHaveIgnored,
  report,
  ruleMessages,
  styleSearch,
  cssStatementHasBlock,
  cssStatementStringBeforeBlock,
  validateOptions,
} from "../../utils"

export const ruleName = "indentation"
export const messages = ruleMessages(ruleName, {
  expected: x => `Expected indentation of ${x}`,
})

// The hierarchyMap keeps track of nodes with confirmed
// superordinates and indentation levels.
// It can then be used to quickly check the indentation level of
// some prior node, or (when hierarchicalSelectors is one) by rules to check
// if they have a peer in the hierarchyMap, and should share that
// peer's superordinate.
const hierarchyMap = new Map()

function addNodeToHierarchy(node, superordinate, level) {
  hierarchyMap.set(node, { superordinate, level })
}

/**
 * @param {number|"tab"} space - Number of whitespaces to expect, or else
 *   keyword "tab" for single `\t`
 * @param {object} [options]
 * @param {array} [options.except = ["block", "value"]] - Do *not* expect extra level of
 *   indentation for nested blocks and multi-line values, respectively
 * @param {array} [options.hierarchicalSelectors = false] - If `true`, we'll look for a
 *   hierarchical style of indentation (see tests and docs)
 */
export default function (space, options) {
  const isTab = space === "tab"
  const indentChar = (isTab) ? "\t" : repeat(" ", space)
  const warningWord = (isTab) ? "tab" : "space"

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: space,
      possible: [ isNumber, "tab" ],
    }, {
      actual: options,
      possible: {
        except: [ "block", "value", "param" ],
        ignore: [ "value", "param" ],
        hierarchicalSelectors: [isBoolean],
      },
      optional: true,
    })
    if (!validOptions) { return }

    // Cycle through all nodes using eachInside.
    // This is done instead of using
    // eachRule, eachAtRule, and eachDecl,
    // so that any hierarchy can be accounted for *in order*.
    root.walk(node => {

      let nodeLevel = indentationLevel(node)

      if (options && options.hierarchicalSelectors) {
        // hierarchicalSelectorsLevel will add the node to the hierarchyMap ...
        nodeLevel = hierarchicalSelectorsLevel(node, nodeLevel)
      } else {
        // ... so if it doesn't run we need to add this node to
        // the hierarchyMap for future reference.
        // If there isn't a selector hierarchy enforced, then the superordinate
        // can only be the node's parent.
        addNodeToHierarchy(node, node.parent, nodeLevel)
      }

      // At this point, the node's indent level should be calculated,
      // and this information should be saved in hierarchyMap

      const expectedWhitespace = repeat(indentChar, nodeLevel)

      let before = node.raw("before")
      let after = node.raw("after")

      // Only inspect the spaces before the node
      // if this is the first node in root
      // or there is a newline in the `before` string.
      // (If there is no newline before a node,
      // there is no "indentation" to check.)
      const inspectBefore = (root.first === node) || before.indexOf("\n") !== -1

      // Cut out any * hacks from `before`
      before = (before[before.length - 1] === "*")
        ? before.slice(0, before.length - 1)
        : before

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
      if (
        cssStatementHasBlock(node)
        && after
        && after.indexOf("\n") !== -1
        && after.slice(after.lastIndexOf("\n") + 1) !== expectedWhitespace
      ) {
        report({
          message: messages.expected(legibleExpectation(nodeLevel)),
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

    function indentationLevel(node, level=0) {
      if (node.parent.type === "root") { return level }

      // In case by recursion we're checking a node that's
      // already been checked ...
      if (hierarchyMap.has(node)) {
        return hierarchyMap.get(node).level
      }

      let calculatedLevel
      if (hierarchyMap.has(node.parent)) {
        // If the hierarchyMap already contains this node's
        // parent, use that level
        calculatedLevel = hierarchyMap.get(node.parent).level + 1
      } else {
        // Typically, indentation level equals the ancestor nodes
        // separating this node from root; so recursively
        // run this operation
        calculatedLevel = indentationLevel(node.parent, level + 1)
      }

      // If options.except includes "block",
      // blocks are taken down one from their calculated level
      // (all blocks are the same level as their parents)
      if (
        optionsHaveException(options, "block")
        && (node.type === "rule" || node.type === "atrule")
        && cssStatementHasBlock(node)
      ) {
        calculatedLevel--
      }

      return calculatedLevel
    }

    function checkValue(decl, declLevel) {
      if (decl.value.indexOf("\n") === -1) { return }
      if (optionsHaveIgnored(options, "value")) { return }

      const declString = decl.toString()
      const valueLevel = (optionsHaveException(options, "value"))
        ? declLevel
        : declLevel + 1

      checkMultilineBit(declString, valueLevel, decl)
    }

    function checkSelector(rule, ruleLevel) {
      const selector = rule.selector

      checkMultilineBit(selector, ruleLevel, rule)
    }

    function checkAtRuleParams(atRule, ruleLevel) {
      if (optionsHaveIgnored(options, "param")) { return }

      const paramLevel = (optionsHaveException(options, "param"))
        ? ruleLevel
        : ruleLevel + 1

      checkMultilineBit(cssStatementStringBeforeBlock(atRule).trim(), paramLevel, atRule)
    }

    function checkMultilineBit(source, newlineIndentLevel, node) {
      if (source.indexOf("\n") === -1) { return }
      styleSearch({ source, target: "\n" }, (match) => {
        // Starting at the index after the newline, we want to
        // check that the whitespace characters before the first
        // non-whitespace character equal the expected indentation
        const postNewlineActual = /^(\s*)\S/.exec(source.slice(match.startIndex + 1))[1]

        // Function arguments are ignored to allow for arbitrary indentation
        if (match.insideFunction) { return }

        if (postNewlineActual !== repeat(indentChar, newlineIndentLevel)) {
          report({
            message: messages.expected(legibleExpectation(newlineIndentLevel)),
            node,
            index: match.startIndex + 1,
            result,
            ruleName,
          })
        }
      })
    }
  }

  function legibleExpectation(level) {
    const count = (isTab) ? level : level * space
    const quantifiedWarningWord = (count === 1)
      ? warningWord
      : warningWord + "s"
    return `${count} ${quantifiedWarningWord}`
  }
}

// Figure the correct level of indentation if this is a rule that is
// part of a hierarchy of selectors.
//
// In the hierarchy, Rule A is subordinate to Rule B if Rule A's
// selector starts with Rule B's selector. Each rule can be
// subordinate to one other rule, but superordinate to many.
//
// Subordinates do not always immediately follow their
// superordinates, so it would be overly simplistic to just
// check if any given rule is subordinate to the previous rule.
function hierarchicalSelectorsLevel(node, nodeLevel) {
  const prevNode = node.prev()

  // For various reasons we might rule out that this is
  // a hierarchical node
  if (
    !prevNode
    || prevNode.type !== "rule"
    || node.type === "decl"
    || node.type === "comment"
  ) {
    addNodeToHierarchy(node, node.parent, nodeLevel)
    return nodeLevel
  }

  // For at-rules: if *all* of the rules in the at-rule start with
  // selector of the rule before the at-rule, it should be subordinated
  // to the previous rule
  if (node.type === "atrule") {
    let insubordinate
    node.walkRules(rule => {
      if (!isSubordinateTo(rule, prevNode)) {
        insubordinate = true
        return false
      }
    })
    const expectedLevel = (hierarchyMap.has(prevNode))
      ? hierarchyMap.get(prevNode).level + 1
      : nodeLevel + 1
    if (insubordinate) {
      addNodeToHierarchy(node, node.parent, expectedLevel)
      return nodeLevel
    }
    addNodeToHierarchy(node, prevNode, expectedLevel)
    return expectedLevel
  }

  // For rules ...
  const isFirstSubordinate = isSubordinateTo(node, prevNode)
  if (isFirstSubordinate) {
    const expectedLevel = (hierarchyMap.has(prevNode))
      ? hierarchyMap.get(prevNode).level + 1
      : nodeLevel + 1
    addNodeToHierarchy(node, prevNode, expectedLevel)
    return expectedLevel
  }

  // If this node is not subordinate to prevNode, but prevNode was itself a subordinate,
  // maybe this node is a peer of prevNode (and therefore should be subordinate to the
  // same superordinate). Or maybe it's a peer of prevNode's superordinate.
  // Recursively check the hierarchy in this manner for possible peers: if one
  // is found, use that peer's nodeLevel.
  let maybePeer = prevNode
  while (maybePeer) {
    if (hierarchyMap.has(maybePeer)) {
      const maybePeerInfo = hierarchyMap.get(maybePeer)
      if (isSubordinateTo(node, maybePeerInfo.superordinate)) {
        addNodeToHierarchy(node, maybePeerInfo.superordinate, maybePeerInfo.level)
        return maybePeerInfo.level
      } else {
        maybePeer = maybePeerInfo.superordinate
      }
    } else {
      maybePeer = false
    }
  }

  addNodeToHierarchy(node, node.parent, nodeLevel)
  return nodeLevel
}

function isSubordinateTo(a, b) {
  return (
    a && b
    && a.selector.indexOf(b.selector) === 0
    && a.selector !== b.selector
  )
}
