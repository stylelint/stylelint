import ruleTester from "stylelint-rule-tester"
import disableRanges from "../disableRanges"

export default function (rule, ruleName, options={}) {
  options.preceedingPlugins = [disableRanges]
  return ruleTester(rule, ruleName, options)
}
