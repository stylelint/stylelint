import {
  findLastIndex,
  findIndex,
  range
} from "lodash"
import {
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "number-zero-length-no-unit"
export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected unit on zero length value",
})

// Only length units can be left off
// cf. http://www.w3.org/TR/css3-values/#length-value
// cf. https://github.com/brigade/scss-lint/issues/154
const lengthUnits = new Set([
  "em", "ex", "ch", "vw", "vh", "cm", "mm", "in", "pt", "pc", "px",
  "rem",
  "vmin", "vmax",
])

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value
      const ignorableIndexes = new Set()

      styleSearch({ source: value, target: "0" }, match => {
        const index = match.startIndex

        // Given a 0 somewhere in the full property value (not in a string, thanks
        // to styleSearch) we need to isolate the value that contains the zero.
        // To do so, we'll find the last index before the 0 of a character that would
        // divide one value in a list from another, and the next index of such a
        // character; then we build a substring from those indexes, which we can
        // assess.

        // If a single value includes multiple 0's (e.g. 100.01px), we don't want
        // each 0 to be treated as a separate value, possibly resulting in multiple
        // warnings for the same value (e.g. 0.00px).
        //
        // This check prevents that from happening: we build and check against a
        // Set containing all the indexes that are part of a value already validated.
        if (ignorableIndexes.has(index)) { return }

        const prevValueBreakIndex = findLastIndex(value.substr(0, index), char => {
          return [ " ", ",", ")", "(", "#" ].indexOf(char) !== -1
        })

        // Ignore hex colors
        if (value[prevValueBreakIndex] === "#") { return }

        // If no prev break was found, this value starts at 0
        const valueWithZeroStart = (prevValueBreakIndex === -1)
          ? 0
          : prevValueBreakIndex + 1

        const nextValueBreakIndex = findIndex(value.substr(valueWithZeroStart), char => {
          return [ " ", ",", ")" ].indexOf(char) !== -1
        })

        // If no next break was found, this value ends at the end of the string
        const valueWithZeroEnd = (nextValueBreakIndex === -1)
          ? value.length
          : nextValueBreakIndex + valueWithZeroStart

        const valueWithZero = value.slice(valueWithZeroStart, valueWithZeroEnd)

        // Add the indexes to ignorableIndexes so the same value will not
        // be checked multiple times.
        range(valueWithZeroStart, valueWithZeroEnd).forEach(i => ignorableIndexes.add(i))

        // Only pay attention if the value parses to 0
        if (parseInt(valueWithZero, 10) !== 0) { return }

        // If there is not a length unit at the end of this value, ignore.
        // (Length units are 2, 3, or 4 characters)
        if (
          !lengthUnits.has(valueWithZero.slice(-2))
          && !lengthUnits.has(valueWithZero.slice(-3))
          && !lengthUnits.has(valueWithZero.slice(-4))
        ) { return }

        result.warn(messages.rejected, { node: decl })
      })
    })
  }
}
