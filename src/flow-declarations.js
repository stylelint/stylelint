import PostcssResult from "postcss/lib/result"

export type stylelint$configExtend = string | Array<string>
export type stylelint$configPlugin = string | Array<string>
export type stylelint$configProcessors = string | Array<string | [string, Object]>
export type stylelint$configIgnoreFiles = string | Array<string>

export type stylelint$configRuleSettings = any | Array<any | [any, Object]>
export type stylelint$configRules = {
  [ruleName: string]: stylelint$configRuleSettings,
}

export type stylelint$config = {
  extends?: stylelint$configExtend,
  plugins?: stylelint$configPlugin,
  processors?: stylelint$configProcessors,
  ignoreFiles?: stylelint$configIgnoreFiles,
  rules: stylelint$configRules,
}

export type stylelint$configAugmented = {
  extends?: Array<string>,
  plugins?: Array<string>,
  pluginFunctions?: Array<Function>,
  processors?: Array<string | [string, Object]>,
  processorFunctions?: Array<Function>,
  rules: stylelint$configRules,
}

export type stylelint$syntaxes = "scss" | "less" | "sugarss"

export type stylelint$options = {
  config?: stylelint$config,
  configFile?: string,
  configBasedir?: string,
  configOverrides?: Object,
  ignoreDisables?: boolean,
  ignorePath?: string,
  reportNeedlessDisables?: boolean,
  syntax?: stylelint$syntaxes,
}

export type stylelint$internalApi = {
  _options: stylelint$options,
  _explorer: { load: Function },
  _configCache: Map<string, Object>,
  _postcssResultCache?: Map<string, Object>,

  _augmentConfig: Function,
  _getPostcssResult: Function,
  _createEmptyPostcssResult?: Function,

  getConfigForFile: Function,
  isPathIgnored: Function,
  lintSource: Function,
}

export type stylelint$warning = {
  line: number,
  column: number,
  rule: string,
  severity: string,
  text: string,
}

export type stylelint$result = {
  source: string,
  deprecations: Array<{
    text: string,
    reference: string,
  }>,
  invalidOptionWarnings: Array<{
    text: string,
  }>,
  errored?: boolean,
  warnings: Array<stylelint$warning>,
  ignored?: boolean,
  _postcssResult?: PostcssResult,
}

export type stylelint$needlessDisablesReport = Array<{
  source: string,
  ranges: Array<{
    source: string,
    ranges: Array<{
      start: number,
      end?: number,
    }>,
  }>,
}>

export type stylelint$standaloneReturnValue = {
  results: Array<stylelint$result>,
  errored: boolean,
  output: any,
  needlessDisables?: stylelint$needlessDisablesReport,
}

export type stylelint$standaloneOptions = {
  files?: string | Array<string>,
  code?: string,
  codeFilename?: string,
  config?: stylelint$config,
  configFile?: string,
  configBasedir?: string,
  configOverrides?: Object,
  ignoreDisables?: boolean,
  ignorePath?: string,
  reportNeedlessDisables?: boolean,
  syntax?: stylelint$syntaxes,
  formatter?: "json" | "string" | "verbose" | Function,
}
