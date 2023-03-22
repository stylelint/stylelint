import type * as PostCSS from 'postcss';
import type { GlobbyOptions } from 'globby';
import type { cosmiconfig, TransformSync as CosmiconfigTransformSync } from 'cosmiconfig';

type ConfigExtends = string | string[];
type ConfigPlugins = string | stylelint.Plugin | (string | stylelint.Plugin)[];
type ConfigIgnoreFiles = string | string[];

type ConfigRules = {
	[ruleName: string]: stylelint.ConfigRuleSettings<any, Object>;
};
type ConfigOverride = Omit<stylelint.Config, 'overrides'> & {
	files: string | string[];
};

type DisableSettings = stylelint.ConfigRuleSettings<boolean, stylelint.DisableOptions>;

// A meta-type that returns a union over all properties of `T` whose values
// have type `U`.
type PropertyNamesOfType<T, U> = {
	[K in keyof T]-?: T[K] extends U ? K : never;
}[keyof T];

type FileCache = {
	calcHashOfConfig: (config: stylelint.Config) => void;
	hasFileChanged: (absoluteFilepath: string) => boolean;
	reconcile: () => void;
	destroy: () => void;
	removeEntry: (absoluteFilepath: string) => void;
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
	messages: PostCSS.Message[];
	opts: undefined;
};

// Note: With strict function types enabled, function signatures are checked contravariantly.
// This means that it would not be possible for rule authors to narrow the message function
// parameters to e.g. just `string`. Declaring the type for rule message functions through
// method declarations tricks TypeScript into bivariant signature checking. More details can
// be found here: https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types.
// and in the original discussion: https://github.com/stylelint/stylelint/pull/6147#issuecomment-1155337016.
type RuleMessageFunc = {
	bivariance(...args: (string | number | boolean | RegExp)[]): string;
}['bivariance'];

type RuleOptionsPossibleFunc = (value: unknown) => boolean;

type DisableReportEntry = {
	source?: string;
	ranges: stylelint.DisableReportRange[];
};

declare namespace stylelint {
	/**
	 * Rule severity.
	 */
	type Severity = 'warning' | 'error';

	/**
	 * A Stylelint plugin.
	 */
	type Plugin = { default?: { ruleName: string; rule: Rule } } | { ruleName: string; rule: Rule };

	/** @internal */
	type ConfigRuleSettings<T, O extends Object> =
		| null
		| undefined
		| NonNullable<T>
		| [NonNullable<T>]
		| [NonNullable<T>, O];

	/** @internal */
	type DisableOptions = {
		except?: (string | RegExp)[];
		severity?: Severity;
	};

	/**
	 * Configuration.
	 */
	type Config = {
		extends?: ConfigExtends;
		plugins?: ConfigPlugins;
		pluginFunctions?: {
			[pluginName: string]: Rule;
		};
		ignoreFiles?: ConfigIgnoreFiles;
		ignorePatterns?: string;
		rules?: ConfigRules;
		quiet?: boolean;
		defaultSeverity?: Severity;
		ignoreDisables?: DisableSettings;
		reportNeedlessDisables?: DisableSettings;
		reportInvalidScopeDisables?: DisableSettings;
		reportDescriptionlessDisables?: DisableSettings;
		configurationComment?: string;
		overrides?: ConfigOverride[];
		customSyntax?: CustomSyntax;
	};

	/** @internal */
	type DisablePropertyName = PropertyNamesOfType<Config, DisableSettings>;

	/** @internal */
	type CosmiconfigResult = (ReturnType<CosmiconfigTransformSync> & { config: Config }) | null;

	/** @internal */
	type DisabledRange = {
		comment: PostCSS.Comment;
		start: number;
		strictStart: boolean;
		end?: number;
		strictEnd?: boolean;
		rules?: string[];
		description?: string;
	};

	/** @internal */
	type DisabledRangeObject = {
		[ruleName: string]: DisabledRange[];
	};

	/** @internal */
	type DisabledWarning = { line: number; rule: string };

	/** @internal */
	type StylelintPostcssResult = {
		ruleSeverities: { [ruleName: string]: Severity };
		customMessages: { [ruleName: string]: RuleMessage };
		ruleMetadata: { [ruleName: string]: Partial<RuleMeta> };
		quiet?: boolean;
		disabledRanges: DisabledRangeObject;
		disabledWarnings?: DisabledWarning[];
		ignored?: boolean;
		stylelintError?: boolean;
		stylelintWarning?: boolean;
		disableWritingFix?: boolean;
		config?: Config;
	};

	/** @internal */
	type WarningOptions = PostCSS.WarningOptions & {
		stylelintType?: string;
		severity?: Severity;
		rule?: string;
	};

	/** @internal */
	type PostcssResult = (PostCSS.Result | EmptyResult) & {
		stylelint: StylelintPostcssResult;
		warn(message: string, options?: WarningOptions): void;
	};

	/** @internal */
	type Formatter = (results: LintResult[], returnValue: LinterResult) => string;

	/** @internal */
	type FormatterType = 'compact' | 'github' | 'json' | 'string' | 'tap' | 'unix' | 'verbose';

	/** @internal */
	type CustomSyntax = string | PostCSS.Syntax;

	/** @internal */
	type RuleMessage = string | RuleMessageFunc;

	/** @internal */
	type RuleMessages = { [message: string]: RuleMessage };

	/** @internal */
	type RuleOptionsPossible = boolean | number | string | RuleOptionsPossibleFunc;

	/** @internal */
	type RuleOptions = {
		actual: unknown;
		possible?:
			| RuleOptionsPossibleFunc
			| RuleOptionsPossible[]
			| Record<string, RuleOptionsPossible[]>;
		optional?: boolean;
	};

	/**
	 * A rule context.
	 */
	type RuleContext = {
		configurationComment?: string | undefined;
		fix?: boolean | undefined;
		newline?: string | undefined;
	};

	/** @internal */
	type RuleBase<P = any, S = any> = (
		primaryOption: P,
		secondaryOptions: Record<string, S>,
		context: RuleContext,
	) => (root: PostCSS.Root, result: PostcssResult) => Promise<void> | void;

	/** @internal */
	type RuleMeta = {
		url: string;
		deprecated?: boolean;
		fixable?: boolean;
	};

	/**
	 * A rule.
	 */
	type Rule<P = any, S = any> = RuleBase<P, S> & {
		ruleName: string;
		messages: RuleMessages;
		primaryOptionArray?: boolean;
		meta?: RuleMeta;
	};

	/** @internal */
	type GetPostcssOptions = {
		code?: string;
		codeFilename?: string;
		filePath?: string;
		customSyntax?: CustomSyntax;
	};

	/** @internal */
	type GetLintSourceOptions = GetPostcssOptions & {
		existingPostcssResult?: PostCSS.Result;
		cache?: boolean;
	};

	/**
	 * Linter options.
	 */
	type LinterOptions = {
		files?: string | string[];
		globbyOptions?: GlobbyOptions;
		cache?: boolean;
		cacheLocation?: string;
		cacheStrategy?: string;
		code?: string;
		codeFilename?: string;
		config?: Config;
		configFile?: string;
		configBasedir?: string;
		/**
		 * The working directory to resolve files from. Defaults to the
		 * current working directory.
		 */
		cwd?: string;
		ignoreDisables?: boolean;
		ignorePath?: string | string[];
		ignorePattern?: string[];
		reportDescriptionlessDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportInvalidScopeDisables?: boolean;
		maxWarnings?: number;
		customSyntax?: CustomSyntax;
		formatter?: FormatterType | Formatter;
		disableDefaultIgnores?: boolean;
		fix?: boolean;
		allowEmptyInput?: boolean;
		quiet?: boolean;
		quietDeprecationWarnings?: boolean;
	};

	/**
	 * A CSS syntax error.
	 */
	type CssSyntaxError = {
		file?: string;
		input: {
			column: number;
			file?: string;
			line: number;
			source: string;
		};
		/**
		 * The line of the inclusive start position of the error.
		 */
		line: number;
		/**
		 * The column of the inclusive start position of the error.
		 */
		column: number;
		/**
		 * The line of the exclusive end position of the error.
		 */
		endLine?: number;
		/**
		 * The column of the exclusive end position of the error.
		 */
		endColumn?: number;
		message: string;
		name: string;
		reason: string;
		source: string;
	};

	/**
	 * A lint warning.
	 */
	type Warning = {
		/**
		 * The line of the inclusive start position of the warning.
		 */
		line: number;
		/**
		 * The column of the inclusive start position of the warning.
		 */
		column: number;
		/**
		 * The line of the exclusive end position of the warning.
		 */
		endLine?: number;
		/**
		 * The column of the exclusive end position of the warning.
		 */
		endColumn?: number;
		rule: string;
		severity: Severity;
		text: string;
		stylelintType?: string;
	};

	/**
	 * A lint result.
	 */
	type LintResult = {
		source?: string;
		deprecations: {
			text: string;
			reference?: string;
		}[];
		invalidOptionWarnings: {
			text: string;
		}[];
		parseErrors: (PostCSS.Warning & { stylelintType: string })[];
		errored?: boolean;
		warnings: Warning[];
		ignored?: boolean;
		/**
		 * Internal use only. Do not use or rely on this property. It may
		 * change at any time.
		 * @internal
		 */
		_postcssResult?: PostcssResult;
	};

	/** @internal */
	type DisableReportRange = {
		rule: string;
		start: number;
		end?: number;
	};

	/**
	 * A linter result.
	 */
	type LinterResult = {
		/**
		 * The working directory from which the linter was run when the
		 * results were generated.
		 */
		cwd: string;
		results: LintResult[];
		errored: boolean;
		output: any;
		maxWarningsExceeded?: {
			maxWarnings: number;
			foundWarnings: number;
		};
		reportedDisables: DisableOptionsReport;
		descriptionlessDisables?: DisableOptionsReport;
		needlessDisables?: DisableOptionsReport;
		invalidScopeDisables?: DisableOptionsReport;
		/**
		 * Each rule metadata by name.
		 */
		ruleMetadata: { [ruleName: string]: Partial<RuleMeta> };
	};

	/**
	 * A lint problem.
	 */
	type Problem = {
		ruleName: string;
		result: PostcssResult;
		message: RuleMessage;
		messageArgs?: Parameters<RuleMessageFunc> | undefined;
		node: PostCSS.Node;
		/**
		 * The inclusive start index of the problem, relative to the node's
		 * source text.
		 */
		index?: number;
		/**
		 * The exclusive end index of the problem, relative to the node's
		 * source text.
		 */
		endIndex?: number;
		/**
		 * The inclusive start position of the problem, relative to the
		 * node's source text. If provided, this will be used instead of
		 * `index`.
		 */
		start?: {
			line: number;
			column: number;
		};
		/**
		 * The exclusive end position of the problem, relative to the
		 * node's source text. If provided, this will be used instead of
		 * `endIndex`.
		 */
		end?: {
			line: number;
			column: number;
		};
		word?: string;
		line?: number;
		/**
		 * Optional severity override for the problem.
		 */
		severity?: Severity;
	};

	/** @internal */
	type ShorthandProperties =
		| 'animation'
		| 'background'
		| 'border'
		| 'border-block-end'
		| 'border-block-start'
		| 'border-bottom'
		| 'border-color'
		| 'border-image'
		| 'border-inline-end'
		| 'border-inline-start'
		| 'border-left'
		| 'border-radius'
		| 'border-right'
		| 'border-style'
		| 'border-top'
		| 'border-width'
		| 'column-rule'
		| 'columns'
		| 'flex'
		| 'flex-flow'
		| 'font'
		| 'grid'
		| 'grid-area'
		| 'grid-column'
		| 'grid-gap'
		| 'grid-row'
		| 'grid-template'
		| 'inset'
		| 'list-style'
		| 'margin'
		| 'mask'
		| 'outline'
		| 'padding'
		| 'text-decoration'
		| 'text-emphasis'
		| 'transition';

	/** @internal */
	type LonghandSubPropertiesOfShorthandProperties = ReadonlyMap<
		ShorthandProperties,
		ReadonlySet<string>
	>;

	/**
	 * Utility functions.
	 */
	type Utils = {
		/**
		 * Report a problem.
		 *
		 * This function accounts for `disabledRanges` attached to the result.
		 * That is, if the reported problem is within a disabledRange,
		 * it is ignored. Otherwise, it is attached to the result as a
		 * postcss warning.
		 *
		 * It also accounts for the rule's severity.
		 *
		 * You *must* pass *either* a node or a line number.
		 *
		 * @param problem - A problem
		 */
		report: (problem: Problem) => void;

		/**
		 * Given an object of problem messages, return another
		 * that provides the same messages postfixed with the rule
		 * that has been violated.
		 *
		 * @param ruleName - A rule name
		 * @param messages - An object whose keys are message identifiers
		 *   and values are either message strings or functions that return message strings
		 * @returns New message object, whose messages will be marked with the rule name
		 */
		ruleMessages: <T extends RuleMessages, R extends { [K in keyof T]: T[K] }>(
			ruleName: string,
			messages: T,
		) => R;

		/**
		 * Validate a rule's options.
		 *
		 * See existing rules for examples.
		 *
		 * @param result - PostCSS result
		 * @param ruleName - A rule name
		 * @param optionDescriptions - Each optionDescription can have the following properties:
		 *   - `actual` (required): the actual passed option value or object.
		 *   - `possible` (required): a schema representation of what values are
		 *      valid for those options. `possible` should be an object if the
		 *      options are an object, with corresponding keys; if the options are not an
		 *      object, `possible` isn't, either. All `possible` value representations
		 *      should be **arrays of either values or functions**. Values are === checked
		 *      against `actual`. Functions are fed `actual` as an argument and their
		 *      return value is interpreted: truthy = valid, falsy = invalid.
		 *    - `optional` (optional): If this is `true`, `actual` can be undefined.
		 * @returns Whether or not the options are valid (`true` = valid)
		 */
		validateOptions: (
			result: PostcssResult,
			ruleName: string,
			...optionDescriptions: RuleOptions[]
		) => boolean;

		/**
		 * Useful for third-party code (e.g. plugins) to run a PostCSS Root
		 * against a specific rule and do something with the warnings.
		 */
		checkAgainstRule: <T, O extends Object>(
			options: {
				ruleName: string;
				ruleSettings: ConfigRuleSettings<T, O>;
				root: PostCSS.Root;
				result?: PostcssResult;
				context?: RuleContext;
			},
			callback: (warning: PostCSS.Warning) => void,
		) => void;
	};

	/**
	 * Internal use only. Do not use or rely on this type. It may change at
	 * any time.
	 * @internal
	 */
	type InternalApi = {
		_options: LinterOptions & { cwd: string };
		_extendExplorer: ReturnType<typeof cosmiconfig>;
		_specifiedConfigCache: Map<Config, Promise<CosmiconfigResult>>;
		_postcssResultCache: Map<string, PostCSS.Result>;
		_fileCache: FileCache;
	};

	type DisableOptionsReport = DisableReportEntry[];

	type PostcssPluginOptions = Omit<LinterOptions, 'customSyntax'> | Config;
}

type PublicApi = PostCSS.PluginCreator<stylelint.PostcssPluginOptions> & {
	/**
	 * Runs Stylelint with the given options and returns a Promise that
	 * resolves to the results.
	 *
	 * @param options - A lint options object
	 * @returns A lint result
	 */
	lint: (options: stylelint.LinterOptions) => Promise<stylelint.LinterResult>;

	/**
	 * Available rules.
	 */
	rules: { [k: string]: stylelint.Rule };

	/**
	 * Result report formatters by name.
	 */
	formatters: { [k: string]: stylelint.Formatter };

	/**
	 * Creates a Stylelint plugin.
	 */
	createPlugin: (ruleName: string, rule: stylelint.Rule) => stylelint.Plugin;

	/**
	 * The Stylelint "internal API" is passed among functions
	 * so that methods on a Stylelint instance can invoke
	 * each other while sharing options and caches.
	 *
	 * @internal
	 */
	_createLinter: (options: stylelint.LinterOptions) => stylelint.InternalApi;

	/**
	 * Resolves the effective configuration for a given file. Resolves to
	 * `undefined` if no config is found.
	 *
	 * @param filePath - The path to the file to get the config for.
	 * @param options - The options to use when creating the Stylelint instance.
	 * @returns A resolved config or `undefined`.
	 */
	resolveConfig: (
		filePath: string,
		options?: Pick<stylelint.LinterOptions, 'cwd' | 'config' | 'configBasedir' | 'configFile'>,
	) => Promise<stylelint.Config | undefined>;

	/**
	 * Utility functions.
	 */
	utils: stylelint.Utils;

	/**
	 * Reference objects.
	 */
	reference: {
		longhandSubPropertiesOfShorthandProperties: stylelint.LonghandSubPropertiesOfShorthandProperties;
	};
};

declare const stylelint: PublicApi;

export = stylelint;
