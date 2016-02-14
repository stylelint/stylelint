import disableRanges from "../disableRanges"
import ruleTester from "stylelint-rule-tester"

export default function (rule, ruleName, options) {
  options = options || {}
  options.preceedingPlugins = [disableRanges]

  return ruleTester.printWarnings(rule, ruleName, options)
}
