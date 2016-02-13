import postcssPlugin from "./postcssPlugin"
import standalone from "./standalone"
import createPlugin from "./createPlugin"
import rules from "./rules"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "./utils"
import ruleTester from "./testUtils/ruleTester"

const stylelint = postcssPlugin

stylelint.utils = {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  ruleTester,
}

stylelint.lint = standalone
stylelint.rules = rules
stylelint.createPlugin = createPlugin

module.exports = stylelint
