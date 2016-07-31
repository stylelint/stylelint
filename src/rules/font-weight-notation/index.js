import {
  declarationValueIndex,
  isNumbery,
  isStandardSyntaxValue,
  isVariable,
  optionsHasKeyword,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  fontWeightKeywords,
  fontWeightRelativeKeywords,
} from "../../reference/keywordSets"
import { includes } from "lodash"
import postcss from "postcss"

export const ruleName = "font-weight-notation"

export const messages = ruleMessages(ruleName, {
  expected: type => `Expected ${type} font-weight notation`,
  invalidNamed: name => `Unexpected invalid font-weight name "${name}"`,
})

const INHERIT_KEYWORD = "inherit"
const INITIAL_KEYWORD = "initial"
const NORMAL_KEYWORD = "normal"
const WEIGHTS_WITH_KEYWORD_EQUIVALENTS = [ "400", "700" ]

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "numeric", "named-where-possible" ],
    }, {
      actual: options,
      possible: {
        ignore: ["relative"],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (decl.prop.toLowerCase() === "font-weight") {
        checkWeight(decl.value, decl)
      }

      if (decl.prop.toLowerCase() === "font") {
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
          (value.toLowerCase() === NORMAL_KEYWORD && !hasNumericFontWeight)
          || isNumbery(value)
          || value.toLowerCase() !== NORMAL_KEYWORD && fontWeightKeywords.has(value.toLowerCase())
        ) {
          checkWeight(value, decl)
          return
        }
      }
    }

    function checkWeight(weightValue, decl) {
      if (!isStandardSyntaxValue(weightValue)) { return }
      if (isVariable(weightValue)) { return }
      if (weightValue.toLowerCase() === INHERIT_KEYWORD
        || weightValue.toLowerCase() === INITIAL_KEYWORD
      ) { return }

      if (optionsHasKeyword(options, "ignore", "relative") &&
        fontWeightRelativeKeywords.has(weightValue.toLowerCase())) { return }

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
        if (!fontWeightKeywords.has(weightValue.toLowerCase())
          && weightValue.toLowerCase() !== NORMAL_KEYWORD
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
          index: declarationValueIndex(decl) + weightValueOffset,
        })
      }
    }
  }
}
