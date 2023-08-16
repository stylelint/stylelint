'use strict';

const node_module = require('node:module');
const importLazy = require('import-lazy');

// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
const require$1 = node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('lib/rules/index.cjs', document.baseURI).href)));

/** @type {import('stylelint')['rules']} */
const rules = {
	'alpha-value-notation': importLazy(() => require$1('./alpha-value-notation/index.js'))(),
	'annotation-no-unknown': importLazy(() => require$1('./annotation-no-unknown/index.js'))(),
	'at-rule-allowed-list': importLazy(() => require$1('./at-rule-allowed-list/index.js'))(),
	'at-rule-disallowed-list': importLazy(() => require$1('./at-rule-disallowed-list/index.js'))(),
	'at-rule-empty-line-before': importLazy(() => require$1('./at-rule-empty-line-before/index.js'))(),
	'at-rule-no-unknown': importLazy(() => require$1('./at-rule-no-unknown/index.js'))(),
	'at-rule-no-vendor-prefix': importLazy(() => require$1('./at-rule-no-vendor-prefix/index.js'))(),
	'at-rule-property-required-list': importLazy(() =>
		require$1('./at-rule-property-required-list/index.js'),
	)(),
	'block-no-empty': importLazy(() => require$1('./block-no-empty/index.js'))(),
	'color-function-notation': importLazy(() => require$1('./color-function-notation/index.js'))(),
	'color-hex-alpha': importLazy(() => require$1('./color-hex-alpha/index.js'))(),
	'color-hex-length': importLazy(() => require$1('./color-hex-length/index.js'))(),
	'color-named': importLazy(() => require$1('./color-named/index.js'))(),
	'color-no-hex': importLazy(() => require$1('./color-no-hex/index.js'))(),
	'color-no-invalid-hex': importLazy(() => require$1('./color-no-invalid-hex/index.js'))(),
	'comment-empty-line-before': importLazy(() => require$1('./comment-empty-line-before/index.js'))(),
	'comment-no-empty': importLazy(() => require$1('./comment-no-empty/index.js'))(),
	'comment-pattern': importLazy(() => require$1('./comment-pattern/index.js'))(),
	'comment-whitespace-inside': importLazy(() => require$1('./comment-whitespace-inside/index.js'))(),
	'comment-word-disallowed-list': importLazy(() =>
		require$1('./comment-word-disallowed-list/index.js'),
	)(),
	'custom-media-pattern': importLazy(() => require$1('./custom-media-pattern/index.js'))(),
	'custom-property-empty-line-before': importLazy(() =>
		require$1('./custom-property-empty-line-before/index.js'),
	)(),
	'custom-property-no-missing-var-function': importLazy(() =>
		require$1('./custom-property-no-missing-var-function/index.js'),
	)(),
	'custom-property-pattern': importLazy(() => require$1('./custom-property-pattern/index.js'))(),
	'declaration-block-no-duplicate-custom-properties': importLazy(() =>
		require$1('./declaration-block-no-duplicate-custom-properties/index.js'),
	)(),
	'declaration-block-no-duplicate-properties': importLazy(() =>
		require$1('./declaration-block-no-duplicate-properties/index.js'),
	)(),
	'declaration-block-no-redundant-longhand-properties': importLazy(() =>
		require$1('./declaration-block-no-redundant-longhand-properties/index.js'),
	)(),
	'declaration-block-no-shorthand-property-overrides': importLazy(() =>
		require$1('./declaration-block-no-shorthand-property-overrides/index.js'),
	)(),
	'declaration-block-single-line-max-declarations': importLazy(() =>
		require$1('./declaration-block-single-line-max-declarations/index.js'),
	)(),
	'declaration-empty-line-before': importLazy(() =>
		require$1('./declaration-empty-line-before/index.js'),
	)(),
	'declaration-no-important': importLazy(() => require$1('./declaration-no-important/index.js'))(),
	'declaration-property-max-values': importLazy(() =>
		require$1('./declaration-property-max-values/index.js'),
	)(),
	'declaration-property-unit-allowed-list': importLazy(() =>
		require$1('./declaration-property-unit-allowed-list/index.js'),
	)(),
	'declaration-property-unit-disallowed-list': importLazy(() =>
		require$1('./declaration-property-unit-disallowed-list/index.js'),
	)(),
	'declaration-property-value-allowed-list': importLazy(() =>
		require$1('./declaration-property-value-allowed-list/index.js'),
	)(),
	'declaration-property-value-disallowed-list': importLazy(() =>
		require$1('./declaration-property-value-disallowed-list/index.js'),
	)(),
	'declaration-property-value-no-unknown': importLazy(() =>
		require$1('./declaration-property-value-no-unknown/index.js'),
	)(),
	'font-family-no-missing-generic-family-keyword': importLazy(() =>
		require$1('./font-family-no-missing-generic-family-keyword/index.js'),
	)(),
	'font-family-name-quotes': importLazy(() => require$1('./font-family-name-quotes/index.js'))(),
	'font-family-no-duplicate-names': importLazy(() =>
		require$1('./font-family-no-duplicate-names/index.js'),
	)(),
	'font-weight-notation': importLazy(() => require$1('./font-weight-notation/index.js'))(),
	'function-allowed-list': importLazy(() => require$1('./function-allowed-list/index.js'))(),
	'function-calc-no-unspaced-operator': importLazy(() =>
		require$1('./function-calc-no-unspaced-operator/index.js'),
	)(),

	'function-disallowed-list': importLazy(() => require$1('./function-disallowed-list/index.js'))(),
	'function-linear-gradient-no-nonstandard-direction': importLazy(() =>
		require$1('./function-linear-gradient-no-nonstandard-direction/index.js'),
	)(),

	'function-name-case': importLazy(() => require$1('./function-name-case/index.js'))(),
	'function-no-unknown': importLazy(() => require$1('./function-no-unknown/index.js'))(),

	'function-url-no-scheme-relative': importLazy(() =>
		require$1('./function-url-no-scheme-relative/index.js'),
	)(),
	'function-url-quotes': importLazy(() => require$1('./function-url-quotes/index.js'))(),
	'function-url-scheme-allowed-list': importLazy(() =>
		require$1('./function-url-scheme-allowed-list/index.js'),
	)(),
	'function-url-scheme-disallowed-list': importLazy(() =>
		require$1('./function-url-scheme-disallowed-list/index.js'),
	)(),

	'hue-degree-notation': importLazy(() => require$1('./hue-degree-notation/index.js'))(),
	'import-notation': importLazy(() => require$1('./import-notation/index.js'))(),
	'keyframe-block-no-duplicate-selectors': importLazy(() =>
		require$1('./keyframe-block-no-duplicate-selectors/index.js'),
	)(),
	'keyframe-declaration-no-important': importLazy(() =>
		require$1('./keyframe-declaration-no-important/index.js'),
	)(),
	'keyframe-selector-notation': importLazy(() =>
		require$1('./keyframe-selector-notation/index.js'),
	)(),
	'keyframes-name-pattern': importLazy(() => require$1('./keyframes-name-pattern/index.js'))(),
	'length-zero-no-unit': importLazy(() => require$1('./length-zero-no-unit/index.js'))(),
	'max-nesting-depth': importLazy(() => require$1('./max-nesting-depth/index.js'))(),
	'media-feature-name-allowed-list': importLazy(() =>
		require$1('./media-feature-name-allowed-list/index.js'),
	)(),
	'media-feature-name-disallowed-list': importLazy(() =>
		require$1('./media-feature-name-disallowed-list/index.js'),
	)(),
	'media-feature-name-no-unknown': importLazy(() =>
		require$1('./media-feature-name-no-unknown/index.js'),
	)(),
	'media-feature-name-no-vendor-prefix': importLazy(() =>
		require$1('./media-feature-name-no-vendor-prefix/index.js'),
	)(),
	'media-feature-name-unit-allowed-list': importLazy(() =>
		require$1('./media-feature-name-unit-allowed-list/index.js'),
	)(),
	'media-feature-name-value-allowed-list': importLazy(() =>
		require$1('./media-feature-name-value-allowed-list/index.js'),
	)(),
	'media-feature-name-value-no-unknown': importLazy(() =>
		require$1('./media-feature-name-value-no-unknown/index.js'),
	)(),
	'media-feature-range-notation': importLazy(() =>
		require$1('./media-feature-range-notation/index.js'),
	)(),

	'media-query-no-invalid': importLazy(() => require$1('./media-query-no-invalid/index.js'))(),
	'named-grid-areas-no-invalid': importLazy(() =>
		require$1('./named-grid-areas-no-invalid/index.js'),
	)(),
	'no-descending-specificity': importLazy(() => require$1('./no-descending-specificity/index.js'))(),
	'no-duplicate-at-import-rules': importLazy(() =>
		require$1('./no-duplicate-at-import-rules/index.js'),
	)(),
	'no-duplicate-selectors': importLazy(() => require$1('./no-duplicate-selectors/index.js'))(),
	'no-empty-source': importLazy(() => require$1('./no-empty-source/index.js'))(),
	'no-invalid-double-slash-comments': importLazy(() =>
		require$1('./no-invalid-double-slash-comments/index.js'),
	)(),
	'no-invalid-position-at-import-rule': importLazy(() =>
		require$1('./no-invalid-position-at-import-rule/index.js'),
	)(),
	'no-irregular-whitespace': importLazy(() => require$1('./no-irregular-whitespace/index.js'))(),
	'no-unknown-animations': importLazy(() => require$1('./no-unknown-animations/index.js'))(),
	'no-unknown-custom-properties': importLazy(() =>
		require$1('./no-unknown-custom-properties/index.js'),
	)(),
	'number-max-precision': importLazy(() => require$1('./number-max-precision/index.js'))(),
	'property-allowed-list': importLazy(() => require$1('./property-allowed-list/index.js'))(),
	'property-disallowed-list': importLazy(() => require$1('./property-disallowed-list/index.js'))(),
	'property-no-unknown': importLazy(() => require$1('./property-no-unknown/index.js'))(),
	'property-no-vendor-prefix': importLazy(() => require$1('./property-no-vendor-prefix/index.js'))(),
	'rule-empty-line-before': importLazy(() => require$1('./rule-empty-line-before/index.js'))(),
	'rule-selector-property-disallowed-list': importLazy(() =>
		require$1('./rule-selector-property-disallowed-list/index.js'),
	)(),
	'selector-anb-no-unmatchable': importLazy(() =>
		require$1('./selector-anb-no-unmatchable/index.js'),
	)(),
	'selector-attribute-name-disallowed-list': importLazy(() =>
		require$1('./selector-attribute-name-disallowed-list/index.js'),
	)(),
	'selector-attribute-operator-allowed-list': importLazy(() =>
		require$1('./selector-attribute-operator-allowed-list/index.js'),
	)(),
	'selector-attribute-operator-disallowed-list': importLazy(() =>
		require$1('./selector-attribute-operator-disallowed-list/index.js'),
	)(),
	'selector-attribute-quotes': importLazy(() => require$1('./selector-attribute-quotes/index.js'))(),
	'selector-class-pattern': importLazy(() => require$1('./selector-class-pattern/index.js'))(),
	'selector-combinator-allowed-list': importLazy(() =>
		require$1('./selector-combinator-allowed-list/index.js'),
	)(),
	'selector-combinator-disallowed-list': importLazy(() =>
		require$1('./selector-combinator-disallowed-list/index.js'),
	)(),

	'selector-disallowed-list': importLazy(() => require$1('./selector-disallowed-list/index.js'))(),
	'selector-id-pattern': importLazy(() => require$1('./selector-id-pattern/index.js'))(),

	'selector-max-attribute': importLazy(() => require$1('./selector-max-attribute/index.js'))(),
	'selector-max-class': importLazy(() => require$1('./selector-max-class/index.js'))(),
	'selector-max-combinators': importLazy(() => require$1('./selector-max-combinators/index.js'))(),
	'selector-max-compound-selectors': importLazy(() =>
		require$1('./selector-max-compound-selectors/index.js'),
	)(),

	'selector-max-id': importLazy(() => require$1('./selector-max-id/index.js'))(),
	'selector-max-pseudo-class': importLazy(() => require$1('./selector-max-pseudo-class/index.js'))(),
	'selector-max-specificity': importLazy(() => require$1('./selector-max-specificity/index.js'))(),
	'selector-max-type': importLazy(() => require$1('./selector-max-type/index.js'))(),
	'selector-max-universal': importLazy(() => require$1('./selector-max-universal/index.js'))(),
	'selector-nested-pattern': importLazy(() => require$1('./selector-nested-pattern/index.js'))(),
	'selector-no-qualifying-type': importLazy(() =>
		require$1('./selector-no-qualifying-type/index.js'),
	)(),
	'selector-no-vendor-prefix': importLazy(() => require$1('./selector-no-vendor-prefix/index.js'))(),
	'selector-not-notation': importLazy(() => require$1('./selector-not-notation/index.js'))(),
	'selector-pseudo-class-allowed-list': importLazy(() =>
		require$1('./selector-pseudo-class-allowed-list/index.js'),
	)(),
	'selector-pseudo-class-disallowed-list': importLazy(() =>
		require$1('./selector-pseudo-class-disallowed-list/index.js'),
	)(),
	'selector-pseudo-class-no-unknown': importLazy(() =>
		require$1('./selector-pseudo-class-no-unknown/index.js'),
	)(),
	'selector-pseudo-element-allowed-list': importLazy(() =>
		require$1('./selector-pseudo-element-allowed-list/index.js'),
	)(),
	'selector-pseudo-element-colon-notation': importLazy(() =>
		require$1('./selector-pseudo-element-colon-notation/index.js'),
	)(),
	'selector-pseudo-element-disallowed-list': importLazy(() =>
		require$1('./selector-pseudo-element-disallowed-list/index.js'),
	)(),
	'selector-pseudo-element-no-unknown': importLazy(() =>
		require$1('./selector-pseudo-element-no-unknown/index.js'),
	)(),
	'selector-type-case': importLazy(() => require$1('./selector-type-case/index.js'))(),
	'selector-type-no-unknown': importLazy(() => require$1('./selector-type-no-unknown/index.js'))(),
	'shorthand-property-no-redundant-values': importLazy(() =>
		require$1('./shorthand-property-no-redundant-values/index.js'),
	)(),
	'string-no-newline': importLazy(() => require$1('./string-no-newline/index.js'))(),
	'time-min-milliseconds': importLazy(() => require$1('./time-min-milliseconds/index.js'))(),
	'unit-allowed-list': importLazy(() => require$1('./unit-allowed-list/index.js'))(),
	'unit-disallowed-list': importLazy(() => require$1('./unit-disallowed-list/index.js'))(),
	'unit-no-unknown': importLazy(() => require$1('./unit-no-unknown/index.js'))(),
	'value-keyword-case': importLazy(() => require$1('./value-keyword-case/index.js'))(),
	'value-no-vendor-prefix': importLazy(() => require$1('./value-no-vendor-prefix/index.js'))(),
};

module.exports = rules;
