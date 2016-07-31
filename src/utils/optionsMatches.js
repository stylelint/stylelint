import matchesStringOrRegExp from "./matchesStringOrRegExp"

const extractValueFromInput = (property, input) => {
  switch (property) {
    case "ignoreAtRules":
      return input.name
    case "ignoreProperties":
      return input.prop
    case "ignorePseudoClasses":
      return input.value.slice(1)
    case "ignorePseudoElements":
      return input.value.slice(2)
    case "ignoreTypes":
      return input.value
    case "ignoreUnits":
      return input
  }
}

const nodeTypeIsOk = (propertyName, input) => {
  return (propertyName === "ignoreAtRules") ? (input.type === "atrule") : true
}

/**
 * Check if an options object's propertyName contains a user-defined string or
 * regex that matches the passed in input.
 *
 * @param {object} options
 * @param {string} propertyName
 * @param {Node or string} postcss node or string
 * @return {boolean} If `true`, a match was found
 */
export default function optionsMatches(options, propertyName, input) {
  const value = extractValueFromInput(propertyName, input)

  return !!(
    options &&
    options[propertyName] &&
    nodeTypeIsOk(propertyName, input) &&
    matchesStringOrRegExp(value.toLowerCase(), options[propertyName])
  )
}
