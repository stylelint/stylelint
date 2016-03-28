import postcss from "postcss"
import { includes } from "lodash"
import {
  cssWordIsVariable,
  declarationValueIndexOffset,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "font-weight-notation"

export const messages = ruleMessages(ruleName, {
  expected: type => `Expected ${type} font-weight notation`,
  invalidNamed: name => `Unexpected invalid font-weight name "${name}"`,
})

const WEIGHT_SPECIFIC_KEYWORDS = [ "bold", "bolder", "lighter" ]
const INHERIT_KEYWORD = "inherit"
const INITIAL_KEYWORD = "initial"
const NORMAL_KEYWORD = "normal"
const RELATIVE_NAMED_WEIGHTS = [ "bolder", "lighter" ]
const WEIGHTS_WITH_KEYWORD_EQUIVALENTS = [ "400", "700" ]

function isNumbery(x) {
  return Number(x) == x
}

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "numeric", "named-where-possible" ],
    } , {
      actual: options,
      possible: {
        ignore: ["relative"],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (decl.prop === "font-weight") {
        checkWeight(decl.value, decl)
      }

      if (decl.prop === "font") {
        checkFont(decl)
      }
    })

    function checkFont(decl) {
      const valueList = postcss.list.space(decl.value)
      // We do not need to more carefully distinguish font-weight
      // numbers from unitless line-heights because line-heights in
      // `font` values need to be part of a font-size/line-height pair
      const hasNumericFontWeight = valueList.some(isNumbery)

      for (const value of postcss.list.space(decl.value)) {
        if (
          (value === NORMAL_KEYWORD && !hasNumericFontWeight)
          || isNumbery(value)
          || includes(WEIGHT_SPECIFIC_KEYWORDS, value)
        ) {
          checkWeight(value, decl)
          return
        }
      }
    }

    function checkWeight(weightValue, decl) {
      if (cssWordIsVariable(weightValue)) { return }
      if (weightValue === INHERIT_KEYWORD || weightValue === INITIAL_KEYWORD) { return }

      if (optionsHaveIgnored(options, "relative") &&
        includes(RELATIVE_NAMED_WEIGHTS, weightValue)) { return }

      const weightValueOffset = decl.value.indexOf(weightValue)

      if (expectation === "numeric") {
        if (!isNumbery(weightValue)) {
          return complain(messages.expected("numeric"))
        }
      }

      if (expectation === "named-where-possible") {
        if (isNumbery(weightValue)) {
          if (includes(WEIGHTS_WITH_KEYWORD_EQUIVALENTS, weightValue)) {
            complain(messages.expected("named"))
          }
          return
        }
        if (!includes(WEIGHT_SPECIFIC_KEYWORDS, weightValue)
          && weightValue !== NORMAL_KEYWORD
        ) {
          return complain(messages.invalidNamed(weightValue))
        }
        return
      }

      function complain(message) {
        report({
          ruleName,
          result,
          message,
          node: decl,
          index: declarationValueIndexOffset(decl) + weightValueOffset,
        })
      }
    }
  }
}
