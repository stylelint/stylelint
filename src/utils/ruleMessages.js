/**
 * Format a message so that it indicates the rule that triggered it.
 *
 * @param {string} ruleName
 * @param {object} messages - Object whose keys are message identifiers
 *   and values are message text
 * @return {string} Message marked with the rule name
 */
export default function (ruleName, messages) {
  return Object.keys(messages).reduce((r, k) => {
    const value = messages[k]
    r[k] = (typeof value === "string")
      ? `${value} (${ruleName})`
      : x => `${value(x)} (${ruleName})`
    return r
  }, {})
}
