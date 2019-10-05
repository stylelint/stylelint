declare module 'stylelint' {
	export type StylelintConfigExtends = string | Array<string>;
	export type StylelintConfigPlugins = string | Array<string>;
	export type StylelintConfigProcessors =
		| string
		| Array<string | [string, Object]>;
	export type StylelintConfigIgnoreFiles = string | Array<string>;
	export type StylelintConfigRuleSettings = any | [any, Object];
	export type StylelintConfigRules = {
		[ruleName: string]: StylelintConfigRuleSettings
	};

	export type StylelintConfig = {
		extends?: StylelintConfigExtends,
		plugins?: StylelintConfigPlugins,
		pluginFunctions?: {
			[pluginName: string]: Function
		},
		processors?: StylelintConfigProcessors,
		processorFunctions?: Array<Function>,
		ignoreFiles?: StylelintConfigIgnoreFiles,
		ignorePatterns?: string,
		rules?: StylelintConfigRules,
		codeProcessors?: Array<Function>,
		resultProcessors?: Array<Function>,
		quiet?: boolean,
		defaultSeverity?: string
	};

	export type StylelintSyntaxes = "scss" | "less" | "sugarss";

	export type DisabledRange = {
		start: number,
		strictStart: boolean,
		end?: number,
		strictEnd?: boolean
	};

	export type DisabledRangeObject = {
		[ruleName: string]: Array<DisabledRange>
	};

	export type StylelintPostcssResult = {
		ruleSeverities: Object,
		customMessages: Object,
		quiet?: boolean,
		disabledRanges: DisabledRangeObject,
		ignored?: boolean,
		stylelintError?: boolean
	};

	export type StylelintOptions = {
		config?: StylelintConfig,
		configFile?: string,
		configBasedir?: string,
		configOverrides?: Object,
		ignoreDisables?: boolean,
		ignorePath?: string,
		reportInvalidScopeDisables?: boolean,
		reportNeedlessDisables?: boolean,
		syntax?: StylelintSyntaxes,
		customSyntax?: string,
		fix?: boolean
	};

	export type StylelintInternalApi = {
		_options: StylelintOptions,
		_extendExplorer: {
			search: (s: string) => Promise<null | Object>,
			load: (s: string) => Promise<null | Object>
		},
		_fullExplorer: {
			search: (s: string) => Promise<null | Object>,
			load: (s: string) => Promise<null | Object>
		},
		_configCache: Map<string, Object>,
		_specifiedConfigCache: Map<StylelintConfig, Object>,
		_postcssResultCache: Map<string, Object>,

		_augmentConfig: Function,
		_getPostcssResult: Function,
		_lintSource: Function,
		_createStylelintResult: Function,
		_createEmptyPostcssResult?: Function,

		getConfigForFile: (s: string) => Promise<{ config: StylelintConfig, filepath: string } | null>,
		isPathIgnored: (s: string) => Promise<boolean>,
		lintSource: Function
	};

	export type StylelintWarning = {
		line: number,
		column: number,
		rule: string,
		severity: string,
		text: string
	};

	export type StylelintResult = {
		source: string,
		deprecations: Array<{
			text: string,
			reference: string
		}>,
		invalidOptionWarnings: Array<{
			text: string
		}>,
		parseErrors: Array<StylelintWarning>,
		errored?: boolean,
		warnings: Array<StylelintWarning>,
		ignored?: boolean,
		_postcssResult?: Object
	};

	export type StylelintCssSyntaxError = {
		column: number,
		file?: string,
		input: {
			column: number,
			file?: string,
			line: number,
			source: string
		},
		line: number,
		message: string,
		name: string,
		reason: string,
		source: string
	};

	export type StylelintDisableOptionsReport = Array<{
		source: string,
		ranges: Array<{
			unusedRule: string,
			start: number,
			end?: number
		}>
	}>;

	export type StylelintStandaloneReturnValue = {
		results: Array<StylelintResult>,
		errored: boolean,
		output: any,
		maxWarningsExceeded?: {
			maxWarnings: number,
			foundWarnings: number
		},
		needlessDisables?: StylelintDisableOptionsReport,
		invalidScopeDisables?: StylelintDisableOptionsReport
	};

	export type StylelintStandaloneOptions = {
		files?: string | Array<string>,
		globbyOptions?: Object,
		cache?: boolean,
		cacheLocation?: string,
		code?: string,
		codeFilename?: string,
		config?: StylelintConfig,
		configFile?: string,
		configBasedir?: string,
		configOverrides?: Object,
		printConfig?: string,
		ignoreDisables?: boolean,
		ignorePath?: string,
		ignorePattern?: RegExp,
		reportNeedlessDisables?: boolean,
		reportInvalidScopeDisables?: boolean,
		maxWarnings?: number,
		syntax?: StylelintSyntaxes,
		customSyntax?: string,
		formatter?: "compact" | "json" | "string" | "unix" | "verbose" | Function,
		disableDefaultIgnores?: boolean,
		fix?: boolean,
		allowEmptyInput: boolean
	};
}
