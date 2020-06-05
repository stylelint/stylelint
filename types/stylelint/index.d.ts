declare module 'stylelint' {
	import { Result, ResultMessage, WarningOptions, Warning } from 'postcss';

	export type StylelintConfigExtends = string | Array<string>;
	export type StylelintConfigPlugins = string | Array<string>;
	export type StylelintConfigProcessor = string | [string, Object];
	export type StylelintConfigProcessors = string | Array<StylelintConfigProcessor>;
	export type StylelintConfigIgnoreFiles = string | Array<string>;
	export type StylelintConfigRuleSettings = any | [any, Object];
	export type StylelintConfigRules = {
		[ruleName: string]: StylelintConfigRuleSettings;
	};

	export type StylelintConfig = {
		extends?: StylelintConfigExtends;
		plugins?: StylelintConfigPlugins;
		pluginFunctions?: {
			[pluginName: string]: Function;
		};
		processors?: StylelintConfigProcessors;
		processorFunctions?: Array<Function>;
		ignoreFiles?: StylelintConfigIgnoreFiles;
		ignorePatterns?: string;
		rules?: StylelintConfigRules;
		codeProcessors?: Array<Function>;
		resultProcessors?: Array<Function>;
		quiet?: boolean;
		defaultSeverity?: string;
	};

	export type CosmiconfigResult = { config: StylelintConfig; filepath: string };

	export type DisabledRange = {
		start: number;
		strictStart: boolean;
		end?: number;
		strictEnd?: boolean;
		rules?: string[];
	};

	export type DisabledRangeObject = {
		[ruleName: string]: Array<DisabledRange>;
	};

	export type DisabledWarning = { line: number; rule: string };

	export type StylelintPostcssResult = {
		ruleSeverities: { [k: string]: any };
		customMessages: { [k: string]: any };
		quiet?: boolean;
		disabledRanges: DisabledRangeObject;
		disabledWarnings?: DisabledWarning[];
		ignored?: boolean;
		ignoreDisables?: boolean;
		reportNeedlessDisables?: boolean;
		stylelintError?: boolean;
		disableWritingFix?: boolean;
		config?: StylelintConfig;
	};

	type EmptyResult = {
		root: {
			nodes?: undefined;
			source: {
				lang?: undefined;
				input: {
					file?: string;
				};
			};
		};
		messages: ResultMessage[];
		opts: undefined;
	};

	export type StylelintWarningOptions = WarningOptions & {
		stylelintType?: string;
		severity?: string;
		rule?: string;
	};

	export type PostcssResult = (Result | EmptyResult) & {
		stylelint: StylelintPostcssResult;
		warn(message: string, options?: StylelintWarningOptions): void;
	};

	export type Formatter = (
		results: Array<StylelintResult>,
		returnValue?: StylelintStandaloneReturnValue,
	) => string;

	export type FormatterIdentifier = 'compact' | 'json' | 'string' | 'unix' | 'verbose' | Formatter;

	export type StylelintOptions = {
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: Object;
		ignoreDisables?: boolean;
		ignorePath?: string;
		reportInvalidScopeDisables?: boolean;
		reportNeedlessDisables?: boolean;
		syntax?: string;
		customSyntax?: string;
		fix?: boolean;
	};

	export type GetPostcssOptions = {
		code?: string;
		codeFilename?: string;
		filePath?: string;
		codeProcessors?: Array<Function>;
		syntax?: string;
		customSyntax?: string;
	};

	export type GetLintSourceOptions = GetPostcssOptions & { existingPostcssResult?: Result };

	export type StylelintInternalApi = {
		_options: StylelintStandaloneOptions;
		_extendExplorer: {
			search: (s: string) => Promise<null | CosmiconfigResult>;
			load: (s: string) => Promise<null | CosmiconfigResult>;
		};
		_fullExplorer: {
			search: (s: string) => Promise<null | CosmiconfigResult>;
			load: (s: string) => Promise<null | CosmiconfigResult>;
		};
		_configCache: Map<string, Object>;
		_specifiedConfigCache: Map<StylelintConfig, Object>;
		_postcssResultCache: Map<string, Result>;

		_getPostcssResult: (options?: GetPostcssOptions) => Promise<Result>;
		_lintSource: (options: GetLintSourceOptions) => Promise<PostcssResult>;
		_createStylelintResult: Function;
		_createEmptyPostcssResult?: Function;

		getConfigForFile: (s?: string) => Promise<{ config: StylelintConfig; filepath: string } | null>;
		isPathIgnored: (s?: string) => Promise<boolean>;
		lintSource: Function;
	};

	export type StylelintStandaloneOptions = {
		files?: string | Array<string>;
		globbyOptions?: Object;
		cache?: boolean;
		cacheLocation?: string;
		code?: string;
		codeFilename?: string;
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: Object;
		printConfig?: string;
		ignoreDisables?: boolean;
		ignorePath?: string;
		ignorePattern?: string[];
		reportNeedlessDisables?: boolean;
		reportInvalidScopeDisables?: boolean;
		maxWarnings?: number;
		syntax?: string;
		customSyntax?: string;
		formatter?: FormatterIdentifier;
		disableDefaultIgnores?: boolean;
		fix?: boolean;
		allowEmptyInput?: boolean;
	};

	export type StylelintCssSyntaxError = {
		column: number;
		file?: string;
		input: {
			column: number;
			file?: string;
			line: number;
			source: string;
		};
		line: number;
		message: string;
		name: string;
		reason: string;
		source: string;
	};

	export type StylelintWarning = {
		line: number;
		column: number;
		rule: string;
		severity: string;
		text: string;
		stylelintType?: string;
	};

	export type StylelintResult = {
		source?: string;
		deprecations: Array<{
			text: string;
			reference: string;
		}>;
		invalidOptionWarnings: Array<{
			text: string;
		}>;
		parseErrors: Array<Warning & { stylelintType: string }>;
		errored?: boolean;
		warnings: Array<StylelintWarning>;
		ignored?: boolean;
		_postcssResult?: PostcssResult;
	};

	export type UnusedRange = {
		unusedRule: string;
		start: number;
		end?: number;
	};

	export type RangeType = DisabledRange & { used?: boolean };

	export type StylelintDisableReportEntry = {
		source?: string;
		ranges: Array<{
			unusedRule: string;
			start: number;
			end?: number;
		}>;
	};

	export type StylelintStandaloneReturnValue = {
		results: Array<StylelintResult>;
		errored: boolean;
		output: any;
		maxWarningsExceeded?: {
			maxWarnings: number;
			foundWarnings: number;
		};
		needlessDisables?: StylelintDisableOptionsReport;
		invalidScopeDisables?: StylelintDisableOptionsReport;
	};

	export type StylelintPublicAPI = {
		lint: Function;
		rules: { [k: string]: any };
		formatters: { [k: string]: Formatter };
		createPlugin: Function;
		createLinter: Function;
		utils: {
			report: Function;
			ruleMessages: Function;
			validateOptions: Function;
			checkAgainstRule: Function;
		};
	};

	export type StylelintDisableOptionsReport = Array<StylelintDisableReportEntry>;
}
