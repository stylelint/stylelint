import { isEmpty } from "lodash"

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

  function complain(message) {
    noErrors = false
    result.warn(message)
  }

  function validate({ possible, possibleArray, actual, optional }) {
    const nothingPossible = isEmpty(possible) && isEmpty(possibleArray)

    if (actual == null) {
      if (nothingPossible || optional) { return }
      complain(`Expected option value for rule "${ruleName}"`)
      return
    } else if (nothingPossible) {
      complain(`Unexpected option value "${actual}" for rule "${ruleName}"`)
      return
    }

    // If using `possibleArray` ...
    if (possibleArray) {
      if (!Array.isArray(actual)) {
        complain(`Expected an array option value for rule "${ruleName}"`)
        return
      }
      actual.forEach(actualItem => {
        if (isValid(possibleArray, actualItem)) { return }
        complain(`Invalid option value "${actualItem}" for rule "${ruleName}"`)
        return
      })
      return
    }

    // If `possible` is an array instead of an object ...
    if (Array.isArray(possible)) {
      const check = a => {
        if (isValid(possible, a)) { return }
        complain(`Invalid option value "${a}" for rule "${ruleName}"`)
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
        complain(`Invalid option name "${optionName}" for rule "${ruleName}"`)
        return
      }

      const actualOptionValue = actual[optionName]
      const check = a => {
        if (isValid(possible[optionName], a)) { return }
        complain(`Invalid value "${a}" for option "${optionName}" of rule "${ruleName}"`)
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
