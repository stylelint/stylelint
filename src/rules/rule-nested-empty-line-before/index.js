import {
  ruleMessages,
  validateOptions
} from "../../utils"

import { checkRuleEmptyLineBefore } from "../rule-non-nested-empty-line-before"

export const ruleName = "rule-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: `Expected empty line before nested rule`,
  rejected: `Unexpected empty line before nested rule`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 * @param {object} options
 * @param {array} options.except - ["first-nested", "after-comment"]
 * @param {array} options.ignore - ["after-comment"]
 */
export default function (expectation, options) {
  return (root, result) => {
    validateOptions({ ruleName, result,
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    validateOptions({ ruleName, result,
      actual: options,
      possible: {
        ignore: [
          "after-comment",
        ],
        except: [
          "first-nested",
          "after-comment",
        ],
      },
    })

    root.eachRule(rule => {

      // Only attend to nested rule sets
      if (rule.parent === root) { return }

      checkRuleEmptyLineBefore(rule, expectation, options, result, messages)
    })
  }
}
