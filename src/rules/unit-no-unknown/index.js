import { isString } from "lodash"
import valueParser from "postcss-value-parser"

import {
  cssWordIsVariable,
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "unit-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (u) => `Unexpected unknown unit "${u}"`,
})

const knownUnits = new Set([
  // Relative length units
  "em", "ex", "ch", "rem", "%",
  // Viewport-percentage lengths
  "vh", "vw", "vmin", "vmax", "vm",
  // Absolute length units
  "px", "mm", "cm", "in", "pt", "pc",
  // Time length units
  "s", "ms",
  // Angle
  "deg", "grad", "turn", "rad",
])

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignore: [isString],
      },
      optional: true,
    })

    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { value } = decl

      valueParser(value).walk(function (node) {
        if (node.type === "function" && node.value === "url") { return false }
        if (node.type === "string"
          || node.type === "div"
          || node.type === "space"
          || node.type === "comment"
          || node.type === "function"
          || cssWordIsVariable(node.value)
        ) { return }

        const unit = valueParser.unit(node.value).unit
        const ignore = options && options.ignore || []

        if (!unit || knownUnits.has(unit) || ignore.indexOf(unit) !== -1) { return }

        report({
          message: messages.rejected(unit),
          node: decl,
          index: declarationValueIndexOffset(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
