import disableRanges from "../disableRanges"
import ruleTester from "./modifiedLegacyRuleTester"

export default function (rule, ruleName, options) {
  options = options || {}
  options.preceedingPlugins = [disableRanges]

  return ruleTester.printWarnings(rule, ruleName, options)
}
