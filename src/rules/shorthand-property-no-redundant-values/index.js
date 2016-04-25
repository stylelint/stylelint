import valueParser from "postcss-value-parser"
import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "shorthand-property-no-redundant-values"

export const messages = ruleMessages(ruleName, {
  rejected: (unexpected, expected) => `Unexpected longhand value '${unexpected}' instead of '${expected}'`,
})

const shorthandableProperties = new Set([
  "margin",
  "padding",
  "border-color",
  "border-radius",
  "border-style",
  "border-width",
])

const ignoredCharacters = [
  "+", "-", "*", "/", "(", ")",
  "$", "@", "--", "var(",
]

function isIgnoredCharacters(value) {
  return ignoredCharacters.some(char => value.indexOf(char) !== -1)
}

function canCondense(top, right, bottom = null, left = null) {
  if (canCondenseToOneValue(top, right, bottom, left)) {
    return [top]
  } else if (canCondenseToTwoValues(top, right, bottom, left)) {
    return [ top, right ]
  } else if (canCondenseToThreeValues(top, right, bottom, left)) {
    return [ top, right, bottom ]
  } else {
    return [ top, right, bottom, left ]
  }
}

function canCondenseToOneValue(top, right, bottom, left) {
  if (top !== right) { return false }

  return top === bottom && (bottom === left || !left) || !bottom && !left
}

function canCondenseToTwoValues(top, right, bottom, left) {
  return top === bottom && right === left || top === bottom && !left && top !== right
}

function canCondenseToThreeValues(top, right, bottom, left) {
  return right === left
}

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {

      const { prop, value } = decl

      // ignore not shorthandable properties, and math operations
      if (
        isIgnoredCharacters(value) ||
        !shorthandableProperties.has(vendor.unprefixed(prop))
      ) { return }

      const valuesToShorthand = []

      valueParser(value).walk((valueNode) => {
        if (valueNode.type !== "word") { return }

        valuesToShorthand.push(valueParser.stringify(valueNode))
      })

      if (valuesToShorthand.length <= 1
        || valuesToShorthand.length > 4
      ) { return }

      const shortestForm = canCondense(...valuesToShorthand)
      const shortestFormString = shortestForm.filter((value) => { return value }).join(" ")
      const valuesFormString = valuesToShorthand.join(" ")

      if (shortestFormString === valuesFormString) { return }

      report({
        message: messages.rejected(value, shortestFormString),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
