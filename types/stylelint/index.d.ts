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

type RuleSeverityFunc = {
	bivariance(...args: (string | number | boolean | RegExp)[]): stylelint.Severity | null;
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
	export type Severity = 'warning' | 'error';

	/**
	 * A Stylelint plugin.
	 */
	export type Plugin =
		| { default?: { ruleName: string; rule: Rule } }
		| { ruleName: string; rule: Rule };

	/** @internal */
	export type ConfigRuleSettings<T, O extends Object> =
		| null
		| undefined
		| NonNullable<T>
		| [NonNullable<T>]
		| [NonNullable<T>, O];

	/** @internal */
	export type DisableOptions = {
		except?: (string | RegExp)[];
		severity?: Severity;
	};

	/**
	 * Configuration.
	 */
	export type Config = {
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
		allowEmptyInput?: boolean;
		cache?: boolean;
		fix?: boolean;
	};

	/** @internal */
	export type DisablePropertyName = PropertyNamesOfType<Config, DisableSettings>;

	/** @internal */
	export type CosmiconfigResult =
		| (ReturnType<CosmiconfigTransformSync> & { config: Config })
		| null;

	/** @internal */
	export type DisabledRange = {
		comment: PostCSS.Comment;
		start: number;
		strictStart: boolean;
		end?: number;
		strictEnd?: boolean;
		rules?: string[];
		description?: string;
	};

	/** @internal */
	export type DisabledRangeObject = {
		[ruleName: string]: DisabledRange[];
	};

	/** @internal */
	export type DisabledWarning = { line: number; rule: string };

	/** @internal */
	export type StylelintPostcssResult = {
		ruleSeverities: { [ruleName: string]: RuleSeverity };
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
	export type WarningOptions = PostCSS.WarningOptions & {
		stylelintType?: string;
		severity?: Severity;
		rule?: string;
	};

	/** @internal */
	export type PostcssResult = (PostCSS.Result | EmptyResult) & {
		stylelint: StylelintPostcssResult;
		warn(message: string, options?: WarningOptions): void;
	};

	/** @internal */
	export type Formatter = (results: LintResult[], returnValue: LinterResult) => string;

	type Formatters = {
		readonly compact: Promise<Formatter>;
		readonly github: Promise<Formatter>;
		readonly json: Promise<Formatter>;
		readonly string: Promise<Formatter>;
		readonly tap: Promise<Formatter>;
		readonly unix: Promise<Formatter>;
		readonly verbose: Promise<Formatter>;
	};

	/** @internal */
	export type FormatterType = keyof Formatters;

	/** @internal */
	export type CustomSyntax = string | PostCSS.Syntax;

	/** @internal */
	export type RuleMessage = string | RuleMessageFunc;

	/** @internal */
	export type RuleMessages = { [message: string]: RuleMessage };

	/** @internal */
	export type RuleOptionsPossible = boolean | number | string | RuleOptionsPossibleFunc;

	/** @internal */
	export type RuleOptions = {
		actual: unknown;
		possible?:
			| RuleOptionsPossibleFunc
			| RuleOptionsPossible[]
			| Record<string, RuleOptionsPossible[]>;
		optional?: boolean;
	};

	/** @internal */
	type RuleSeverity = Severity | RuleSeverityFunc;

	/**
	 * A rule context.
	 */
	export type RuleContext = {
		configurationComment?: string | undefined;
		fix?: boolean | undefined;
		newline?: string | undefined;
	};

	/** @internal */
	export type RuleBase<P = any, S = any> = (
		primaryOption: P,
		secondaryOptions: Record<string, S>,
		context: RuleContext,
	) => (root: PostCSS.Root, result: PostcssResult) => Promise<void> | void;

	/** @internal */
	export type RuleMeta = {
		url: string;
		deprecated?: boolean;
		fixable?: boolean;
	};

	/**
	 * A rule.
	 */
	export type Rule<P = any, S = any> = RuleBase<P, S> & {
		ruleName: string;
		messages: RuleMessages;
		primaryOptionArray?: boolean;
		meta?: RuleMeta;
	};

	type BuiltInRules = {
		readonly 'alpha-value-notation': Promise<Rule>;
		readonly 'annotation-no-unknown': Promise<Rule>;
		readonly 'at-rule-allowed-list': Promise<Rule>;
		readonly 'at-rule-disallowed-list': Promise<Rule>;
		readonly 'at-rule-empty-line-before': Promise<Rule>;
		readonly 'at-rule-no-unknown': Promise<Rule>;
		readonly 'at-rule-no-vendor-prefix': Promise<Rule>;
		readonly 'at-rule-property-required-list': Promise<Rule>;
		readonly 'block-no-empty': Promise<Rule>;
		readonly 'color-function-notation': Promise<Rule>;
		readonly 'color-hex-alpha': Promise<Rule>;
		readonly 'color-hex-length': Promise<Rule>;
		readonly 'color-named': Promise<Rule>;
		readonly 'color-no-hex': Promise<Rule>;
		readonly 'color-no-invalid-hex': Promise<Rule>;
		readonly 'comment-empty-line-before': Promise<Rule>;
		readonly 'comment-no-empty': Promise<Rule>;
		readonly 'comment-pattern': Promise<Rule>;
		readonly 'comment-whitespace-inside': Promise<Rule>;
		readonly 'comment-word-disallowed-list': Promise<Rule>;
		readonly 'custom-media-pattern': Promise<Rule>;
		readonly 'custom-property-empty-line-before': Promise<Rule>;
		readonly 'custom-property-no-missing-var-function': Promise<Rule>;
		readonly 'custom-property-pattern': Promise<Rule>;
		readonly 'declaration-block-no-duplicate-custom-properties': Promise<Rule>;
		readonly 'declaration-block-no-duplicate-properties': Promise<Rule>;
		readonly 'declaration-block-no-redundant-longhand-properties': Promise<Rule>;
		readonly 'declaration-block-no-shorthand-property-overrides': Promise<Rule>;
		readonly 'declaration-block-single-line-max-declarations': Promise<Rule>;
		readonly 'declaration-empty-line-before': Promise<Rule>;
		readonly 'declaration-no-important': Promise<Rule>;
		readonly 'declaration-property-max-values': Promise<Rule>;
		readonly 'declaration-property-unit-allowed-list': Promise<Rule>;
		readonly 'declaration-property-unit-disallowed-list': Promise<Rule>;
		readonly 'declaration-property-value-allowed-list': Promise<Rule>;
		readonly 'declaration-property-value-disallowed-list': Promise<Rule>;
		readonly 'declaration-property-value-no-unknown': Promise<Rule>;
		readonly 'font-family-name-quotes': Promise<Rule>;
		readonly 'font-family-no-duplicate-names': Promise<Rule>;
		readonly 'font-family-no-missing-generic-family-keyword': Promise<Rule>;
		readonly 'font-weight-notation': Promise<Rule>;
		readonly 'function-allowed-list': Promise<Rule>;
		readonly 'function-calc-no-unspaced-operator': Promise<Rule>;
		readonly 'function-disallowed-list': Promise<Rule>;
		readonly 'function-linear-gradient-no-nonstandard-direction': Promise<Rule>;
		readonly 'function-name-case': Promise<Rule>;
		readonly 'function-no-unknown': Promise<Rule>;
		readonly 'function-url-no-scheme-relative': Promise<Rule>;
		readonly 'function-url-quotes': Promise<Rule>;
		readonly 'function-url-scheme-allowed-list': Promise<Rule>;
		readonly 'function-url-scheme-disallowed-list': Promise<Rule>;
		readonly 'hue-degree-notation': Promise<Rule>;
		readonly 'import-notation': Promise<Rule>;
		readonly 'keyframe-block-no-duplicate-selectors': Promise<Rule>;
		readonly 'keyframe-declaration-no-important': Promise<Rule>;
		readonly 'keyframe-selector-notation': Promise<Rule>;
		readonly 'keyframes-name-pattern': Promise<Rule>;
		readonly 'length-zero-no-unit': Promise<Rule>;
		readonly 'lightness-notation': Promise<Rule>;
		readonly 'max-nesting-depth': Promise<Rule>;
		readonly 'media-feature-name-allowed-list': Promise<Rule>;
		readonly 'media-feature-name-disallowed-list': Promise<Rule>;
		readonly 'media-feature-name-no-unknown': Promise<Rule>;
		readonly 'media-feature-name-no-vendor-prefix': Promise<Rule>;
		readonly 'media-feature-name-unit-allowed-list': Promise<Rule>;
		readonly 'media-feature-name-value-allowed-list': Promise<Rule>;
		readonly 'media-feature-name-value-no-unknown': Promise<Rule>;
		readonly 'media-feature-range-notation': Promise<Rule>;
		readonly 'media-query-no-invalid': Promise<Rule>;
		readonly 'named-grid-areas-no-invalid': Promise<Rule>;
		readonly 'no-descending-specificity': Promise<Rule>;
		readonly 'no-duplicate-at-import-rules': Promise<Rule>;
		readonly 'no-duplicate-selectors': Promise<Rule>;
		readonly 'no-empty-source': Promise<Rule>;
		readonly 'no-invalid-double-slash-comments': Promise<Rule>;
		readonly 'no-invalid-position-at-import-rule': Promise<Rule>;
		readonly 'no-irregular-whitespace': Promise<Rule>;
		readonly 'no-unknown-animations': Promise<Rule>;
		readonly 'no-unknown-custom-properties': Promise<Rule>;
		readonly 'number-max-precision': Promise<Rule>;
		readonly 'property-allowed-list': Promise<Rule>;
		readonly 'property-disallowed-list': Promise<Rule>;
		readonly 'property-no-unknown': Promise<Rule>;
		readonly 'property-no-vendor-prefix': Promise<Rule>;
		readonly 'rule-empty-line-before': Promise<Rule>;
		readonly 'rule-selector-property-disallowed-list': Promise<Rule>;
		readonly 'selector-anb-no-unmatchable': Promise<Rule>;
		readonly 'selector-attribute-name-disallowed-list': Promise<Rule>;
		readonly 'selector-attribute-operator-allowed-list': Promise<Rule>;
		readonly 'selector-attribute-operator-disallowed-list': Promise<Rule>;
		readonly 'selector-attribute-quotes': Promise<Rule>;
		readonly 'selector-class-pattern': Promise<Rule>;
		readonly 'selector-combinator-allowed-list': Promise<Rule>;
		readonly 'selector-combinator-disallowed-list': Promise<Rule>;
		readonly 'selector-disallowed-list': Promise<Rule>;
		readonly 'selector-id-pattern': Promise<Rule>;
		readonly 'selector-max-attribute': Promise<Rule>;
		readonly 'selector-max-class': Promise<Rule>;
		readonly 'selector-max-combinators': Promise<Rule>;
		readonly 'selector-max-compound-selectors': Promise<Rule>;
		readonly 'selector-max-id': Promise<Rule>;
		readonly 'selector-max-pseudo-class': Promise<Rule>;
		readonly 'selector-max-specificity': Promise<Rule>;
		readonly 'selector-max-type': Promise<Rule>;
		readonly 'selector-max-universal': Promise<Rule>;
		readonly 'selector-nested-pattern': Promise<Rule>;
		readonly 'selector-no-qualifying-type': Promise<Rule>;
		readonly 'selector-no-vendor-prefix': Promise<Rule>;
		readonly 'selector-not-notation': Promise<Rule>;
		readonly 'selector-pseudo-class-allowed-list': Promise<Rule>;
		readonly 'selector-pseudo-class-disallowed-list': Promise<Rule>;
		readonly 'selector-pseudo-class-no-unknown': Promise<Rule>;
		readonly 'selector-pseudo-element-allowed-list': Promise<Rule>;
		readonly 'selector-pseudo-element-colon-notation': Promise<Rule>;
		readonly 'selector-pseudo-element-disallowed-list': Promise<Rule>;
		readonly 'selector-pseudo-element-no-unknown': Promise<Rule>;
		readonly 'selector-type-case': Promise<Rule>;
		readonly 'selector-type-no-unknown': Promise<Rule>;
		readonly 'shorthand-property-no-redundant-values': Promise<Rule>;
		readonly 'string-no-newline': Promise<Rule>;
		readonly 'time-min-milliseconds': Promise<Rule>;
		readonly 'unit-allowed-list': Promise<Rule>;
		readonly 'unit-disallowed-list': Promise<Rule>;
		readonly 'unit-no-unknown': Promise<Rule>;
		readonly 'value-keyword-case': Promise<Rule>;
		readonly 'value-no-vendor-prefix': Promise<Rule>;
	};

	/** @internal */
	export type GetPostcssOptions = {
		code?: string;
		codeFilename?: string;
		filePath?: string;
		customSyntax?: CustomSyntax;
	};

	/** @internal */
	export type GetLintSourceOptions = GetPostcssOptions & {
		existingPostcssResult?: PostCSS.Result;
		cache?: boolean;
	};

	/**
	 * Linter options.
	 */
	export type LinterOptions = {
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
	export type CssSyntaxError = {
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
	export type Warning = {
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
	export type LintResult = {
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
	export type DisableReportRange = {
		rule: string;
		start: number;
		end?: number;
	};

	/**
	 * A linter result.
	 */
	export type LinterResult = {
		/**
		 * The working directory from which the linter was run when the
		 * results were generated.
		 */
		cwd: string;
		results: LintResult[];
		errored: boolean;
		/**
		 * @deprecated Use `report` for the formatted problems, or use `code`
		 *   for the autofixed code instead. This will be removed in the next major version.
		 */
		output: string;
		/** @internal To show the deprecation warning. */
		_output?: string;
		/** @internal To show the deprecation warning. */
		_outputWarned?: boolean;
		/**
		 * A string that contains the formatted problems.
		 */
		report: string;
		/**
		 * A string that contains the autofixed code, if the `fix` option is set to `true`
		 * and the `code` option is provided.
		 */
		code?: string;
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
	export type Problem = {
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
		severity?: RuleSeverity;
	};

	/** @internal */
	export type ShorthandProperties =
		| 'animation'
		| 'background'
		| 'border'
		| 'border-block'
		| 'border-block-end'
		| 'border-block-start'
		| 'border-inline'
		| 'border-inline-end'
		| 'border-inline-start'
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
		| 'font-synthesis'
		| 'gap'
		| 'grid'
		| 'grid-area'
		| 'grid-column'
		| 'grid-gap'
		| 'grid-row'
		| 'grid-template'
		| 'inset'
		| 'inset-block'
		| 'inset-inline'
		| 'list-style'
		| 'margin'
		| 'margin-block'
		| 'margin-inline'
		| 'mask'
		| 'outline'
		| 'overflow'
		| 'overscroll-behavior'
		| 'padding'
		| 'padding-block'
		| 'padding-inline'
		| 'place-content'
		| 'place-items'
		| 'place-self'
		| 'scroll-margin'
		| 'scroll-margin-block'
		| 'scroll-margin-inline'
		| 'scroll-padding'
		| 'scroll-padding-block'
		| 'scroll-padding-inline'
		| 'text-decoration'
		| 'text-emphasis'
		| 'transition';

	/** @internal */
	export type LonghandSubPropertiesOfShorthandProperties = ReadonlyMap<
		ShorthandProperties,
		ReadonlySet<string>
	>;

	/**
	 * Utility functions.
	 */
	export type Utils = {
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
		) => Promise<void>;
	};

	/**
	 * Internal use only. Do not use or rely on this type. It may change at
	 * any time.
	 * @internal
	 */
	export type InternalApi = {
		_options: LinterOptions & { cwd: string };
		_extendExplorer: ReturnType<typeof cosmiconfig>;
		_specifiedConfigCache: Map<Config, Promise<CosmiconfigResult>>;
		_postcssResultCache: Map<string, PostCSS.Result>;
		_fileCache: FileCache;
	};

	/** @internal */
	export type DisableOptionsReport = DisableReportEntry[];

	/** @internal */
	export type PostcssPluginOptions = Omit<LinterOptions, 'customSyntax'> | Config;

	/**
	 * The Stylelint public API.
	 */
	export type PublicApi = PostCSS.PluginCreator<PostcssPluginOptions> & {
		/**
		 * Runs Stylelint with the given options and returns a Promise that
		 * resolves to the results.
		 *
		 * @param options - A lint options object
		 * @returns A lint result
		 */
		lint: (options: LinterOptions) => Promise<LinterResult>;

		/**
		 * Available rules.
		 */
		rules: BuiltInRules;

		/**
		 * Result report formatters by name.
		 */
		formatters: Formatters;

		/**
		 * Creates a Stylelint plugin.
		 */
		createPlugin: (ruleName: string, rule: Rule) => Plugin;

		/**
		 * The Stylelint "internal API" is passed among functions
		 * so that methods on a Stylelint instance can invoke
		 * each other while sharing options and caches.
		 *
		 * @internal
		 */
		_createLinter: (options: LinterOptions) => InternalApi;

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
			options?: Pick<LinterOptions, 'cwd' | 'config' | 'configBasedir' | 'configFile'>,
		) => Promise<Config | undefined>;

		/**
		 * Utility functions.
		 */
		utils: Utils;

		/**
		 * Reference objects.
		 */
		reference: {
			longhandSubPropertiesOfShorthandProperties: LonghandSubPropertiesOfShorthandProperties;
		};
	};
}

declare const stylelint: stylelint.PublicApi;

export = stylelint;
