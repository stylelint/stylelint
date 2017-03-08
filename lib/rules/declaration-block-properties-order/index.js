"use strict"

const isCustomProperty = require("../../utils/isCustomProperty")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const postcss = require("postcss")

const ruleName = "declaration-block-properties-order"

const messages = ruleMessages(ruleName, {
  expected: (first, second) => `Expected "${first}" to come before "${second}"`,
})

const rule = function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: validatePrimaryOption,
    }, {
      actual: options,
      possible: {
        unspecified: [
          "top",
          "bottom",
          "ignore",
          "bottomAlphabetical",
        ],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    result.warn((
      "'declaration-block-properties-order'has been deprecated and in 8.0 will be removed. " +
      "Instead use the community 'stylelint-order' plugin pack."
    ), {
      stylelintType: "deprecation",
      stylelintReference: "https://stylelint.io/user-guide/rules/declaration-block-properties-order/",
    })

    const alphabetical = expectation === "alphabetical"
    const expectedOrder = alphabetical ? null : createExpectedOrder(expectation)
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

      node.each(child => {
        // If the child has nested nodes with child
        // (e.g. a rule nested within a rule), make
        // sure to check the children
        if (child.nodes && child.nodes.length) {
          checkNode(child)
        }

        if (child.type !== "decl") {
          return
        }

        const prop = child.prop

        if (!isStandardSyntaxProperty(prop)) {
          return
        }
        if (isCustomProperty(prop)) {
          return
        }

        let unprefixedPropName = postcss.vendor.unprefixed(prop)

        // Hack to allow -moz-osx-font-smoothing to be understood
        // just like -webkit-font-smoothing
        if (unprefixedPropName.indexOf("osx-") === 0) {
          unprefixedPropName = unprefixedPropName.slice(4)
        }

        const propData = {
          name: prop,
          unprefixedName: unprefixedPropName,
          orderData: alphabetical ? null : getOrderData(expectedOrder, unprefixedPropName),
          before: child.raws.before,
          index: allPropData.length,
          node: child,
        }

        const previousPropData = _.last(allPropData)
        allPropData.push(propData)

        // Skip first decl
        if (!previousPropData) {
          return
        }

        const isCorrectOrder = alphabetical ? checkAlpabeticalOrder(previousPropData, propData) : checkOrder(previousPropData, propData)

        if (isCorrectOrder) {
          return
        }

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

        // Now check actual known properties ...
        if (!firstPropIsUnspecified && !secondPropIsUnspecified) {
          return firstPropData.orderData.expectedPosition <= secondPropData.orderData.expectedPosition
        }

        if (firstPropIsUnspecified && !secondPropIsUnspecified) {
          // If first prop is unspecified, look for a specified prop before it to
          // compare to the current prop
          const priorSpecifiedPropData = _.findLast(allPropData.slice(0, -1), d => !!d.orderData)
          if (priorSpecifiedPropData && priorSpecifiedPropData.orderData && priorSpecifiedPropData.orderData.expectedPosition > secondPropData.orderData.expectedPosition) {
            complain({
              message: messages.expected(secondPropData.name, priorSpecifiedPropData.name),
              node: secondPropData.node,
            })
            return true // avoid logging another warning
          }
        }

        // Now deal with unspecified props ...
        // Starting with bottomAlphabetical as it requires more specific conditionals
        if (unspecified === "bottomAlphabetical" && !firstPropIsUnspecified && secondPropIsUnspecified) {
          return true
        }

        if (unspecified === "bottomAlphabetical" && secondPropIsUnspecified && firstPropIsUnspecified) {
          if (checkAlpabeticalOrder(firstPropData, secondPropData)) {
            return true
          } else {
            return false
          }
        }
        if (unspecified === "bottomAlphabetical" && firstPropIsUnspecified) {
          return false
        }

        if (firstPropIsUnspecified && secondPropIsUnspecified) {
          return true
        }

        if (unspecified === "ignore" && (firstPropIsUnspecified || secondPropIsUnspecified)) {
          return true
        }

        if (unspecified === "top" && firstPropIsUnspecified) {
          return true
        }
        if (unspecified === "top" && secondPropIsUnspecified) {
          return false
        }

        if (unspecified === "bottom" && secondPropIsUnspecified) {
          return true
        }
        if (unspecified === "bottom" && firstPropIsUnspecified) {
          return false
        }
      }
    }

    function complain(opts) {
      report({
        message: opts.message,
        node: opts.node,
        result,
        ruleName,
      })
    }
  }
}

rule.primaryOptionArray = true

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

function createExpectedOrder(input) {
  const order = {}
  let expectedPosition = 0

  appendGroup(input)

  function appendGroup(items) {
    items.forEach(item => appendItem(item, false))
  }

  function appendItem(item, inFlexibleGroup) {
    if (_.isString(item)) {
      // In flexible groups, the expectedPosition does not ascend
      // to make that flexibility work;
      // otherwise, it will always ascend
      if (!inFlexibleGroup) {
        expectedPosition += 1
      }
      order[item] = { expectedPosition }
      return
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

function checkAlpabeticalOrder(firstPropData, secondPropData) {
  // If unprefixed prop names are the same, compare the prefixed versions
  if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
    return firstPropData.name <= secondPropData.name
  }

  return firstPropData.unprefixedName < secondPropData.unprefixedName
}

function validatePrimaryOption(actualOptions) {
  // Return true early if alphabetical
  if (actualOptions === "alphabetical") {
    return true
  }

  // Otherwise, begin checking array options
  if (!Array.isArray(actualOptions)) {
    return false
  }

  // Every item in the array must be a string or an object
  // with a "properties" property
  if (!actualOptions.every(item => {
    if (_.isString(item)) {
      return true
    }
    return _.isPlainObject(item) && !_.isUndefined(item.properties)
  })) {
    return false
  }

  const objectItems = actualOptions.filter(_.isPlainObject)

  // Every object-item's "order" property must be "strict" or "flexible"
  if (!objectItems.every(item => {
    if (_.isUndefined(item.order)) {
      return true
    }
    return _.includes([
      "strict",
      "flexible",
    ], item.order)
  })) {
    return false
  }

  return true
}
