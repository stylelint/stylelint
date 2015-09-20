import { isString } from "lodash"
import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-properties-order"

export const messages = ruleMessages(ruleName, {
  expected: (first, second) => `Expected property "${first}" to come before property "${second}"`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "alphabetical",
        isString,
      ],
    })
    if (!validOptions) { return }

    // Shallow loop
    root.each(node => {
      if (node.type === "rule" || node.type === "atrule") {
        checkInNode(node)
      }
    })

    function checkInNode(node) {

      let previousProp = {}
      let isFirstDecl = true

      node.each(child => {

        if (child.nodes && child.nodes.length) {
          checkInNode(child)
        }

        if (child.type !== "decl") { return }

        const prop = {
          name: child.prop,
          unprefixedName: vendor.unprefixed(child.prop),
        }

        // Skip first decl
        if (isFirstDecl) {
          isFirstDecl = false
          previousProp = prop
          return
        }

        // Same unprefixed property name
        if (prop.unprefixedName === previousProp.unprefixedName
          && prop.name >= previousProp.name) {
          previousProp = prop
          return
        }

        // Different unprefixed property names ...
        if (prop.unprefixedName !== previousProp.unprefixedName) {
          // Alphabetical
          if (expectation === "alphabetical"
            && prop.unprefixedName >= previousProp.unprefixedName) {
            previousProp = prop
            return
          }

          // Array of properties
          if (Array.isArray(expectation)) {

            let propIndex = expectation.indexOf(prop.unprefixedName)
            let previousPropIndex = expectation.indexOf(previousProp.unprefixedName)

            // If either this or prev prop was not found but they have a hyphen
            // (e.g. `padding-top`), try looking for the segment preceding the hyphen
            // and use that index
            if (propIndex === -1 && prop.unprefixedName.indexOf("-") !== -1) {
              const propPreHyphen = prop.unprefixedName.slice(0, prop.unprefixedName.indexOf("-"))
              propIndex = expectation.indexOf(propPreHyphen)
            }
            if (previousPropIndex === -1 && previousProp.unprefixedName.indexOf("-") !== -1) {
              const previousPropPreHyphen = previousProp.unprefixedName.slice(0, previousProp.unprefixedName.indexOf("-"))
              previousPropIndex = expectation.indexOf(previousPropPreHyphen)
            }

            // Check that two known properties are in order
            if (propIndex !== -1 && previousPropIndex !== -1
              && propIndex >= previousPropIndex) {
              previousProp = prop
              return
            }

            // Skip over unknown properties as any subsequent known properties will flag
            if (propIndex === -1) {
              previousProp = prop
              return
            }
          }
        }

        report({
          message: messages.expected(prop.name, previousProp.name),
          node: child,
          result,
          ruleName,
        })

        previousProp = prop
      })
    }
  }
}
