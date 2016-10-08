/* @flow */
import {
  stylelint$configRulePrimaryOption,
  stylelint$configRuleSettings,
} from "./flow-declarations"
import _ from "lodash"

// Rule settings can take a number of forms, e.g.
// - "rule-name": null
// - "rule-name": [null]
// - "rule-name": primaryOption
// - "rule-name": [primaryOption]
// - "rule-name": [primaryOption, secondaryOption]
// Where primaryOption can be anything: primitive, Object, or Array.
//
// This function normalizes all the possibilities into the
// standard form: [primaryOption, secondaryOption]
export default function (
  rawSettings: stylelint$configRuleSettings,
  ruleName: string,
  primaryOptionArray?: boolean,
): Array<stylelint$configRulePrimaryOption | [stylelint$configRulePrimaryOption, Object]> {
  if (!Array.isArray(rawSettings)) { return [rawSettings] }
  // Everything below is an array ...

  // This cursed rule needs a special case
  if (ruleName === "declaration-block-properties-order") {
    if (rawSettings[0] === "alphabetical") { return rawSettings }
    if (typeof rawSettings[0] === "string") { return [rawSettings] }
  }

  if (!primaryOptionArray) { return rawSettings }
  // Everything below is a rule that CAN have an array for a primary option ...
  // (they might also have something else, e.g. rule-properties-order can
  // have the string "alphabetical")

  if (rawSettings.length === 1 && Array.isArray(rawSettings[0])) { return rawSettings }

  if (
    rawSettings.length === 2
    && !_.isPlainObject(rawSettings[0])
    && _.isPlainObject(rawSettings[1])
  ) { return rawSettings }

  return [rawSettings]
}
