import _ from "lodash"

/**
 * Format a message so that it indicates the rule that triggered it.
 *
 * @param {string} ruleName
 * @param {object} messages - Object whose keys are message identifiers
 *   and values are message text
 * @return {string} Message marked with the rule name
 */
export default function (ruleName, messages) {
  return _.mapValues(messages, value => {
    if (_.isString(value)) {
      return `${value} (${ruleName})`
    }
    return x => `${value(x)} (${ruleName})`
  })
}
