import { isPlainObject } from "lodash"

// These are rules that accept an array as the primary option
const rulesWithPrimaryOptionArray = new Set([
  "rule-properties-order",
  "function-whitelist",
  "function-blacklist",
  "property-whitelist",
  "property-blacklist",
  "property-unit-whitelist",
  "property-unit-blacklist",
  "unit-whitelist",
  "unit-blacklist",
])

export default function (rawSettings, ruleName) {
  // Settings can be
  // a. A solitary primitive value or object, in which case put it in an array
  // b. An array with a primary option and a secondary options object, in which case use that array
  // c. A solitary array ... in which case we have trouble and need to special-case it
  //    ... hence the list above

  if (!Array.isArray(rawSettings)) { return [rawSettings] }
  // Everything below is an array ...

  if (!rulesWithPrimaryOptionArray.has(ruleName)) { return rawSettings }
  // Everything below is a rule that has an array for a primary option ...

  if (
    rawSettings.length === 2
    && Array.isArray(rawSettings[0])
    && isPlainObject(rawSettings[1])
  ) { return rawSettings }

  return [rawSettings]
}
