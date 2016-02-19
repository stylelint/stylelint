import postcss from "postcss"
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

const NAMED_WEIGHTS = [ "normal", "bold", "bolder", "lighter" ]
const RELATIVE_NAMED_WEIGHTS = [ "bolder", "lighter" ]
function isNumbery(x) {
  return Number(x) == x
}

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "numeric", "named" ],
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
      for (let value of postcss.list.space(decl.value)) {
        // We do not need to more carefully distinguish font-weight
        // numbers from unitless line-heights because line-heights in
        // `font` values need to be part of a font-size/line-height pair
        if (isNumbery(value) || NAMED_WEIGHTS.indexOf(value) !== -1) {
          checkWeight(value, decl)
          return
        }
      }
    }

    function checkWeight(weightValue, decl) {
      if (cssWordIsVariable(weightValue)) { return }
      if (optionsHaveIgnored(options, "relative") &&
        RELATIVE_NAMED_WEIGHTS.indexOf(weightValue) !== -1) { return }

      const weightValueOffset = decl.value.indexOf(weightValue)

      if (expectation === "numeric") {
        if (!isNumbery(weightValue)) {
          return complain(messages.expected("numeric"))
        }
      }

      if (expectation === "named") {
        if (isNumbery(weightValue)) {
          return complain(messages.expected("named"))
        }
        if (NAMED_WEIGHTS.indexOf(weightValue) === -1) {
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
