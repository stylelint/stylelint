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

type ConfigProcessors = string[];

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
		except?: Array<StringOrRegex>;
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
		formatter?: FormatterType | Formatter;
		defaultSeverity?: Severity;
		ignoreDisables?: boolean;
		reportNeedlessDisables?: DisableSettings;
		reportInvalidScopeDisables?: DisableSettings;
		reportDescriptionlessDisables?: DisableSettings;
		configurationComment?: string;
		overrides?: ConfigOverride[];
		customSyntax?: CustomSyntax;
		processors?: ConfigProcessors;
		/** @internal */
		_processorFunctions?: Map<string, ReturnType<Processor>['postprocess']>;
		allowEmptyInput?: boolean;
		cache?: boolean;
		fix?: boolean;
		validate?: boolean;
	};

	/** @internal */
	export type DisablePropertyName = PropertyNamesOfType<Config, DisableSettings>;

	/** @internal */
	export type CosmiconfigResult =
		| (ReturnType<CosmiconfigTransformSync> & { config: Config })
		| null;

	/** @internal */
	export type DisabledRange = {
		node: PostCSS.Node;
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
		customUrls: { [ruleName: string]: string };
		ruleMetadata: { [ruleName: string]: Partial<RuleMeta> };
		fixersData: { [ruleName: string]: Array<FixerData> };
		quiet?: boolean;
		disabledRanges: DisabledRangeObject;
		disabledWarnings?: DisabledWarning[];
		ignored?: boolean;
		stylelintError?: boolean;
		stylelintWarning?: boolean;
		config?: Config;
	};

	type StylelintWarningType = 'deprecation' | 'invalidOption' | 'parseError';

	/** @internal */
	export type WarningOptions = PostCSS.WarningOptions & {
		stylelintType?: StylelintWarningType;
		severity?: Severity;
		url?: string;
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
		/** @deprecated */
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

	/**
	 * WARNING: This is an experimental feature. The API may change in the future.
	 */
	export type Processor = () => {
		name: string;
		postprocess: (result: LintResult, root?: PostCSS.Root) => void;
	};

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
		secondaryOptions: S,
		context: RuleContext,
	) => (root: PostCSS.Root, result: PostcssResult) => Promise<void> | void;

	/** @internal */
	export type RuleMeta = {
		url: string;
		deprecated?: boolean;
		fixable?: boolean;
	};

	/** @internal */
	export type Range = {
		start: Position;
		end: Position;
	};

	type FixerData = {
		range?: Range;
		fixed: boolean;
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

	type StringOrRegex = string | RegExp;
	type OneOrMany<S> = S | S[];
	type Primary = number | true | OneOrMany<StringOrRegex> | Record<string, any>;
	type Secondary = Record<string, any>;
	type CoreRule<P extends Primary, S extends Secondary = any> = Rule<P, S>;

	/** @internal */
	export type CoreRules = {
		'alpha-value-notation': CoreRule<
			'number' | 'percentage',
			{ exceptProperties: OneOrMany<StringOrRegex> }
		>;
		'annotation-no-unknown': CoreRule<true, { ignoreAnnotations: OneOrMany<StringOrRegex> }>;
		'at-rule-allowed-list': CoreRule<OneOrMany<string>>;
		'at-rule-disallowed-list': CoreRule<OneOrMany<string>>;
		'at-rule-empty-line-before': CoreRule<
			'always' | 'never',
			{
				except: OneOrMany<
					| 'after-same-name'
					| 'inside-block'
					| 'blockless-after-same-name-blockless'
					| 'blockless-after-blockless'
					| 'first-nested'
				>;
				ignore: OneOrMany<
					| 'after-comment'
					| 'first-nested'
					| 'inside-block'
					| 'blockless-after-same-name-blockless'
					| 'blockless-after-blockless'
				>;
				ignoreAtRules: OneOrMany<string>;
			}
		>;
		'at-rule-no-unknown': CoreRule<true, { ignoreAtRules: OneOrMany<StringOrRegex> }>;
		'at-rule-no-vendor-prefix': CoreRule<true>;
		'at-rule-property-required-list': CoreRule<Record<string, OneOrMany<string>>>;
		'block-no-empty': CoreRule<true, { ignore: OneOrMany<'comments'> }>;
		'color-function-notation': CoreRule<
			'modern' | 'legacy',
			{ ignore: OneOrMany<'with-var-inside'> }
		>;
		'color-hex-alpha': CoreRule<'always' | 'never'>;
		'color-hex-length': CoreRule<'short' | 'long'>;
		'color-named': CoreRule<
			'never' | 'always-where-possible',
			{ ignoreProperties: OneOrMany<StringOrRegex>; ignore: OneOrMany<'inside-function'> }
		>;
		'color-no-hex': CoreRule<true>;
		'color-no-invalid-hex': CoreRule<true>;
		'comment-empty-line-before': CoreRule<
			'always' | 'never',
			{
				except: OneOrMany<'first-nested'>;
				ignore: OneOrMany<'stylelint-commands' | 'after-comment'>;
				ignoreComments: OneOrMany<StringOrRegex>;
			}
		>;
		'comment-no-empty': CoreRule<true>;
		'comment-pattern': CoreRule<StringOrRegex>;
		'comment-whitespace-inside': CoreRule<'always' | 'never'>;
		'comment-word-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'custom-media-pattern': CoreRule<StringOrRegex>;
		'custom-property-empty-line-before': CoreRule<
			'always' | 'never',
			{
				except: OneOrMany<'first-nested' | 'after-comment' | 'after-custom-property'>;
				ignore: OneOrMany<'after-comment' | 'first-nested' | 'inside-single-line-block'>;
			}
		>;
		'custom-property-no-missing-var-function': CoreRule<true>;
		'custom-property-pattern': CoreRule<StringOrRegex>;
		'declaration-block-no-duplicate-custom-properties': CoreRule<
			true,
			{ ignoreProperties: OneOrMany<StringOrRegex> }
		>;
		'declaration-block-no-duplicate-properties': CoreRule<
			true,
			{
				ignore: OneOrMany<
					| 'consecutive-duplicates'
					| 'consecutive-duplicates-with-different-values'
					| 'consecutive-duplicates-with-different-syntaxes'
					| 'consecutive-duplicates-with-same-prefixless-values'
				>;
				ignoreProperties: OneOrMany<StringOrRegex>;
			}
		>;
		'declaration-block-no-redundant-longhand-properties': CoreRule<
			true,
			{
				ignoreShorthands: OneOrMany<StringOrRegex>;
				ignoreLonghands: OneOrMany<string>;
			}
		>;
		'declaration-block-no-shorthand-property-overrides': CoreRule<true>;
		'declaration-block-single-line-max-declarations': CoreRule<number>;
		'declaration-empty-line-before': CoreRule<
			'always' | 'never',
			{
				except: OneOrMany<'first-nested' | 'after-comment' | 'after-declaration'>;
				ignore: OneOrMany<
					'after-comment' | 'after-declaration' | 'first-nested' | 'inside-single-line-block'
				>;
			}
		>;
		'declaration-no-important': CoreRule<true>;
		'declaration-property-max-values': CoreRule<Record<string, number>>;
		'declaration-property-unit-allowed-list': CoreRule<
			Record<string, OneOrMany<string>>,
			{ ignore: OneOrMany<'inside-function'> }
		>;
		'declaration-property-unit-disallowed-list': CoreRule<Record<string, OneOrMany<string>>>;
		'declaration-property-value-allowed-list': CoreRule<Record<string, OneOrMany<StringOrRegex>>>;
		'declaration-property-value-disallowed-list': CoreRule<
			Record<string, OneOrMany<StringOrRegex>>
		>;
		'declaration-property-value-no-unknown': CoreRule<
			true,
			{
				ignoreProperties: Record<string, OneOrMany<StringOrRegex>>;
				propertiesSyntax: Record<string, string>;
				typesSyntax: Record<string, string>;
			}
		>;
		'font-family-name-quotes': CoreRule<
			'always-where-required' | 'always-where-recommended' | 'always-unless-keyword'
		>;
		'font-family-no-duplicate-names': CoreRule<
			true,
			{ ignoreFontFamilyNames: OneOrMany<StringOrRegex> }
		>;
		'font-family-no-missing-generic-family-keyword': CoreRule<
			true,
			{ ignoreFontFamilies: OneOrMany<StringOrRegex> }
		>;
		'font-weight-notation': CoreRule<
			'numeric' | 'named-where-possible',
			{ ignore: OneOrMany<'relative'> }
		>;
		'function-allowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'function-calc-no-unspaced-operator': CoreRule<true>;
		'function-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'function-linear-gradient-no-nonstandard-direction': CoreRule<true>;
		'function-name-case': CoreRule<
			'lower' | 'upper',
			{ ignoreFunctions: OneOrMany<StringOrRegex> }
		>;
		'function-no-unknown': CoreRule<true, { ignoreFunctions: OneOrMany<StringOrRegex> }>;
		'function-url-no-scheme-relative': CoreRule<true>;
		'function-url-quotes': CoreRule<'always' | 'never', { except: OneOrMany<'empty'> }>;
		'function-url-scheme-allowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'function-url-scheme-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'hue-degree-notation': CoreRule<'angle' | 'number'>;
		'import-notation': CoreRule<'string' | 'url'>;
		'keyframe-block-no-duplicate-selectors': CoreRule<true>;
		'keyframe-declaration-no-important': CoreRule<true>;
		'keyframe-selector-notation': CoreRule<
			'keyword' | 'percentage' | 'percentage-unless-within-keyword-only-block'
		>;
		'keyframes-name-pattern': CoreRule<StringOrRegex>;
		'length-zero-no-unit': CoreRule<
			true,
			{
				ignore: OneOrMany<'custom-properties'>;
				ignoreFunctions: OneOrMany<StringOrRegex>;
			}
		>;
		'lightness-notation': CoreRule<'percentage' | 'number'>;
		'max-nesting-depth': CoreRule<
			number,
			{
				ignore: OneOrMany<'blockless-at-rules' | 'pseudo-classes'>;
				ignoreAtRules: OneOrMany<StringOrRegex>;
				ignoreRules: OneOrMany<StringOrRegex>;
				ignorePseudoClasses: OneOrMany<StringOrRegex>;
			}
		>;
		'media-feature-name-allowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'media-feature-name-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'media-feature-name-no-unknown': CoreRule<
			true,
			{ ignoreMediaFeatureNames: OneOrMany<StringOrRegex> }
		>;
		'media-feature-name-no-vendor-prefix': CoreRule<true>;
		'media-feature-name-unit-allowed-list': CoreRule<Record<string, OneOrMany<string>>>;
		'media-feature-name-value-allowed-list': CoreRule<Record<string, OneOrMany<StringOrRegex>>>;
		'media-feature-name-value-no-unknown': CoreRule<true>;
		'media-feature-range-notation': CoreRule<'prefix' | 'context'>;
		'media-query-no-invalid': CoreRule<true>;
		'named-grid-areas-no-invalid': CoreRule<true>;
		'no-descending-specificity': CoreRule<true, { ignore: OneOrMany<'selectors-within-list'> }>;
		'no-duplicate-at-import-rules': CoreRule<true>;
		'no-duplicate-selectors': CoreRule<true, { disallowInList: boolean }>;
		'no-empty-source': CoreRule<true>;
		'no-invalid-double-slash-comments': CoreRule<true>;
		'no-invalid-position-at-import-rule': CoreRule<
			true,
			{ ignoreAtRules: OneOrMany<StringOrRegex> }
		>;
		'no-irregular-whitespace': CoreRule<true>;
		'no-unknown-animations': CoreRule<true>;
		'no-unknown-custom-media': CoreRule<true>;
		'no-unknown-custom-properties': CoreRule<true>;
		'number-max-precision': CoreRule<
			number,
			{
				ignoreProperties: OneOrMany<StringOrRegex>;
				ignoreUnits: OneOrMany<StringOrRegex>;
				insideFunctions: Record<string, number>;
			}
		>;
		'property-allowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'property-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'property-no-unknown': CoreRule<
			true,
			{
				checkPrefixed: boolean;
				ignoreAtRules: OneOrMany<StringOrRegex>;
				ignoreProperties: OneOrMany<StringOrRegex>;
				ignoreSelectors: OneOrMany<StringOrRegex>;
			}
		>;
		'property-no-vendor-prefix': CoreRule<true, { ignoreProperties: OneOrMany<StringOrRegex> }>;
		'rule-empty-line-before': CoreRule<
			'always' | 'never' | 'always-multi-line' | 'never-multi-line',
			{
				ignore: OneOrMany<'after-comment' | 'first-nested' | 'inside-block'>;
				except: OneOrMany<
					| 'after-rule'
					| 'after-single-line-comment'
					| 'first-nested'
					| 'inside-block-and-after-rule'
					| 'inside-block'
				>;
			}
		>;
		'rule-selector-property-disallowed-list': CoreRule<
			Record<string, OneOrMany<StringOrRegex>>,
			{
				ignore: OneOrMany<'keyframe-selectors'>;
			}
		>;
		'selector-anb-no-unmatchable': CoreRule<true>;
		'selector-attribute-name-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'selector-attribute-operator-allowed-list': CoreRule<OneOrMany<string>>;
		'selector-attribute-operator-disallowed-list': CoreRule<OneOrMany<string>>;
		'selector-attribute-quotes': CoreRule<'always' | 'never'>;
		'selector-class-pattern': CoreRule<StringOrRegex, { resolveNestedSelectors: boolean }>;
		'selector-combinator-allowed-list': CoreRule<OneOrMany<string>>;
		'selector-combinator-disallowed-list': CoreRule<OneOrMany<string>>;
		'selector-disallowed-list': CoreRule<
			OneOrMany<StringOrRegex>,
			{ splitList: boolean; ignore: OneOrMany<'inside-block' | 'keyframe-selectors'> }
		>;
		'selector-id-pattern': CoreRule<StringOrRegex>;
		'selector-max-attribute': CoreRule<number, { ignoreAttributes: OneOrMany<StringOrRegex> }>;
		'selector-max-class': CoreRule<number>;
		'selector-max-combinators': CoreRule<number>;
		'selector-max-compound-selectors': CoreRule<
			number,
			{ ignoreSelectors: OneOrMany<StringOrRegex> }
		>;
		'selector-max-id': CoreRule<
			number,
			{
				ignoreContextFunctionalPseudoClasses: OneOrMany<StringOrRegex>;
				checkContextFunctionalPseudoClasses: OneOrMany<StringOrRegex>;
			}
		>;
		'selector-max-pseudo-class': CoreRule<number>;
		'selector-max-specificity': CoreRule<string, { ignoreSelectors: OneOrMany<StringOrRegex> }>;
		'selector-max-type': CoreRule<
			number,
			{
				ignore: OneOrMany<
					'descendant' | 'child' | 'compounded' | 'next-sibling' | 'custom-elements'
				>;
				ignoreTypes: OneOrMany<StringOrRegex>;
			}
		>;
		'selector-max-universal': CoreRule<number, { ignoreAfterCombinators: OneOrMany<string> }>;
		'selector-nested-pattern': CoreRule<StringOrRegex, { splitList: boolean }>;
		'selector-no-qualifying-type': CoreRule<
			true,
			{ ignore: OneOrMany<'attribute' | 'class' | 'id'> }
		>;
		'selector-no-vendor-prefix': CoreRule<true, { ignoreSelectors: OneOrMany<StringOrRegex> }>;
		'selector-not-notation': CoreRule<'simple' | 'complex'>;
		'selector-pseudo-class-allowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'selector-pseudo-class-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'selector-pseudo-class-no-unknown': CoreRule<
			true,
			{ ignorePseudoClasses: OneOrMany<StringOrRegex> }
		>;
		'selector-pseudo-element-allowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'selector-pseudo-element-colon-notation': CoreRule<'single' | 'double'>;
		'selector-pseudo-element-disallowed-list': CoreRule<OneOrMany<StringOrRegex>>;
		'selector-pseudo-element-no-unknown': CoreRule<
			true,
			{ ignorePseudoElements: OneOrMany<StringOrRegex> }
		>;
		'selector-type-case': CoreRule<'lower' | 'upper', { ignoreTypes: OneOrMany<StringOrRegex> }>;
		'selector-type-no-unknown': CoreRule<
			true,
			{
				ignore: OneOrMany<'custom-elements' | 'default-namespace'>;
				ignoreNamespaces: OneOrMany<StringOrRegex>;
				ignoreTypes: OneOrMany<StringOrRegex>;
			}
		>;
		'shorthand-property-no-redundant-values': CoreRule<true>;
		'string-no-newline': CoreRule<true>;
		'time-min-milliseconds': CoreRule<number, { ignore: OneOrMany<'delay'> }>;
		'unit-allowed-list': CoreRule<
			OneOrMany<string>,
			{
				ignoreFunctions: OneOrMany<StringOrRegex>;
				ignoreProperties: Record<string, OneOrMany<StringOrRegex>>;
			}
		>;
		'unit-disallowed-list': CoreRule<
			OneOrMany<string>,
			{
				ignoreFunctions: OneOrMany<StringOrRegex>;
				ignoreProperties: Record<string, OneOrMany<StringOrRegex>>;
				ignoreMediaFeatureNames: Record<string, OneOrMany<StringOrRegex>>;
			}
		>;
		'unit-no-unknown': CoreRule<
			true,
			{
				ignoreUnits: OneOrMany<StringOrRegex>;
				ignoreFunctions: OneOrMany<StringOrRegex>;
			}
		>;
		'value-keyword-case': CoreRule<
			'lower' | 'upper',
			{
				ignoreProperties: OneOrMany<StringOrRegex>;
				ignoreKeywords: OneOrMany<StringOrRegex>;
				ignoreFunctions: OneOrMany<StringOrRegex>;
				camelCaseSvgKeywords: boolean;
			}
		>;
		'value-no-vendor-prefix': CoreRule<true, { ignoreValues: OneOrMany<StringOrRegex> }>;
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
		files?: OneOrMany<string>;
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
		ignorePath?: OneOrMany<string>;
		ignorePattern?: string[];
		reportDescriptionlessDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportInvalidScopeDisables?: boolean;
		maxWarnings?: number;
		customSyntax?: CustomSyntax;
		/** @internal */
		_defaultFormatter?: FormatterType;
		formatter?: FormatterType | Formatter;
		disableDefaultIgnores?: boolean;
		fix?: boolean;
		allowEmptyInput?: boolean;
		quiet?: boolean;
		quietDeprecationWarnings?: boolean;
		validate?: boolean;
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
		url?: string;
		stylelintType?: StylelintWarningType;
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
		parseErrors: (PostCSS.Warning & {
			stylelintType: Extract<StylelintWarningType, 'parseError'>;
		})[];
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

	type Position = {
		line: number;
		column: number;
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
		start?: Position;
		/**
		 * The exclusive end position of the problem, relative to the
		 * node's source text. If provided, this will be used instead of
		 * `endIndex`.
		 */
		end?: Position;
		word?: string;
		line?: number;
		/**
		 * Optional severity override for the problem.
		 */
		severity?: RuleSeverity;
		fix?: () => void | undefined | never;
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
		| 'font-variant'
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
		_specifiedConfigCache: Map<Config, Map<string, CosmiconfigResult>>;
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
		rules: { readonly [name in keyof CoreRules]: Promise<CoreRules[name]> };

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
