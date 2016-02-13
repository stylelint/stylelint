import disableRanges from "../disableRanges"
import genericRuleTester from "./ruleTester"

export function ruleTester(rule, ruleName, options = {}) {
  options.preceedingPlugins = [disableRanges]
  options.printWarnings = true
  return genericRuleTester(rule, ruleName, options)
}

export { default as warningFreeBasics } from "./warningFreeBasics"
