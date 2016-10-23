/* @flow */
import {
  augmentConfigExtended,
  augmentConfigFull,
} from "./augmentConfig"
import _ from "lodash"
import cosmiconfig from "cosmiconfig"
import createStylelintResult from "./createStylelintResult"
import getConfigForFile from "./getConfigForFile"
import getPostcssResult from "./getPostcssResult"
import isPathIgnored from "./isPathIgnored"
import lintSource from "./lintSource"

// The stylelint "internal API" is passed among functions
// so that methods on a stylelint instance can invoke
// each other while sharing options and caches
export default function (
  options: stylelint$options = {},
): stylelint$internalApi {
  const stylelint: Object = { _options: options }

  // Two separate explorers so they can each have their own transform
  // function whose results are cached by cosmiconfig
  stylelint._fullExplorer = cosmiconfig("stylelint", {
    argv: false,
    rcExtensions: true,
    transform: _.partial(augmentConfigFull, stylelint),
  })
  stylelint._extendExplorer = cosmiconfig(null, {
    argv: false,
    transform: _.partial(augmentConfigExtended, stylelint),
  })

  stylelint._specifiedConfigCache = new Map()
  stylelint._postcssResultCache = new Map()
  stylelint._createStylelintResult = _.partial(createStylelintResult, stylelint)
  stylelint._getPostcssResult = _.partial(getPostcssResult, stylelint)
  stylelint._lintSource = _.partial(lintSource, stylelint)

  stylelint.getConfigForFile = _.partial(getConfigForFile, stylelint)
  stylelint.isPathIgnored = _.partial(isPathIgnored, stylelint)

  return stylelint
}
