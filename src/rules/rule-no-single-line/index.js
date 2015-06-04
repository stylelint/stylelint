import isSingleLineString from "../../utils/isSingleLineString"

export const ruleName = "rule-no-single-line"
export const messages = {
  rejected: `Unexpected single-line rule (${ruleName})`,
}

/**
 * @param {boolean} isOn - If true, reject single-line rule sets;
 *   if false, do nothing
 */
export default function (isOn) {
  return function (css, result) {
    if (!isOn) { return }

    css.eachRule(function (rule) {
      if (!isSingleLineString(rule.toString())) { return }

      result.warn(
        messages.rejected,
        { node: rule }
      )
    })
  }
}
