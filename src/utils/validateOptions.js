export default function ({ result, ruleName, possible, actual }) {

  if (Array.isArray(possible)) {
    if (isValid(possible, actual)) { return }
    result.warn(`Invalid option value "${actual}" for rule "${ruleName}"`)
    return
  }

  if (!actual) { return }

  Object.keys(actual).forEach(optionName => {
    if (!possible[optionName]) {
      result.warn(`Invalid option name "${optionName}" for rule "${ruleName}"`)
      return
    }

    const actualOptionValue = actual[optionName]

    if (Array.isArray(actualOptionValue)) {
      actualOptionValue.forEach(singleValue => {
        if (isValid(possible[optionName], singleValue)) { return }
        result.warn(`Invalid value "${singleValue}" for option "${optionName}" of rule "${ruleName}"`)
      })
      return
    }

    if (isValid(possible[optionName], actualOptionValue)) { return }

    result.warn(`Invalid value "${actualOptionValue}" for option "${optionName}" of rule "${ruleName}"`)
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
