'use strict';

const node_module = require('node:module');
const importLazy = require('import-lazy');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
const require$1 = node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('lib/rules/index.cjs', document.baseURI).href)));

/** @type {import('stylelint')['rules']} */
const rules = {
	'alpha-value-notation': importLazy(() => require$1('./alpha-value-notation/index.cjs'))(),
	'annotation-no-unknown': importLazy(() => require$1('./annotation-no-unknown/index.cjs'))(),
	'at-rule-allowed-list': importLazy(() => require$1('./at-rule-allowed-list/index.cjs'))(),
	'at-rule-disallowed-list': importLazy(() => require$1('./at-rule-disallowed-list/index.cjs'))(),
	'at-rule-empty-line-before': importLazy(() => require$1('./at-rule-empty-line-before/index.cjs'))(),
	'at-rule-no-unknown': importLazy(() => require$1('./at-rule-no-unknown/index.cjs'))(),
	'at-rule-no-vendor-prefix': importLazy(() => require$1('./at-rule-no-vendor-prefix/index.cjs'))(),
	'at-rule-property-required-list': importLazy(() =>
		require$1('./at-rule-property-required-list/index.cjs'),
	)(),
	'block-no-empty': importLazy(() => require$1('./block-no-empty/index.cjs'))(),
	'color-function-notation': importLazy(() => require$1('./color-function-notation/index.cjs'))(),
	'color-hex-alpha': importLazy(() => require$1('./color-hex-alpha/index.cjs'))(),
	'color-hex-length': importLazy(() => require$1('./color-hex-length/index.cjs'))(),
	'color-named': importLazy(() => require$1('./color-named/index.cjs'))(),
	'color-no-hex': importLazy(() => require$1('./color-no-hex/index.cjs'))(),
	'color-no-invalid-hex': importLazy(() => require$1('./color-no-invalid-hex/index.cjs'))(),
	'comment-empty-line-before': importLazy(() => require$1('./comment-empty-line-before/index.cjs'))(),
	'comment-no-empty': importLazy(() => require$1('./comment-no-empty/index.cjs'))(),
	'comment-pattern': importLazy(() => require$1('./comment-pattern/index.cjs'))(),
	'comment-whitespace-inside': importLazy(() => require$1('./comment-whitespace-inside/index.cjs'))(),
	'comment-word-disallowed-list': importLazy(() =>
		require$1('./comment-word-disallowed-list/index.cjs'),
	)(),
	'custom-media-pattern': importLazy(() => require$1('./custom-media-pattern/index.cjs'))(),
	'custom-property-empty-line-before': importLazy(() =>
		require$1('./custom-property-empty-line-before/index.cjs'),
	)(),
	'custom-property-no-missing-var-function': importLazy(() =>
		require$1('./custom-property-no-missing-var-function/index.cjs'),
	)(),
	'custom-property-pattern': importLazy(() => require$1('./custom-property-pattern/index.cjs'))(),
	'declaration-block-no-duplicate-custom-properties': importLazy(() =>
		require$1('./declaration-block-no-duplicate-custom-properties/index.cjs'),
	)(),
	'declaration-block-no-duplicate-properties': importLazy(() =>
		require$1('./declaration-block-no-duplicate-properties/index.cjs'),
	)(),
	'declaration-block-no-redundant-longhand-properties': importLazy(() =>
		require$1('./declaration-block-no-redundant-longhand-properties/index.cjs'),
	)(),
	'declaration-block-no-shorthand-property-overrides': importLazy(() =>
		require$1('./declaration-block-no-shorthand-property-overrides/index.cjs'),
	)(),
	'declaration-block-single-line-max-declarations': importLazy(() =>
		require$1('./declaration-block-single-line-max-declarations/index.cjs'),
	)(),
	'declaration-empty-line-before': importLazy(() =>
		require$1('./declaration-empty-line-before/index.cjs'),
	)(),
	'declaration-no-important': importLazy(() => require$1('./declaration-no-important/index.cjs'))(),
	'declaration-property-max-values': importLazy(() =>
		require$1('./declaration-property-max-values/index.cjs'),
	)(),
	'declaration-property-unit-allowed-list': importLazy(() =>
		require$1('./declaration-property-unit-allowed-list/index.cjs'),
	)(),
	'declaration-property-unit-disallowed-list': importLazy(() =>
		require$1('./declaration-property-unit-disallowed-list/index.cjs'),
	)(),
	'declaration-property-value-allowed-list': importLazy(() =>
		require$1('./declaration-property-value-allowed-list/index.cjs'),
	)(),
	'declaration-property-value-disallowed-list': importLazy(() =>
		require$1('./declaration-property-value-disallowed-list/index.cjs'),
	)(),
	'declaration-property-value-no-unknown': importLazy(() =>
		require$1('./declaration-property-value-no-unknown/index.cjs'),
	)(),
	'font-family-no-missing-generic-family-keyword': importLazy(() =>
		require$1('./font-family-no-missing-generic-family-keyword/index.cjs'),
	)(),
	'font-family-name-quotes': importLazy(() => require$1('./font-family-name-quotes/index.cjs'))(),
	'font-family-no-duplicate-names': importLazy(() =>
		require$1('./font-family-no-duplicate-names/index.cjs'),
	)(),
	'font-weight-notation': importLazy(() => require$1('./font-weight-notation/index.cjs'))(),
	'function-allowed-list': importLazy(() => require$1('./function-allowed-list/index.cjs'))(),
	'function-calc-no-unspaced-operator': importLazy(() =>
		require$1('./function-calc-no-unspaced-operator/index.cjs'),
	)(),

	'function-disallowed-list': importLazy(() => require$1('./function-disallowed-list/index.cjs'))(),
	'function-linear-gradient-no-nonstandard-direction': importLazy(() =>
		require$1('./function-linear-gradient-no-nonstandard-direction/index.cjs'),
	)(),

	'function-name-case': importLazy(() => require$1('./function-name-case/index.cjs'))(),
	'function-no-unknown': importLazy(() => require$1('./function-no-unknown/index.cjs'))(),

	'function-url-no-scheme-relative': importLazy(() =>
		require$1('./function-url-no-scheme-relative/index.cjs'),
	)(),
	'function-url-quotes': importLazy(() => require$1('./function-url-quotes/index.cjs'))(),
	'function-url-scheme-allowed-list': importLazy(() =>
		require$1('./function-url-scheme-allowed-list/index.cjs'),
	)(),
	'function-url-scheme-disallowed-list': importLazy(() =>
		require$1('./function-url-scheme-disallowed-list/index.cjs'),
	)(),

	'hue-degree-notation': importLazy(() => require$1('./hue-degree-notation/index.cjs'))(),
	'import-notation': importLazy(() => require$1('./import-notation/index.cjs'))(),
	'keyframe-block-no-duplicate-selectors': importLazy(() =>
		require$1('./keyframe-block-no-duplicate-selectors/index.cjs'),
	)(),
	'keyframe-declaration-no-important': importLazy(() =>
		require$1('./keyframe-declaration-no-important/index.cjs'),
	)(),
	'keyframe-selector-notation': importLazy(() =>
		require$1('./keyframe-selector-notation/index.cjs'),
	)(),
	'keyframes-name-pattern': importLazy(() => require$1('./keyframes-name-pattern/index.cjs'))(),
	'length-zero-no-unit': importLazy(() => require$1('./length-zero-no-unit/index.cjs'))(),
	'max-nesting-depth': importLazy(() => require$1('./max-nesting-depth/index.cjs'))(),
	'media-feature-name-allowed-list': importLazy(() =>
		require$1('./media-feature-name-allowed-list/index.cjs'),
	)(),
	'media-feature-name-disallowed-list': importLazy(() =>
		require$1('./media-feature-name-disallowed-list/index.cjs'),
	)(),
	'media-feature-name-no-unknown': importLazy(() =>
		require$1('./media-feature-name-no-unknown/index.cjs'),
	)(),
	'media-feature-name-no-vendor-prefix': importLazy(() =>
		require$1('./media-feature-name-no-vendor-prefix/index.cjs'),
	)(),
	'media-feature-name-unit-allowed-list': importLazy(() =>
		require$1('./media-feature-name-unit-allowed-list/index.cjs'),
	)(),
	'media-feature-name-value-allowed-list': importLazy(() =>
		require$1('./media-feature-name-value-allowed-list/index.cjs'),
	)(),
	'media-feature-name-value-no-unknown': importLazy(() =>
		require$1('./media-feature-name-value-no-unknown/index.cjs'),
	)(),
	'media-feature-range-notation': importLazy(() =>
		require$1('./media-feature-range-notation/index.cjs'),
	)(),

	'media-query-no-invalid': importLazy(() => require$1('./media-query-no-invalid/index.cjs'))(),
	'named-grid-areas-no-invalid': importLazy(() =>
		require$1('./named-grid-areas-no-invalid/index.cjs'),
	)(),
	'no-descending-specificity': importLazy(() => require$1('./no-descending-specificity/index.cjs'))(),
	'no-duplicate-at-import-rules': importLazy(() =>
		require$1('./no-duplicate-at-import-rules/index.cjs'),
	)(),
	'no-duplicate-selectors': importLazy(() => require$1('./no-duplicate-selectors/index.cjs'))(),
	'no-empty-source': importLazy(() => require$1('./no-empty-source/index.cjs'))(),
	'no-invalid-double-slash-comments': importLazy(() =>
		require$1('./no-invalid-double-slash-comments/index.cjs'),
	)(),
	'no-invalid-position-at-import-rule': importLazy(() =>
		require$1('./no-invalid-position-at-import-rule/index.cjs'),
	)(),
	'no-irregular-whitespace': importLazy(() => require$1('./no-irregular-whitespace/index.cjs'))(),
	'no-unknown-animations': importLazy(() => require$1('./no-unknown-animations/index.cjs'))(),
	'no-unknown-custom-properties': importLazy(() =>
		require$1('./no-unknown-custom-properties/index.cjs'),
	)(),
	'number-max-precision': importLazy(() => require$1('./number-max-precision/index.cjs'))(),
	'property-allowed-list': importLazy(() => require$1('./property-allowed-list/index.cjs'))(),
	'property-disallowed-list': importLazy(() => require$1('./property-disallowed-list/index.cjs'))(),
	'property-no-unknown': importLazy(() => require$1('./property-no-unknown/index.cjs'))(),
	'property-no-vendor-prefix': importLazy(() => require$1('./property-no-vendor-prefix/index.cjs'))(),
	'rule-empty-line-before': importLazy(() => require$1('./rule-empty-line-before/index.cjs'))(),
	'rule-selector-property-disallowed-list': importLazy(() =>
		require$1('./rule-selector-property-disallowed-list/index.cjs'),
	)(),
	'selector-anb-no-unmatchable': importLazy(() =>
		require$1('./selector-anb-no-unmatchable/index.cjs'),
	)(),
	'selector-attribute-name-disallowed-list': importLazy(() =>
		require$1('./selector-attribute-name-disallowed-list/index.cjs'),
	)(),
	'selector-attribute-operator-allowed-list': importLazy(() =>
		require$1('./selector-attribute-operator-allowed-list/index.cjs'),
	)(),
	'selector-attribute-operator-disallowed-list': importLazy(() =>
		require$1('./selector-attribute-operator-disallowed-list/index.cjs'),
	)(),
	'selector-attribute-quotes': importLazy(() => require$1('./selector-attribute-quotes/index.cjs'))(),
	'selector-class-pattern': importLazy(() => require$1('./selector-class-pattern/index.cjs'))(),
	'selector-combinator-allowed-list': importLazy(() =>
		require$1('./selector-combinator-allowed-list/index.cjs'),
	)(),
	'selector-combinator-disallowed-list': importLazy(() =>
		require$1('./selector-combinator-disallowed-list/index.cjs'),
	)(),

	'selector-disallowed-list': importLazy(() => require$1('./selector-disallowed-list/index.cjs'))(),
	'selector-id-pattern': importLazy(() => require$1('./selector-id-pattern/index.cjs'))(),

	'selector-max-attribute': importLazy(() => require$1('./selector-max-attribute/index.cjs'))(),
	'selector-max-class': importLazy(() => require$1('./selector-max-class/index.cjs'))(),
	'selector-max-combinators': importLazy(() => require$1('./selector-max-combinators/index.cjs'))(),
	'selector-max-compound-selectors': importLazy(() =>
		require$1('./selector-max-compound-selectors/index.cjs'),
	)(),

	'selector-max-id': importLazy(() => require$1('./selector-max-id/index.cjs'))(),
	'selector-max-pseudo-class': importLazy(() => require$1('./selector-max-pseudo-class/index.cjs'))(),
	'selector-max-specificity': importLazy(() => require$1('./selector-max-specificity/index.cjs'))(),
	'selector-max-type': importLazy(() => require$1('./selector-max-type/index.cjs'))(),
	'selector-max-universal': importLazy(() => require$1('./selector-max-universal/index.cjs'))(),
	'selector-nested-pattern': importLazy(() => require$1('./selector-nested-pattern/index.cjs'))(),
	'selector-no-qualifying-type': importLazy(() =>
		require$1('./selector-no-qualifying-type/index.cjs'),
	)(),
	'selector-no-vendor-prefix': importLazy(() => require$1('./selector-no-vendor-prefix/index.cjs'))(),
	'selector-not-notation': importLazy(() => require$1('./selector-not-notation/index.cjs'))(),
	'selector-pseudo-class-allowed-list': importLazy(() =>
		require$1('./selector-pseudo-class-allowed-list/index.cjs'),
	)(),
	'selector-pseudo-class-disallowed-list': importLazy(() =>
		require$1('./selector-pseudo-class-disallowed-list/index.cjs'),
	)(),
	'selector-pseudo-class-no-unknown': importLazy(() =>
		require$1('./selector-pseudo-class-no-unknown/index.cjs'),
	)(),
	'selector-pseudo-element-allowed-list': importLazy(() =>
		require$1('./selector-pseudo-element-allowed-list/index.cjs'),
	)(),
	'selector-pseudo-element-colon-notation': importLazy(() =>
		require$1('./selector-pseudo-element-colon-notation/index.cjs'),
	)(),
	'selector-pseudo-element-disallowed-list': importLazy(() =>
		require$1('./selector-pseudo-element-disallowed-list/index.cjs'),
	)(),
	'selector-pseudo-element-no-unknown': importLazy(() =>
		require$1('./selector-pseudo-element-no-unknown/index.cjs'),
	)(),
	'selector-type-case': importLazy(() => require$1('./selector-type-case/index.cjs'))(),
	'selector-type-no-unknown': importLazy(() => require$1('./selector-type-no-unknown/index.cjs'))(),
	'shorthand-property-no-redundant-values': importLazy(() =>
		require$1('./shorthand-property-no-redundant-values/index.cjs'),
	)(),
	'string-no-newline': importLazy(() => require$1('./string-no-newline/index.cjs'))(),
	'time-min-milliseconds': importLazy(() => require$1('./time-min-milliseconds/index.cjs'))(),
	'unit-allowed-list': importLazy(() => require$1('./unit-allowed-list/index.cjs'))(),
	'unit-disallowed-list': importLazy(() => require$1('./unit-disallowed-list/index.cjs'))(),
	'unit-no-unknown': importLazy(() => require$1('./unit-no-unknown/index.cjs'))(),
	'value-keyword-case': importLazy(() => require$1('./value-keyword-case/index.cjs'))(),
	'value-no-vendor-prefix': importLazy(() => require$1('./value-no-vendor-prefix/index.cjs'))(),
};

module.exports = rules;
