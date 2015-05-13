export const ruleName = "number leading zero"
export const messages = {
  expected: `Expected a leading zero for fractional value less than 1(${ruleName})`,
  rejected: `Unexpected leading zero for fractional value less than 1(${ruleName})`,
}

/**
 * @param {boolean} isOn - If true, expect leading zeros;
 *   if false, reject them
 */
export default function (expectLeadingZero) {
  return (css, result) => {
    css.eachDecl(function (decl) {
      const value = decl.value

      // Get out quickly if there are no periods
      if (value.indexOf(".") === -1) { return }

      if (expectLeadingZero && lacksLeadingZero(value)) {
        result.warn(
          messages.expected,
          { node: decl }
        )
        return
      }

      if (!expectLeadingZero && containsLeadingZero(value)) {
        result.warn(
          messages.rejected,
          { node: decl }
        )
      }
    })
  }
}

function lacksLeadingZero(value) {
  return /(?:\D|^)\.\d+/g.test(value)
}

function containsLeadingZero(value) {
  return /(?:\D|^)0\.\d+/g.test(value)
}
