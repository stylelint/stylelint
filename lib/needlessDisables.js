/* @flow */
"use strict"

const _ = require("lodash")

module.exports = function (results/*: Array<stylelint$result>*/)/*: stylelint$needlessDisablesReport*/ {
  const report = []

  results.forEach(result => {
    // File with `CssSyntaxError` have not `_postcssResult`
    if (!result._postcssResult) {
      return
    }

    const unused = { source: result.source, ranges: [] }
    const rangeData = _.cloneDeep(result._postcssResult.stylelint.disabledRanges)

    if (!rangeData) {
      return
    }

    result.warnings.forEach(warning => {
      const rule/*: string*/ = warning.rule

      const ruleRanges = rangeData[rule]
      if (ruleRanges) {
        // Back to front so we get the *last* range that applies to the warning
        for (const range of ruleRanges.reverse()) {
          if (isWarningInRange(warning, range)) {
            range.used = true
            return
          }
        }
      }

      for (const range of rangeData.all.reverse()) {
        if (isWarningInRange(warning, range)) {
          range.used = true
          return
        }
      }
    })

    Object.keys(rangeData).forEach(rule => {
      rangeData[rule].forEach(range => {
        // Is an equivalent range already marked as unused?
        const alreadyMarkedUnused = unused.ranges.find(unusedRange => {
          return unusedRange.start === range.start && unusedRange.end === range.end
        })

        // If this range is unused and no equivalent is marked,
        // mark this range as unused
        if (!range.used && !alreadyMarkedUnused) {
          unused.ranges.push(range)
        }

        // If this range is used but an equivalent has been marked as unused,
        // remove that equivalent. This can happen because of the duplication
        // of ranges in rule-specific range sets and the "all" range set
        if (range.used && alreadyMarkedUnused) {
          _.remove(unused.ranges, alreadyMarkedUnused)
        }
      })
    })

    unused.ranges = _.sortBy(unused.ranges, [ "start", "end" ])

    report.push(unused)
  })

  return report
}

function isWarningInRange(
  warning/*: {
    rule: string,
    line: number,
  }*/,
  range/*: {
    rules?: Array<string>,
    start: number,
    end?: number,
  }*/
)/*: boolean*/ {
  const rule = warning.rule,
    line = warning.line

  // Need to check if range.end exist, because line number type cannot be compared to undefined
  return range.start <= line && (range.end !== undefined && range.end >= line || range.end === undefined) && (!range.rules || range.rules.indexOf(rule) !== -1)
}
