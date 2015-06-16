import { vendor } from "postcss"
import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "rule-properties-order"

export const messages = ruleMessages(ruleName, {
  expected: (first, second) => `Expected property "${first}" to come before property "${second}" `,
})

export default function (expectation) {
  return function (css, result) {

    css.eachRule(function (rule) {

      // return early if an empty block
      if (rule.nodes.length === 0) { return }

      let previousProp = {}
      let isFirstDecl = true

      rule.eachDecl(function (decl) {

        const prop = {
          name: decl.prop,
          unprefixedName: vendor.unprefixed(decl.prop),
        }

        // skip first decl
        if (isFirstDecl) {
          isFirstDecl = false
          previousProp = prop
          return
        }

        // same unprefixed property name
        if (prop.unprefixedName === previousProp.unprefixedName
          && prop.name >= previousProp.name) {
          previousProp = prop
          return
        }

        // different unprefixed property names
        if (prop.unprefixedName !== previousProp.unprefixedName) {

          // alphabetical
          if (expectation === "alphabetical"
            && prop.unprefixedName >= previousProp.unprefixedName) {
            previousProp = prop
            return
          }

          // array of properties
          if (Array.isArray(expectation)) {

            const propIndex = expectation.indexOf(prop.unprefixedName)
            const previousPropIndex = expectation.indexOf(previousProp.unprefixedName)

            // check that two known properties are in order
            if (propIndex !== -1 && previousPropIndex !== -1
              && propIndex >= previousPropIndex) {
              previousProp = prop
              return
            }

            // skip over unknown properties as any subsequent known properties will flag
            if (propIndex === -1) {
              previousProp = prop
              return
            }
          }
        }

        report({
          message: messages.expected(prop.name, previousProp.name),
          node: decl,
          result,
          ruleName,
        })

        previousProp = prop
      })
    })
  }
}
