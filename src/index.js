import postcssPlugin from "./postcssPlugin"
import standalone from "./standalone"
import createPlugin from "./createPlugin"
import rules from "./rules"
import {
  cssWordIsVariable, // Deprecated
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "./utils"
import createRuleTester from "./testUtils/createRuleTester"

const stylelint = postcssPlugin

stylelint.utils = {
  cssWordIsVariable, // Deprecated
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
}

stylelint.lint = standalone
stylelint.rules = rules
stylelint.createPlugin = createPlugin
stylelint.createRuleTester = createRuleTester

module.exports = stylelint
