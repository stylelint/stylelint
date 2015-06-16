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

      let previousProp = {
        name: "",
        unprefixedName: "",
      }

      rule.eachDecl(function (decl) {

        const prop = {
          name: decl.prop,
          unprefixedName: vendor.unprefixed(decl.prop),
        }

        // same base property name
        if (prop.unprefixedName === previousProp.unprefixedName
          && prop.name >= previousProp.name) {
          previousProp = prop
          return
        }

        // different base property name
        if (prop.unprefixedName !== previousProp.unprefixedName
          // expecting alphabetical?
          && (expectation === "alphabetical"
            && prop.unprefixedName >= previousProp.unprefixedName
            // or in array order?
            || Array.isArray(expectation)
              && expectation.indexOf(prop.unprefixedName) >= expectation.indexOf(previousProp.unprefixedName))) {
          previousProp = prop
          return
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
