import postcss from "postcss"
import test from "tape"

/**
 * Create a ruleTester for a specified rule.
 *
 * The ruleTester is a function accepting options and a callback.
 * The callback is passed on object exposing `ok` and `notOk` functions,
 * which check CSS strings against the rule configured with the specified options.
 *
 * @param {function} rule
 * @param {string} ruleName
 * @param {object} [testerOptions]
 * @param {function[]} [testerOptions.preceedingPlugins] - Array of PostCSS plugins to
 *   run the CSS string through *before* linting it
 * @param {boolean} [testerOptions.escapeCss = true] - If `false`, the CSS string printed
 *   to the console will not be escaped.
 *   This is useful if you want to read newlines and indentation.
 * @param {boolean} [testerOptions.printWarnings = false] - If `true`, the tester
 *   will print all the warnings that each test case produces.
 * @param {object} [testerOptions.postcssOptions] - An objects object passed
 *   to postcssProcessor.process().
 *   cf. https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts
 * @return {function} ruleTester for the specified rule/options
 */
export default function (rule, ruleName, testerOptions = {}) {
  testerOptions.escapeCss = testerOptions.escapeCss !== false

  return ruleTester

  function ruleTester(rulePrimaryOptions, ruleSecondaryOptions, done) {
    if (typeof ruleSecondaryOptions === "function") {
      done = ruleSecondaryOptions
      ruleSecondaryOptions = null
    }

    let ruleOptionsString = (rulePrimaryOptions) ? JSON.stringify(rulePrimaryOptions) : ""
    if (ruleOptionsString && ruleSecondaryOptions) {
      ruleOptionsString += ", " + JSON.stringify(ruleSecondaryOptions)
    }

    done({ ok, notOk })

    /**
     * Checks that a CSS string is valid according to the
     * specified rule/options.
     *
     * @param {string} cssString
     * @param {string} [description]
     */
    function ok(cssString, description) {
      test(testTitleStr(cssString), t => {
        t.plan(1)
        postcssProcess(cssString).then(result => {
          const warnings = result.warnings()
          if (testerOptions.printWarnings) {
            warnings.forEach(warning => {
              t.comment("warning: " + warning.text)
            })
          }
          t.equal(warnings.length, 0, prepender(description, "should pass"))
        }).catch(err => { console.log(err.stack) })
      })
    }

    /**
     * Checks that a CSS string is INVALID according to the
     * specified rule/options -- i.e. that a warning is registered
     * with the expected warning message.
     *
     * @param {string} cssString
     * @param {string|object} expectedWarning
     * @param {string} [expectedWarning.message]
     * @param {string} [expectedWarning.line]
     * @param {string} [expectedWarning.column]
     * @param {string} [description]
     */
    function notOk(cssString, expectedWarning, description) {
      test(testTitleStr(cssString), t => {
        const expectedWarningMessage = (typeof expectedWarning === "string")
          ? expectedWarning
          : expectedWarning.message
        t.plan(4)
        postcssProcess(cssString).then(result => {
          const allActualWarnings = result.warnings()

          if (testerOptions.printWarnings) {
            allActualWarnings.forEach(warning => {
              t.comment("warning: " + warning.text)
            })
          }
          t.equal(allActualWarnings.length, 1, prepender(description, "should warn"))

          const actualWarning = allActualWarnings[0]

          if (actualWarning) {
            t.equal(actualWarning.text, expectedWarningMessage,
              prepender(description, "warning message should be \"" + expectedWarningMessage + "\""))
          } else { t.pass("no warning to check") }
          if (actualWarning && expectedWarning.line) {
            t.equal(actualWarning.line, expectedWarning.line,
              prepender(description, "warning should be at line " + expectedWarning.line))
          } else { t.pass("no line number expected") }
          if (actualWarning && expectedWarning.column) {
            t.equal(actualWarning.column, expectedWarning.column,
              prepender(description, "warning should be at column " + expectedWarning.column))
          } else { t.pass("no column number expected") }
        }).catch(err => { console.log(err.stack) })
      })
    }

    function postcssProcess(cssString) {
      const processor = postcss()

      if (testerOptions.preceedingPlugins) {
        testerOptions.preceedingPlugins.forEach(plugin => {
          processor.use(plugin)
        })
      }

      return processor
        .use(rule(rulePrimaryOptions, ruleSecondaryOptions))
        .process(cssString, testerOptions.postcssOptions)
    }

    function testTitleStr(css) {
      let result = "\ncss: "
      if (testerOptions.escapeCss) {
        result += JSON.stringify(css)
      } else {
        result += "\n" + css
      }
      result += "\nrule: " + ruleName
      result += "\noptions: " + ruleOptionsString
      return result
    }
  }
}

function prepender(a, b) {
  if (a) {
    return a + " " + b
  }
  return b
}
