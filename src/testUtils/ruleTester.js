import postcss from "postcss"
import jsesc from "jsesc"
import test from "tape"

/**
 * Create a ruleTester for a specified rule.
 *
 * The ruleTester is a function accepting options and a callback.
 * The callback is passed on object exposing functions that
 * check CSS strings against the rule with the specified options.
 *
 * `ruleTester.only()` has the same API but uses `test.only()` from
 * tape -- meaning that those tests run exclusively.
 *
 * @param {function} rule
 * @param {string} ruleName
 * @return {function} ruleTester for the specified rule
 */
export default function (rule, ruleName) {
  const ruleTesterInstance = (options, cb) => {
    return buildRuleTester(test, options, cb)
  }

  ruleTesterInstance.only = (options, cb) => {
    return buildRuleTester(test.only, options, cb)
  }

  return ruleTesterInstance

  function buildRuleTester(testFn, options, cb) {
    testFn(`${ruleName.toUpperCase()}: ${JSON.stringify(options)}`, t => {
      cb({

        /**
         * Checks that a CSS string is valid according to the
         * specified rule/options.
         *
         * @param {string} cssString
         */
        ok(cssString, description) {
          t.test(`pass: ${jsesc(cssString)}`, st => {
            postcssProcess(cssString, result => {
              st.equal(result.warnings().length, 0, `${description} should pass`)
              st.end()
            })
          })
        },

        /**
         * Checks that a CSS string is INVALID according to the
         * specified rule/options -- that a warning is registered
         * with the expected warning message.
         *
         * @param {string} cssString
         * @param {string} message
         */
        notOk(cssString, description, warningMessage) {
          t.test(`fail: ${jsesc(cssString)}`, st => {
            postcssProcess(cssString, result => {
              const warnings = result.warnings()
              const oneWarning = warnings.length === 1
              st.ok(oneWarning, `${description} should warn`)
              if (oneWarning) {
                st.equal(warnings[0].text, warningMessage,
                  `${description} should report "${warningMessage}"`)
              } else {
                st.pass("no warning to test")
              }
              st.end()
            })
          })
        },
      })
      t.end()
    })

    function postcssProcess(cssString, callback) {
      postcss()
        .use(rule(options))
        .process(cssString)
        .then(callback)
    }
  }

}
