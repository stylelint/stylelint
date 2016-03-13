import { isPlainObject, isFunction } from "lodash"

const ignoredOptions = [
  "severity",
  "message",
]

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

    if (nothingPossible && actual === true) { return }

    if (actual == null) {
      if (nothingPossible || optional) { return }
      complain(`Expected option value for rule "${ruleName}"`)
      return
    } else if (nothingPossible) {
      complain(`Unexpected option value "${actual}" for rule "${ruleName}"`)
      return
    }

    // If `possible` is a function ...
    if (isFunction(possible)) {
      if (!possible(actual)) {
        complain(`Invalid option "${JSON.stringify(actual)}" for rule ${ruleName}`)
      }
      return
    }

    // If `possible` is an array instead of an object ...
    if (!isPlainObject(possible)) {
      [].concat(actual).forEach(a => {
        if (isValid(possible, a)) { return }
        complain(`Invalid option value "${a}" for rule "${ruleName}"`)
      })
      return
    }

    // If possible is an object ...
    if (!isPlainObject(actual)) {
      complain(
        `Invalid option value ${JSON.stringify(actual)} for rule "${ruleName}": ` +
        "should be an object"
      )
      return
    }

    Object.keys(actual).forEach(optionName => {
      if (ignoredOptions.indexOf(optionName) !== -1) { return }

      if (!possible[optionName]) {
        complain(`Invalid option name "${optionName}" for rule "${ruleName}"`)
        return
      }

      const actualOptionValue = actual[optionName]

      ;[].concat(actualOptionValue).forEach(a => {
        if (isValid(possible[optionName], a)) { return }
        complain(`Invalid value "${a}" for option "${optionName}" of rule "${ruleName}"`)
      })
    })

    function complain(message) {
      noErrors = false
      result.warn(message, {
        stylelintType: "invalidOption",
      })
    }
  }
}

function isValid(possible, actual) {
  const possibleList = [].concat(possible)
  for (let i = 0, l = possibleList.length; i < l; i++) {
    const possibility = possibleList[i]
    if (typeof possibility === "function" && possibility(actual)) { return true }
    if (actual === possibility) { return true }
  }
}
