import _ from "lodash"
import { vendor } from "postcss"
import {
  isCustomProperty,
  isStandardSyntaxProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "declaration-block-properties-order"

export const messages = ruleMessages(ruleName, {
  expected: (first, second) => `Expected "${first}" to come before "${second}"`,
  expectedEmptyLineBetween: (first, second) => `Expected an empty line between property "${first}" and property "${second}"`,
  rejectedEmptyLineBetween: (first, second) => `Unexpected empty line between property "${first} and property "${second}"`,
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: validatePrimaryOption,
    }, {
      actual: options,
      possible: {
        unspecified: [ "top", "bottom", "ignore", "bottomAlphabetical" ],
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
      let lastKnownSeparatedGroup = 1

      node.each(child => {
        // If the child has nested nodes with child
        // (e.g. a rule nested within a rule), make
        // sure to check the children
        if (child.nodes && child.nodes.length) {
          checkNode(child)
        }

        if (child.type !== "decl") { return }

        const { prop } = child
        if (!isStandardSyntaxProperty(prop)) { return }
        if (isCustomProperty(prop)) { return }

        let unprefixedPropName = vendor.unprefixed(prop)

        // Hack to allow -moz-osx-font-smoothing to be understood
        // just like -webkit-font-smoothing
        if (unprefixedPropName.indexOf("osx-") === 0) {
          unprefixedPropName = unprefixedPropName.slice(4)
        }

        const propData = {
          name: prop,
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

        complain({
          message: messages.expected(propData.name, previousPropData.name),
          node: child,
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
        const firstPropSeparatedGroup = (!firstPropIsUnspecified)
          ? firstPropData.orderData.separatedGroup
          : lastKnownSeparatedGroup
        const secondPropSeparatedGroup = (!secondPropIsUnspecified)
          ? secondPropData.orderData.separatedGroup
          : lastKnownSeparatedGroup

        if (firstPropSeparatedGroup !== secondPropSeparatedGroup && !secondPropIsUnspecified) {
          // Get an array of just the property groups, remove any solo properties
          const groups = _.reject(expectation, _.isString)

          // secondProp seperatedGroups start at 2 so we minus 2 to get the 1st item
          // from our groups array
          const emptyLineBefore = _.get(groups[secondPropSeparatedGroup - 2], "emptyLineBefore")
          if (emptyLineBefore) {
            result.warn((
              "The 'emptyLineBefore' option for 'declaration-block-properties-order' has been deprecated, "
                + "and will be removed in '7.0'. If you use this option please consider "
                + "creating a plugin for the community."
            ), {
              stylelintType: "deprecation",
              stylelintReference: "http://stylelint.io/user-guide/release-planning/",
            })
          }
          if (!hasEmptyLineBefore(secondPropData.node) && emptyLineBefore === "always") {
            complain({
              message: messages.expectedEmptyLineBetween(secondPropData.name, firstPropData.name),
              node: secondPropData.node,
            })
          } else if (hasEmptyLineBefore(secondPropData.node) && emptyLineBefore === "never") {
            complain({
              message: messages.rejectedEmptyLineBetween(secondPropData.name, firstPropData.name),
              node: secondPropData.node,
            })
          }
        }
        lastKnownSeparatedGroup = secondPropSeparatedGroup

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
            complain({
              message: messages.expected(secondPropData.name, priorSpecifiedPropData.name),
              node: secondPropData.node,
            })
            return true // avoid logging another warning
          }
        }

        // Now deal with unspecified props ...
        // Starting with bottomAlphabetical as it requires more specific conditionals
        if (unspecified === "bottomAlphabetical" && !firstPropIsUnspecified &&
          secondPropIsUnspecified) { return true }

        if (unspecified === "bottomAlphabetical" &&
          secondPropIsUnspecified &&
          firstPropIsUnspecified) {
          if (checkAlpabeticalOrder(firstPropData, secondPropData)) { return true }
          else { return false }
        }
        if (unspecified === "bottomAlphabetical" && firstPropIsUnspecified) { return false }

        if (firstPropIsUnspecified && secondPropIsUnspecified) { return true }

        if (unspecified === "ignore" && (firstPropIsUnspecified || secondPropIsUnspecified)) { return true }

        if (unspecified === "top" && firstPropIsUnspecified) { return true }
        if (unspecified === "top" && secondPropIsUnspecified) { return false }

        if (unspecified === "bottom" && secondPropIsUnspecified) { return true }
        if (unspecified === "bottom" && firstPropIsUnspecified) { return false }
      }
    }

    function complain({ message, node }) {
      report({
        message,
        node,
        result,
        ruleName,
      })
    }
  }
}

function createExpectedOrder(input) {
  const order = {}
  let separatedGroup = 1
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
      order[item] = { separatedGroup, expectedPosition }
      return
    }

    // If item is not a string, it's a group ...
    if (item.emptyLineBefore) {
      separatedGroup += 1
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
  if (/\r?\n\s*\r?\n/.test(decl.raw("before"))) { return true }
  const prevNode = decl.prev()
  if (!prevNode) { return false }
  if (prevNode.type !== "comment") { return false }
  if (/\r?\n\s*\r?\n/.test(prevNode.raw("before"))) { return true }
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

  // Every object-item's "emptyLineBefore" must be "always" or "never"
  if (objectItems.every(item => {
    if (_.isUndefined(item.emptyLineBefore)) { return true }
    return _.includes([ "always", "never" ], item.emptyLineBefore)
  })) { return true }

  // Every object-item's "type" property must be "strict" or "flexible"
  if (objectItems.every(item => {
    if (_.isUndefined(item.type)) { return true }
    return _.includes([ "string", "flexible" ], item.type)
  })) { return true }

  return false
}
