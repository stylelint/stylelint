import { isEqual, isString, transform } from "lodash"
import { optionsMatches, report, ruleMessages, validateOptions } from "../../utils"
import shorthandData from "../../reference/shorthandData"

export const ruleName = "declaration-block-no-redundant-longhand-properties"

export const messages = ruleMessages(ruleName, {
  expected: props => `Expected shorthand property "${props}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreShorthands: [isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    const longhandProperties = transform(shorthandData, (result, values, key) => {
      if (optionsMatches(options, "ignoreShorthands", key)) {
        return
      }

      values.forEach(value => {
        (result[value] || (result[value] = [])).push(key)
      })
    })

    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      const longhandDeclarations = {}
      // Shallow iteration so nesting doesn't produce
      // false positives
      statement.each(node => {
        if (node.type !== "decl") {
          return
        }

        const prop = node.prop.toLowerCase()

        const shorthandProperties = longhandProperties[prop]

        if (!shorthandProperties) {
          return
        }

        shorthandProperties.forEach(shorthandProperty => {
          (longhandDeclarations[shorthandProperty] || (longhandDeclarations[shorthandProperty] = [])).push(prop)

          if (!isEqual(shorthandData[shorthandProperty].sort(), longhandDeclarations[shorthandProperty].sort())) {
            return
          }

          report({
            ruleName,
            result,
            node,
            message: messages.expected(shorthandProperty),
          })
        })
      })
    }
  }
}
