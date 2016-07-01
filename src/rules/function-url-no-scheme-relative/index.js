import {
  functionArgumentsSearch,
  isStandardSyntaxUrl,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { trim } from "lodash"

export const ruleName = "function-url-no-scheme-relative"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected scheme-relative url",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(function (decl) {
      functionArgumentsSearch(decl.toString().toLowerCase(), "url", (args, index) => {
        const url = trim(args, " '\"")

        if (!isStandardSyntaxUrl(url) || url.indexOf("//") !== 0) { return }

        report({
          message: messages.rejected,
          node: decl,
          index,
          result,
          ruleName,
        })
      })
    })
  }
}
