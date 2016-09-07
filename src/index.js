import {
  report,
  ruleMessages,
  validateOptions,
} from "./utils"
import buildConfig from "./buildConfig"
import createPlugin from "./createPlugin"
import createRuleTester from "./testUtils/createRuleTester"
import postcssPlugin from "./postcssPlugin"
import rules from "./rules"
import standalone from "./standalone"

const stylelint = postcssPlugin

stylelint.utils = {
  report,
  ruleMessages,
  validateOptions,
}

stylelint.lint = standalone
stylelint.buildConfig = buildConfig
stylelint.rules = rules
stylelint.createPlugin = createPlugin
stylelint.createRuleTester = createRuleTester

module.exports = stylelint
