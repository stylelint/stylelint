import postcss from "postcss"
import scssSyntax from "postcss-scss"
import _ from "lodash"
import normalizeRuleSettings from "../normalizeRuleSettings"
import disableRanges from "../disableRanges"
import basicChecks from "./basicChecks"

/**
 * Create a stylelint rule testing function.
 *
 * Pass in an `equalityCheck` function. Given some information,
 * this checker should use Whatever Test Runner to perform
 * equality checks.
 *
 * `equalityCheck` should accept two arguments:
 * - `processCss` {Promise}: A Promise that resolves with an array of
 *   comparisons that you need to check (documented below).
 * - `context` {object}: An object that contains additional information
 *   you may need:
 *   - `caseDescription` {string}: A description of the test case as a whole.
 *   	 Will look like this:
 *   	   > rule: value-list-comma-space-before
 *   	   > config: "always-single-line"
 *   	   > code: "a { background-size: 0 ,0;\n}"
 *   - `comparisonCount` {number}: The number of comparisons that
 *     will need to be performed (e.g. useful for tape).
 *   - `completeAssertionDescription` {string}: While each individual
 *   	 comparison may have its own description, this is a description
 *   	 of the whole assertion (e.g. useful for Mocha).
 *
 * `processCss` is a Promsie that resolves with an array of comparisons.
 * Each comparison has the following properties:
 * - `actual` {any}: Some actual value.
 * - `expected` {any}: Some expected value.
 * - `description` {string}: A (possibly empty) description of the comparison.
 *
 * Within `equalityCheck`, you need to ensure that you:
 * - Set up the test case.
 * - When `processCss` resolves, loop through every comparison.
 * - For each comparison, make an assertion checking that `actual === expected`.
 *
 * The `testRule` function that you get has a simple signature:
 * `testRule(rule, testGroupDescription)`.
 *
 * `rule` is just the rule that you are testing (a function).
 *
 * `testGroupDescription` is an object fitting the following schema.
 *
 * Required properties:
 * - `ruleName` {string}: The name of the rule. Used in descriptions.
 * - `config` {any}: The rule's configuration for this test group.
 *   Should match the format you'd use in `.stylelintrc`.
 * - `accept` {array}: An array of objects describing test cases that
 *   should not violate the rule. Each object has these properties:
 *   - `code` {string}: The source CSS to check.
 *   - `description` {[string]}: An optional description of the case.
 * - `reject` {array}: An array of objects describing test cases that
 *   should violate the rule once. Each object has these properties:
 *   - `code` {string}: The source CSS to check.
 *   - `message` {string}: The message of the expected violation.
 *   - `line` {[number]}: The expected line number of the violation.
 *     If this is left out, the line won't be checked.
 *   - `column` {[number]}: The expected column number of the violation.
 *     If this is left out, the column won't be checked.
 *   - `description` {[string]}: An optional description of the case.
 *
 * Optional properties:
 * - `syntax` {"css"|"scss"}: Defaults to `"css"`. Set to `"scss"` to
 *   run a test that uses `postcss-scss` to parse.
 * - `skipBasicChecks` {boolean}: Defaults to `false`. If `true`, a
 *   few rudimentary checks (that should almost always be included)
 *   will not be performed.
 * - `preceedingPlugins` {array}: An array of PostCSS plugins that
 *   should be run before the CSS is tested.
 *
 * @param {function} equalityCheck - Described above
 * @return {function} testRule - Decsribed above
 */
export default function (equalityCheck) {
  return function (rule, schema) {
    const { ruleName } = schema
    const ruleOptions = normalizeRuleSettings(schema.config)
    const rulePrimaryOptions = ruleOptions[0]
    const ruleSecondaryOptions = ruleOptions[1]

    let printableConfig = (rulePrimaryOptions) ? JSON.stringify(rulePrimaryOptions) : ""
    if (printableConfig && ruleSecondaryOptions) {
      printableConfig += ", " + JSON.stringify(ruleSecondaryOptions)
    }

    function createCaseDescription(code) {
      let text = `\n> rule: ${ruleName}\n`
      text += `> config: ${printableConfig}\n`
      text += `> code: ${JSON.stringify(code)}\n`
      return text
    }

    // Process the code through the rule and return
    // the PostCSS LazyResult promise
    function postcssProcess(code) {
      const postcssProcessOptions = {}
      if (schema.syntax === "scss") {
        postcssProcessOptions.syntax = scssSyntax
      }
      const processor = postcss()
      processor.use(disableRanges)

      if (schema.preceedingPlugins) {
        schema.preceedingPlugins.forEach(processor.use)
      }

      return processor
        .use(rule(rulePrimaryOptions, ruleSecondaryOptions))
        .process(code, postcssProcessOptions)
    }

    // Apply the basic positive checks unless
    // explicitly told not to
    const passingTestCases = (schema.skipBasicChecks)
      ? schema.accept
      : basicChecks.concat(schema.accept)

    if (passingTestCases && passingTestCases.length) {
      passingTestCases.forEach(acceptedCase => {
        if (!acceptedCase) { return }
        const assertionDescription = spaceJoin(acceptedCase.description, "should be accepted")
        const resultPromise = postcssProcess(acceptedCase.code).then(postcssResult => {
          const warnings = postcssResult.warnings()
          return [{
            expected: 0,
            actual: warnings.length,
            description: assertionDescription,
          }]
        })
        equalityCheck(resultPromise, {
          comparisonCount: 1,
          caseDescription: createCaseDescription(acceptedCase.code),
          completeAssertionDescription: assertionDescription,
        })
      })
    }

    if (schema.reject) {
      schema.reject.forEach(rejectable => {
        let completeAssertionDescription = "should register one warning"
        let comparisonCount = 1
        if (rejectable.line) {
          comparisonCount++
          completeAssertionDescription += ` on line ${rejectable.line}`
        }
        if (rejectable.column) {
          comparisonCount++
          completeAssertionDescription += ` on column ${rejectable.column}`
        }
        if (rejectable.message) {
          comparisonCount++
          completeAssertionDescription += ` with message "${rejectable.message}"`
        }

        const resultPromise = postcssProcess(rejectable.code).then(postcssResult => {
          const warnings = postcssResult.warnings()
          const comparisons = [{
            expected: 1,
            actual: warnings.length,
            description: spaceJoin(rejectable.description, "should register one warning"),
          }]
          if (!warnings.length) return comparisons

          const warning = warnings[0]

          if (rejectable.line) {
            comparisons.push({
              expected: rejectable.line,
              actual: warning.line,
              description: spaceJoin(rejectable.description, `should warn on line ${rejectable.line}`),
            })
          }
          if (rejectable.column !== undefined) {
            comparisons.push({
              expected: rejectable.column,
              actual: warning.column,
              description: spaceJoin(rejectable.description, `should warn on column ${rejectable.column}`),
            })
          }
          if (rejectable.message) {
            comparisons.push({
              expected: rejectable.message,
              actual: warning.text,
              description: spaceJoin(rejectable.description, `should warn with message ${rejectable.message}`),
            })
          }
          return comparisons
        })

        equalityCheck(resultPromise, {
          comparisonCount,
          completeAssertionDescription,
          caseDescription: createCaseDescription(rejectable.code),
        })
      })
    }
  }
}

function spaceJoin(...args) {
  return _.compact(args).join(" ")
}
