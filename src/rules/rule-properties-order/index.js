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
      possible: validatePrimaryOption,
    }, {
      actual: options,
      possible: {
        unspecified: [ "top", "bottom", "ignore" ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    const alphabetical = expectation === "alphabetical"
    const expectedOrder = (alphabetical) ? null : createExpectedOrder(expectation)
    // By default, ignore unspecified properties
    const unspecified = _.get(options, ["unspecified"], "ignore")

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
        // If the child has nested nodes with child
        // (e.g. a rule nested within a rule), make
        // sure to check the children
        if (child.nodes && child.nodes.length) {
          checkNode(child)
        }

        if (child.type !== "decl") { return }

        if (cssPropertyIsVariable(child.prop)) { return }

        let unprefixedPropName = vendor.unprefixed(child.prop)

        // Hack to allow -moz-osx-font-smoothing to be understood
        // just like -webkit-font-smoothing
        if (unprefixedPropName.indexOf("osx-") === 0) {
          unprefixedPropName = unprefixedPropName.slice(4)
        }

        const propData = {
          name: child.prop,
          unprefixedName: unprefixedPropName,
          orderData: (alphabetical) ? null : getOrderData(expectedOrder, unprefixedPropName),
          before: child.raw("before"),
          index: allPropData.length,
          node: child,
        }

        const previousPropData = _.last(allPropData)
        allPropData.push(propData)

        // Skip first decl
        if (!previousPropData) { return }

        const isCorrectOrder = (alphabetical)
          ? checkAlpabeticalOrder(previousPropData, propData)
          : checkOrder(previousPropData, propData)

        if (isCorrectOrder) { return }

        report({
          message: messages.expected(propData.name, previousPropData.name),
          node: child,
          result,
          ruleName,
        })
      })

      function checkOrder(firstPropData, secondPropData) {
        // If the unprefixed property names are the same, resort to alphabetical ordering
        if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
          return firstPropData.name <= secondPropData.name
        }

        const firstPropIsUnspecified = !firstPropData.orderData
        const secondPropIsUnspecified = !secondPropData.orderData

        // Now check newlines between ...
        const firstPropLineSeparatedGroup = (!firstPropIsUnspecified)
          ? firstPropData.orderData.lineSeparatedGroup
          : lastKnownLineSeparatedGroup
        const secondPropLineSeparatedGroup = (!secondPropIsUnspecified)
          ? secondPropData.orderData.lineSeparatedGroup
          : lastKnownLineSeparatedGroup
        if (firstPropLineSeparatedGroup !== secondPropLineSeparatedGroup) {
          if (!hasEmptyLineBefore(secondPropData.node)) {
            report({
              message: messages.expectedEmptyLineBetween(secondPropData.name, firstPropData.name),
              node: secondPropData.node,
              result,
              ruleName,
            })
          }
        }
        lastKnownLineSeparatedGroup = secondPropLineSeparatedGroup

        // Now check actual known properties ...
        if (!firstPropIsUnspecified && !secondPropIsUnspecified) {
          return firstPropData.orderData.expectedPosition <= secondPropData.orderData.expectedPosition
        }

        if (firstPropIsUnspecified && !secondPropIsUnspecified) {
          // If first prop is unspecified, look for a specified prop before it to
          // compare to the current prop
          const priorSpecifiedPropData = _.findLast(allPropData.slice(0, -1), d => !!d.orderData)
          if (
            priorSpecifiedPropData && priorSpecifiedPropData.orderData
            && priorSpecifiedPropData.orderData.expectedPosition > secondPropData.orderData.expectedPosition
          ) {
            report({
              message: messages.expected(secondPropData.name, priorSpecifiedPropData.name),
              node: secondPropData.node,
              result,
              ruleName,
            })
            return true // avoid logging another warning
          }
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
}

function createExpectedOrder(input) {
  const order = {}
  let lineSeparatedGroup = 1
  let expectedPosition = 0

  appendGroup(input, 1)

  function appendGroup(items) {
    items.forEach(item => appendItem(item, false))
  }

  function appendItem(item, inFlexibleGroup) {
    if (_.isString(item)) {
      // In flexible groups, the expectedPosition does not ascend
      // to make that flexibility work;
      // otherwise, it will always ascend
      if (!inFlexibleGroup) { expectedPosition += 1 }
      order[item] = { lineSeparatedGroup, expectedPosition }
      return
    }

    // If item is not a string, it's a group ...

    if (item.emptyLineBefore) {
      lineSeparatedGroup += 1
    }

    if (!item.order || item.order === "strict") {
      appendGroup(item.properties)
      return
    } else if (item.order === "flexible") {
      expectedPosition += 1
      item.properties.forEach(property => {
        appendItem(property, true)
      })
    }
  }
  return order
}

function getOrderData(expectedOrder, propName) {
  let orderData = expectedOrder[propName]
  // If prop was not specified but has a hyphen
  // (e.g. `padding-top`), try looking for the segment preceding the hyphen
  // and use that index
  if (!orderData && propName.lastIndexOf("-") !== -1) {
    const propNamePreHyphen = propName.slice(0, propName.lastIndexOf("-"))
    orderData = getOrderData(expectedOrder, propNamePreHyphen)
  }
  return orderData
}

function hasEmptyLineBefore(decl) {
  if (/\r?\n\r?\n/.test(decl.raw("before"))) { return true }
  const prevNode = decl.prev()
  if (!prevNode) { return false }
  if (prevNode.type !== "comment") { return false }
  if (/\r?\n\r?\n/.test(prevNode.raw("before"))) { return true }
  return false
}

function checkAlpabeticalOrder(firstPropData, secondPropData) {
  // If unprefixed prop names are the same, compare the prefixed versions
  if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
    return firstPropData.name <= secondPropData.name
  }

  return firstPropData.unprefixedName < secondPropData.unprefixedName
}

function validatePrimaryOption(actualOptions) {
  if (actualOptions === "alphabetical") { return true }

  if (!Array.isArray(actualOptions)) { return false }

  // Every item in the array must be a string or an object
  // with a "properties" property
  if (actualOptions.every(item => {
    if (_.isString(item)) { return true }
    return _.isPlainObject(item) && !_.isUndefined(item.properties)
  })) { return true }

  const objectItems = actualOptions.filter(_.isPlainObject)

  // Every object-item's "emptyLineBefore" property must be a boolean
  if (objectItems.every(item => {
    if (_.isUndefined(item.emptyLineBefore)) { return true }
    return _.isBoolean(item.emptyLineBefore)
  })) { return true }

  // Every object-item's "type" property must be "strict" or "flexible"
  if (objectItems.every(item => {
    if (_.isUndefined(item.type)) { return true }
    return _.includes([ "string", "flexible" ], item.type)
  })) { return true }

  return false
}
