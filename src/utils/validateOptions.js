export default function ({ result, ruleName, actual, possible }) {

  if (typeof actual === "undefined" && (!possible || possible.length)) { return }

  // If `possible` is an array instead of an object ...
  if (Array.isArray(possible)) {
    const check = a => {
      if (isValid(possible, a)) { return }
      result.warn(`Invalid option value "${a}" for rule "${ruleName}"`)
    }
    if (Array.isArray(actual)) {
      actual.forEach(check)
    } else {
      check(actual)
    }
    return
  }

  if (!actual) { return }

  // If possible is an object ...
  Object.keys(actual).forEach(optionName => {
    if (!possible[optionName]) {
      result.warn(`Invalid option name "${optionName}" for rule "${ruleName}"`)
      return
    }

    const actualOptionValue = actual[optionName]
    const check = a => {
      if (isValid(possible[optionName], a)) { return }
      result.warn(`Invalid value "${a}" for option "${optionName}" of rule "${ruleName}"`)
    }

    if (Array.isArray(actualOptionValue)) {
      actualOptionValue.forEach(check)
    } else {
      check(actualOptionValue)
    }
  })
}

function isValid(possibilities, actuality) {
  if (!possibilities.length) {
    return actuality === undefined
  }

  for (let i = 0, l = possibilities.length; i < l; i++) {
    const possibility = possibilities[i]
    if (typeof possibility === "function" && possibility(actuality)) { return true }
    if (actuality === possibility) { return true }
  }
}
