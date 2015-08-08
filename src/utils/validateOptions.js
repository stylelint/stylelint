/**
 * Validate a rule's options.
 *
 * See existing rules for examples.
 *
 * @param {Result} result - postcss result
 * @param {string} ruleName
 * @param {...object} ...optionDescriptions - Each optionDescription can
 *   have the following properties:
 *   	- `actual` (required): the actual passed option value or object.
 *   	- `possible` (required): a schema representation of what values are
 *      valid for those options. `possible` should be an object if the
 *      options are an object, with corresponding keys; if the options are not an
 *      object, `possible` isn't, either. All `possible` value representations
 *      should be **arrays of either values or functions**. Values are === checked
 *      against `actual`. Functions are fed `actual` as an argument and their
 *      return value is interpreted: truthy = valid, falsy = invalid.
 *    - `optional` (optional): If this is `true`, `actual` can be undefined.
 * @return {boolean} Whether or not the options are valid (true = valid)
 */
export default function (result, ruleName, ...optionDescriptions) {
  let noErrors = true

  optionDescriptions.forEach(validate)

  return noErrors

  function validate({ possible, actual, optional }) {
    const nothingPossible = !possible || (Array.isArray(possible) && !possible.length)
    if (actual == null) {
      if (nothingPossible || optional) { return }
      noErrors = false
      result.warn(`Expected option value for rule "${ruleName}"`)
      return
    } else if (nothingPossible) {
      noErrors = false
      result.warn(`Unexpected option value "${actual}" for rule "${ruleName}"`)
      return
    }

    // If `possible` is an array instead of an object ...
    if (Array.isArray(possible)) {
      const check = a => {
        if (isValid(possible, a)) { return }
        noErrors = false
        result.warn(`Invalid option value "${a}" for rule "${ruleName}"`)
      }
      if (Array.isArray(actual)) {
        actual.forEach(check)
      } else {
        check(actual)
      }
      return
    }

    // If possible is an object ...
    Object.keys(actual).forEach(optionName => {
      if (!possible[optionName]) {
        noErrors = false
        result.warn(`Invalid option name "${optionName}" for rule "${ruleName}"`)
        return
      }

      const actualOptionValue = actual[optionName]
      const check = a => {
        if (isValid(possible[optionName], a)) { return }
        noErrors = false
        result.warn(`Invalid value "${a}" for option "${optionName}" of rule "${ruleName}"`)
      }

      if (Array.isArray(actualOptionValue)) {
        actualOptionValue.forEach(check)
      } else {
        check(actualOptionValue)
      }
    })
  }
}

function isValid(possible, actual) {
  for (let i = 0, l = possible.length; i < l; i++) {
    const possibility = possible[i]
    if (typeof possibility === "function" && possibility(actual)) { return true }
    if (actual === possibility) { return true }
  }
}
