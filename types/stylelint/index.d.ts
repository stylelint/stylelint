declare module 'stylelint' {
	import { Result, Warning, WarningOptions } from 'postcss';

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

	export type StylelintSyntaxes = "css" | "scss" | "less" | "sugarss";

	export type DisabledRange = {
		start: number,
		strictStart: boolean,
		end?: number,
		strictEnd?: boolean
	};

	export type DisabledRangeObject = {
		[ruleName: string]: Array<DisabledRange>
	};

	export type RangeType  = {
		unusedRule: string,
		end?: number,
		start: number,
		used?: boolean
	}

	export type UnusedRange = {
		unusedRule: string,
		start: number,
		end?: number
	}

	export type StylelintPostcssResult = {
		ruleSeverities: {[k: string]: any},
		customMessages: {[k: string]: any},
		quiet?: boolean,
		disabledRanges: DisabledRangeObject,
		ignored?: boolean,
		ignoreDisables?: boolean,
		stylelintError?: boolean
	};

	export type PostcssResult = Result & {
		stylelint: StylelintPostcssResult,
		warn(message: string, options?: WarningOptions & {stylelintType?: string}): void;
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

	export type GetPostcssOptions = {
		code?: string,
		codeFilename?: string,
		filePath?: string,
		codeProcessors?: Array<Function>,
		syntax?: StylelintSyntaxes,
		customSyntax?: string
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
		_postcssResultCache: Map<string, PostcssResult>,

		_augmentConfig: Function,
		_getPostcssResult: (config: GetPostcssOptions) => Promise<Result>,
		_lintSource: (config: Object) => Promise<PostcssResult>,
		_createStylelintResult: Function,
		_createEmptyPostcssResult?: Function,

		getConfigForFile: (s?: string) => Promise<{ config: StylelintConfig, filepath: string } | null>,
		isPathIgnored: (s?: string) => Promise<boolean>,
		lintSource: Function
	};

	export type StylelintWarning = {
		line: number,
		column: number,
		rule: string,
		severity: string,
		text: string,
		stylelintType?: string
	};

	export type StylelintResult = {
		source?: string,
		deprecations: Array<{
			text: string,
			reference: string
		}>,
		invalidOptionWarnings: Array<{
			text: string
		}>,
		parseErrors: Array<Warning & {stylelintType: string}>,
		errored?: boolean,
		warnings: Array<StylelintWarning>,
		ignored?: boolean,
		_postcssResult?: PostcssResult
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
		source?: string,
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
		allowEmptyInput?: boolean
	};
}
