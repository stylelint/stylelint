import _ from "lodash"
import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  cssPropertyIsVariable,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-properties-order"

export const messages = ruleMessages(ruleName, {
  expected: (first, second) => `Expected property "${first}" to come before property "${second}"`,
  expectedEmptyLineBetween: (first, second) => `Expected an empty line between property "${first}" and property "${second}"`,
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "alphabetical",
        _.isString,
        (group) => {
          if (!group.properties) { return false }
          if (group.emptyLineBefore && !_.isBoolean(group.emptyLineBefore)) { return false }
          if (group.type && !_.includes([ "strict", "flexible" ], group.type)) { return false }
          return true
        },
      ],
    }, {
      actual: options,
      possible: {
        unspecified: [ "top", "bottom", "ignore" ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    // Shallow loop
    root.each(node => {
      if (node.type === "rule" || node.type === "atrule") {
        checkNode(node)
      }
    })

    function checkNode(node) {
      const allPropData = []
      let lastKnownLineSeparatedGroup = 1

      node.each(child => {
        if (child.nodes && child.nodes.length) {
          checkNode(child)
        }

        if (child.type !== "decl") { return }

        if (cssPropertyIsVariable(child.prop)) { return }

        const propData = {
          name: child.prop,
          unprefixedName: vendor.unprefixed(child.prop),
          before: child.raw("before"),
          index: allPropData.length,
        }

        const previousPropData = _.last(allPropData)
        allPropData.push(propData)

        // Skip first decl
        if (!previousPropData) { return }

        const isCorrectOrder = (expectation === "alphabetical")
          ? checkAlpabeticalOrder(previousPropData, propData)
          : checkOrder(previousPropData, propData, lastKnownLineSeparatedGroup, child)

        if (isCorrectOrder) { return }

        report({
          message: messages.expected(propData.name, previousPropData.name),
          node: child,
          result,
          ruleName,
        })
      })
    }

    function checkAlpabeticalOrder(firstPropData, secondPropData) {
      // If unprefixed prop names are the same, compare the prefixed versions
      if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
        return firstPropData.name <= secondPropData.name
      }

      return firstPropData.unprefixedName < secondPropData.unprefixedName
    }

    function checkOrder(firstPropData, secondPropData, lastKnownLineSeparatedGroup, node) {
      const expectedOrder = createExpectedOrder(expectation)

      // If the unprefixed property names are the same, resort to alphabetical ordering
      if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
        return firstPropData.name <= secondPropData.name
      }

      // By default, ignore unspecified properties
      const unspecified = _.get(options, ["unspecified"], "ignore")

      const firstPropOrderValue = getOrderValue(expectedOrder, firstPropData.unprefixedName)
      const secondPropOrderValue = getOrderValue(expectedOrder, secondPropData.unprefixedName)
      const firstPropIsUnspecified = !firstPropOrderValue
      const secondPropIsUnspecified = !secondPropOrderValue

      // Now check newlines between ...
      const firstPropLineSeparatedGroup = (!firstPropIsUnspecified)
        ? firstPropOrderValue.lineSeparatedGroup
        : lastKnownLineSeparatedGroup
      const secondPropLineSeparatedGroup = (!secondPropIsUnspecified)
        ? secondPropOrderValue.lineSeparatedGroup
        : lastKnownLineSeparatedGroup
      if (firstPropLineSeparatedGroup !== secondPropLineSeparatedGroup) {
        if (!/\r?\n\r?\n/.test(secondPropData.before)) {
          report({
            message: messages.expectedEmptyLineBetween(secondPropData.name, firstPropData.name),
            node,
            result,
            ruleName,
          })
        }
      }
      lastKnownLineSeparatedGroup = secondPropLineSeparatedGroup

      // Now check actual known properties ...
      if (!firstPropIsUnspecified && !secondPropIsUnspecified) {
        return firstPropOrderValue.index <= secondPropOrderValue.index
      }

      // Now deal with unspecified props ...

      if (firstPropIsUnspecified && secondPropIsUnspecified) { return true }

      if (unspecified === "ignore" && (firstPropIsUnspecified || secondPropIsUnspecified)) { return  true }

      if (unspecified === "top" && firstPropIsUnspecified) { return true }
      if (unspecified === "top" && secondPropIsUnspecified) { return false }

      if (unspecified === "bottom" && secondPropIsUnspecified) { return true }
      if (unspecified === "bottom" && firstPropIsUnspecified) { return false }
    }
  }
}

function createExpectedOrder(input) {
  const expectedOrder = {}
  let lineSeparatedGroup = 1
  appendGroup(input, 1)

  function appendGroup(items, startIndex) {
    items.forEach((item, index) => {
      appendItem(item, index + startIndex)
    })
  }

  function appendItem(item, index) {
    if (_.isString(item)) {
      expectedOrder[item] = { index, lineSeparatedGroup }
      return
    }

    if (item.emptyLineBefore) {
      lineSeparatedGroup += 1
    }

    if (!item.order || item.order === "strict") {
      appendGroup(item.properties, index)
      return
    } else if (item.order === "flexible") {
      item.properties.forEach(property => {
        appendItem(property, index)
      })
    }
  }

  return expectedOrder
}

function getOrderValue(expectedOrder, propName) {
  let orderValue = expectedOrder[propName]
  // If prop was not specified but has a hyphen
  // (e.g. `padding-top`), try looking for the segment preceding the hyphen
  // and use that index
  if (!orderValue && propName.indexOf("-") !== -1) {
    const propNamePreHyphen = propName.slice(0, propName.indexOf("-"))
    orderValue = expectedOrder[propNamePreHyphen]
  }
  return orderValue
}
