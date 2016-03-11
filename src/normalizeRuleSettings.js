import { isPlainObject } from "lodash"

// These are rules that accept an array as the primary option
const rulesWithPrimaryOptionArray = new Set([
  "declaration-block-properties-order",
  "function-blacklist",
  "function-whitelist",
  "property-blacklist",
  "property-unit-blacklist",
  "property-unit-whitelist",
  "property-whitelist",
  "unit-blacklist",
  "unit-whitelist",
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
  // Everything below is a rule that CAN have an array for a primary option ...
  // (they might also have something else, e.g. rule-properties-order can
  // have the string "alphabetical")

  if (
    rawSettings.length === 2
    && !isPlainObject(rawSettings[0])
    && isPlainObject(rawSettings[1])
  ) { return rawSettings }

  return [rawSettings]
}
