import postcss from "postcss"
import test from "tape"
import disableRanges from "../disableRanges"

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
  const ruleTesterInstance = (primaryOptions, secondaryOptions, cb) => {
    if (typeof secondaryOptions === "function") {
      cb = secondaryOptions
      secondaryOptions = null
    }
    return buildRuleTester(test, primaryOptions, secondaryOptions, cb)
  }

  ruleTesterInstance.only = (primaryOptions, secondaryOptions, cb) => {
    if (typeof secondaryOptions === "function") {
      cb = secondaryOptions
      secondaryOptions = null
    }
    return buildRuleTester(test.only, primaryOptions, secondaryOptions, cb)
  }

  return ruleTesterInstance

  function buildRuleTester(testFn, primaryOptions, secondaryOptions, cb) {
    let optionsString = JSON.stringify(primaryOptions)
    if (secondaryOptions) {
      optionsString += `, ${JSON.stringify(secondaryOptions)}`
    }
    testFn(`${ruleName.toUpperCase()}: ${optionsString}`, t => {
      cb({

        /**
         * Checks that a CSS string is valid according to the
         * specified rule/options.
         *
         * @param {string} cssString
         */
        ok(cssString, description) {
          t.test(`pass: ${JSON.stringify(cssString)}`, st => {
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
         * @param {string} warningMessage
         * @param {string} [description]
         */
        notOk(cssString, warningMessage, description) {
          t.test(`fail: ${JSON.stringify(cssString)}`, st => {
            postcssProcess(cssString, result => {
              const warnings = result.warnings()
              st.equal(warnings.length, 1, `${description} should warn`)
              if (warnings.length === 1) {
                const finishedDescription = (description)
                  ? `${description} should report "${warningMessage}"`
                  : `should report "${warningMessage}"`
                st.equal(warnings[0].text, warningMessage, finishedDescription)
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
        // First add disabledRanges to the result
        .use(disableRanges)
        // Then run the rule
        .use(rule(primaryOptions, secondaryOptions))
        .process(cssString)
        .then(callback)
        .catch(err => console.error(err.stack))
    }
  }

}
