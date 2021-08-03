declare module 'stylelint' {
	import { Comment, Result, Message, Root, Syntax, WarningOptions, Warning } from 'postcss';
	import { GlobbyOptions } from 'globby';

	export type Severity = 'warning' | 'error';

	export type StylelintConfigExtends = string | Array<string>;
	export type StylelintConfigPlugins = string | Array<string>;
	export type StylelintConfigProcessor = string | [string, Object];
	export type StylelintConfigProcessors = string | Array<StylelintConfigProcessor>;
	export type StylelintConfigIgnoreFiles = string | Array<string>;
	export type StylelintConfigRuleSettings<T, O extends Object> =
		| null
		| undefined
		| NonNullable<T>
		| [NonNullable<T>]
		| [NonNullable<T>, O];
	export type StylelintConfigRules = {
		[ruleName: string]: StylelintConfigRuleSettings<any, Object>;
	};

	export type DisableOptions = {
		except?: Array<string | RegExp>;
		severity?: Severity;
	};
	export type DisableSettings = StylelintConfigRuleSettings<boolean, DisableOptions>;

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
		defaultSeverity?: Severity;
		ignoreDisables?: DisableSettings;
		reportNeedlessDisables?: DisableSettings;
		reportInvalidScopeDisables?: DisableSettings;
		reportDescriptionlessDisables?: DisableSettings;
	};

	// A meta-type that returns a union over all properties of `T` whose values
	// have type `U`.
	type PropertyNamesOfType<T, U> = {
		[K in keyof T]-?: T[K] extends U ? K : never;
	}[keyof T];
	export type DisablePropertyName = PropertyNamesOfType<StylelintConfig, DisableSettings>;

	export type CosmiconfigResult = { config: StylelintConfig; filepath: string };

	export type DisabledRange = {
		comment: Comment;
		start: number;
		strictStart: boolean;
		end?: number;
		strictEnd?: boolean;
		rules?: string[];
		description?: string;
	};

	export type DisabledRangeObject = {
		[ruleName: string]: Array<DisabledRange>;
	};

	export type DisabledWarning = { line: number; rule: string };

	export type StylelintPostcssResult = {
		ruleSeverities: { [k: string]: Severity };
		customMessages: { [k: string]: any };
		quiet?: boolean;
		disabledRanges: DisabledRangeObject;
		disabledWarnings?: DisabledWarning[];
		ignored?: boolean;
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
		messages: Message[];
		opts: undefined;
	};

	export type StylelintWarningOptions = WarningOptions & {
		stylelintType?: string;
		severity?: Severity;
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

	export type FormatterIdentifier =
		| 'compact'
		| 'json'
		| 'string'
		| 'tap'
		| 'unix'
		| 'verbose'
		| Formatter;

	export type CustomSyntax = string | Syntax;

	export type StylelintOptions = {
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: StylelintConfig;
		ignoreDisables?: boolean;
		ignorePath?: string;
		reportInvalidScopeDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportDescriptionlessDisables?: boolean;
		syntax?: string;
		customSyntax?: CustomSyntax;
		fix?: boolean;
	};

	export type StylelintPluginContext = {
		fix?: boolean | undefined;
		newline?: string | undefined;
	};

	export type StylelintRuleMessages = Record<string, string | ((...args: any[]) => string)>;

	export type StylelintRule = ((
		primaryOption: any,
		secondaryOptions: Record<string, any>,
		context: StylelintPluginContext,
	) => (root: Root, result: PostcssResult) => Promise<void> | void) & {
		ruleName: string;
		messages: StylelintRuleMessages;
		primaryOptionArray?: boolean;
	};

	export type GetPostcssOptions = {
		code?: string;
		codeFilename?: string;
		filePath?: string;
		codeProcessors?: Array<Function>;
		syntax?: string;
		customSyntax?: CustomSyntax;
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
		globbyOptions?: GlobbyOptions;
		cache?: boolean;
		cacheLocation?: string;
		code?: string;
		codeFilename?: string;
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: StylelintConfig;
		printConfig?: string;
		ignoreDisables?: boolean;
		ignorePath?: string;
		ignorePattern?: string[];
		reportDescriptionlessDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportInvalidScopeDisables?: boolean;
		maxWarnings?: number;
		syntax?: string;
		customSyntax?: CustomSyntax;
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
		severity: Severity;
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

	export type DisableReportRange = {
		rule: string;
		start: number;
		end?: number;
	};

	export type RangeType = DisabledRange & { used?: boolean };

	export type StylelintDisableReportEntry = {
		source?: string;
		ranges: Array<DisableReportRange>;
	};

	export type StylelintStandaloneReturnValue = {
		results: Array<StylelintResult>;
		errored: boolean;
		output: any;
		maxWarningsExceeded?: {
			maxWarnings: number;
			foundWarnings: number;
		};
		reportedDisables: StylelintDisableOptionsReport;
		descriptionlessDisables?: StylelintDisableOptionsReport;
		needlessDisables?: StylelintDisableOptionsReport;
		invalidScopeDisables?: StylelintDisableOptionsReport;
	};

	export type StylelintPublicAPI = {
		lint: Function;
		rules: { [k: string]: StylelintRule };
		formatters: { [k: string]: Formatter };
		createPlugin: (
			ruleName: string,
			rule: StylelintRule,
		) => { ruleName: string; rule: StylelintRule };
		createLinter: Function;
		utils: {
			report: Function;
			ruleMessages: Function;
			validateOptions: Function;
			checkAgainstRule: Function;
		};
	};

	export type StylelintDisableOptionsReport = Array<StylelintDisableReportEntry>;

	export type PostcssPluginOptions =
		| Omit<StylelintStandaloneOptions, 'syntax' | 'customSyntax'>
		| StylelintConfig;
}
