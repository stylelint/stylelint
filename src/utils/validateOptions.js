import _ from "lodash"

const ignoredOptions = [ "severity", "message" ]

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
export default function (result, ruleName) {
  let noErrors = true

  for (var _len = arguments.length, optionDescriptions = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    optionDescriptions[_key - 2] = arguments[_key]
  }

  optionDescriptions.forEach(optionDescription => {
    validate(optionDescription, ruleName, complain)
  })

  function complain(message) {
    noErrors = false
    result.warn(message, {
      stylelintType: "invalidOption",
    })
    _.set(result, "stylelint.stylelintError", true)
  }

  return noErrors
}

function validate(_ref, ruleName, complain) {
  let possible = _ref.possible,
    actual = _ref.actual,
    optional = _ref.optional

  if (actual === null || _.isEqual(actual, [null])) {
    return
  }

  const nothingPossible = possible === undefined || Array.isArray(possible) && possible.length === 0

  if (nothingPossible && actual === true) {
    return
  }

  if (actual === undefined) {
    if (nothingPossible || optional) {
      return
    }
    complain(`Expected option value for rule "${ruleName}"`)
    return
  } else if (nothingPossible) {
    complain(`Unexpected option value "${actual}" for rule "${ruleName}"`)
    return
  }

  // If `possible` is a function ...
  if (_.isFunction(possible)) {
    if (!possible(actual)) {
      complain(`Invalid option "${JSON.stringify(actual)}" for rule ${ruleName}`)
    }
    return
  }

  // If `possible` is an array instead of an object ...
  if (!_.isPlainObject(possible)) {
    [].concat(actual).forEach(a => {
      if (isValid(possible, a)) {
        return
      }
      complain(`Invalid option value "${a}" for rule "${ruleName}"`)
    })
    return
  }

  // If possible is an object ...
  if (!_.isPlainObject(actual)) {
    complain(`Invalid option value ${JSON.stringify(actual)} for rule "${ruleName}": ` + "should be an object")
    return
  }

  Object.keys(actual).forEach(optionName => {
    if (ignoredOptions.indexOf(optionName) !== -1) {
      return
    }

    if (!possible[optionName]) {
      complain(`Invalid option name "${optionName}" for rule "${ruleName}"`)
      return
    }

    const actualOptionValue = actual[optionName];[].concat(actualOptionValue).forEach(a => {
      if (isValid(possible[optionName], a)) {
        return
      }
      complain(`Invalid value "${a}" for option "${optionName}" of rule "${ruleName}"`)
    })
  })
}

function isValid(possible, actual) {
  const possibleList = [].concat(possible)
  for (let i = 0, l = possibleList.length; i < l; i++) {
    const possibility = possibleList[i]
    if (typeof possibility === "function" && possibility(actual)) {
      return true
    }
    if (actual === possibility) {
      return true
    }
  }
}
