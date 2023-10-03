import { createRequire } from 'node:module';
// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
const require = createRequire(import.meta.url);

import importLazy from 'import-lazy';

/** @type {import('stylelint')['rules']} */
const rules = {
	'alpha-value-notation': importLazy(() => require('./alpha-value-notation/index.cjs'))(),
	'annotation-no-unknown': importLazy(() => require('./annotation-no-unknown/index.js'))(),
	'at-rule-allowed-list': importLazy(() => require('./at-rule-allowed-list/index.js'))(),
	'at-rule-disallowed-list': importLazy(() => require('./at-rule-disallowed-list/index.js'))(),
	'at-rule-empty-line-before': importLazy(() => require('./at-rule-empty-line-before/index.js'))(),
	'at-rule-no-unknown': importLazy(() => require('./at-rule-no-unknown/index.js'))(),
	'at-rule-no-vendor-prefix': importLazy(() => require('./at-rule-no-vendor-prefix/index.js'))(),
	'at-rule-property-required-list': importLazy(() =>
		require('./at-rule-property-required-list/index.js'),
	)(),
	'block-no-empty': importLazy(() => require('./block-no-empty/index.js'))(),
	'color-function-notation': importLazy(() => require('./color-function-notation/index.js'))(),
	'color-hex-alpha': importLazy(() => require('./color-hex-alpha/index.js'))(),
	'color-hex-length': importLazy(() => require('./color-hex-length/index.js'))(),
	'color-named': importLazy(() => require('./color-named/index.js'))(),
	'color-no-hex': importLazy(() => require('./color-no-hex/index.js'))(),
	'color-no-invalid-hex': importLazy(() => require('./color-no-invalid-hex/index.js'))(),
	'comment-empty-line-before': importLazy(() => require('./comment-empty-line-before/index.js'))(),
	'comment-no-empty': importLazy(() => require('./comment-no-empty/index.js'))(),
	'comment-pattern': importLazy(() => require('./comment-pattern/index.js'))(),
	'comment-whitespace-inside': importLazy(() => require('./comment-whitespace-inside/index.js'))(),
	'comment-word-disallowed-list': importLazy(() =>
		require('./comment-word-disallowed-list/index.js'),
	)(),
	'custom-media-pattern': importLazy(() => require('./custom-media-pattern/index.js'))(),
	'custom-property-empty-line-before': importLazy(() =>
		require('./custom-property-empty-line-before/index.js'),
	)(),
	'custom-property-no-missing-var-function': importLazy(() =>
		require('./custom-property-no-missing-var-function/index.js'),
	)(),
	'custom-property-pattern': importLazy(() => require('./custom-property-pattern/index.js'))(),
	'declaration-block-no-duplicate-custom-properties': importLazy(() =>
		require('./declaration-block-no-duplicate-custom-properties/index.js'),
	)(),
	'declaration-block-no-duplicate-properties': importLazy(() =>
		require('./declaration-block-no-duplicate-properties/index.js'),
	)(),
	'declaration-block-no-redundant-longhand-properties': importLazy(() =>
		require('./declaration-block-no-redundant-longhand-properties/index.js'),
	)(),
	'declaration-block-no-shorthand-property-overrides': importLazy(() =>
		require('./declaration-block-no-shorthand-property-overrides/index.js'),
	)(),
	'declaration-block-single-line-max-declarations': importLazy(() =>
		require('./declaration-block-single-line-max-declarations/index.js'),
	)(),
	'declaration-empty-line-before': importLazy(() =>
		require('./declaration-empty-line-before/index.js'),
	)(),
	'declaration-no-important': importLazy(() => require('./declaration-no-important/index.js'))(),
	'declaration-property-max-values': importLazy(() =>
		require('./declaration-property-max-values/index.js'),
	)(),
	'declaration-property-unit-allowed-list': importLazy(() =>
		require('./declaration-property-unit-allowed-list/index.js'),
	)(),
	'declaration-property-unit-disallowed-list': importLazy(() =>
		require('./declaration-property-unit-disallowed-list/index.js'),
	)(),
	'declaration-property-value-allowed-list': importLazy(() =>
		require('./declaration-property-value-allowed-list/index.js'),
	)(),
	'declaration-property-value-disallowed-list': importLazy(() =>
		require('./declaration-property-value-disallowed-list/index.js'),
	)(),
	'declaration-property-value-no-unknown': importLazy(() =>
		require('./declaration-property-value-no-unknown/index.js'),
	)(),
	'font-family-no-missing-generic-family-keyword': importLazy(() =>
		require('./font-family-no-missing-generic-family-keyword/index.js'),
	)(),
	'font-family-name-quotes': importLazy(() => require('./font-family-name-quotes/index.js'))(),
	'font-family-no-duplicate-names': importLazy(() =>
		require('./font-family-no-duplicate-names/index.js'),
	)(),
	'font-weight-notation': importLazy(() => require('./font-weight-notation/index.js'))(),
	'function-allowed-list': importLazy(() => require('./function-allowed-list/index.js'))(),
	'function-calc-no-unspaced-operator': importLazy(() =>
		require('./function-calc-no-unspaced-operator/index.js'),
	)(),

	'function-disallowed-list': importLazy(() => require('./function-disallowed-list/index.js'))(),
	'function-linear-gradient-no-nonstandard-direction': importLazy(() =>
		require('./function-linear-gradient-no-nonstandard-direction/index.js'),
	)(),

	'function-name-case': importLazy(() => require('./function-name-case/index.js'))(),
	'function-no-unknown': importLazy(() => require('./function-no-unknown/index.js'))(),

	'function-url-no-scheme-relative': importLazy(() =>
		require('./function-url-no-scheme-relative/index.js'),
	)(),
	'function-url-quotes': importLazy(() => require('./function-url-quotes/index.js'))(),
	'function-url-scheme-allowed-list': importLazy(() =>
		require('./function-url-scheme-allowed-list/index.js'),
	)(),
	'function-url-scheme-disallowed-list': importLazy(() =>
		require('./function-url-scheme-disallowed-list/index.js'),
	)(),

	'hue-degree-notation': importLazy(() => require('./hue-degree-notation/index.js'))(),
	'import-notation': importLazy(() => require('./import-notation/index.js'))(),
	'keyframe-block-no-duplicate-selectors': importLazy(() =>
		require('./keyframe-block-no-duplicate-selectors/index.js'),
	)(),
	'keyframe-declaration-no-important': importLazy(() =>
		require('./keyframe-declaration-no-important/index.js'),
	)(),
	'keyframe-selector-notation': importLazy(() =>
		require('./keyframe-selector-notation/index.js'),
	)(),
	'keyframes-name-pattern': importLazy(() => require('./keyframes-name-pattern/index.js'))(),
	'length-zero-no-unit': importLazy(() => require('./length-zero-no-unit/index.js'))(),
	'max-nesting-depth': importLazy(() => require('./max-nesting-depth/index.js'))(),
	'media-feature-name-allowed-list': importLazy(() =>
		require('./media-feature-name-allowed-list/index.js'),
	)(),
	'media-feature-name-disallowed-list': importLazy(() =>
		require('./media-feature-name-disallowed-list/index.js'),
	)(),
	'media-feature-name-no-unknown': importLazy(() =>
		require('./media-feature-name-no-unknown/index.js'),
	)(),
	'media-feature-name-no-vendor-prefix': importLazy(() =>
		require('./media-feature-name-no-vendor-prefix/index.js'),
	)(),
	'media-feature-name-unit-allowed-list': importLazy(() =>
		require('./media-feature-name-unit-allowed-list/index.js'),
	)(),
	'media-feature-name-value-allowed-list': importLazy(() =>
		require('./media-feature-name-value-allowed-list/index.js'),
	)(),
	'media-feature-name-value-no-unknown': importLazy(() =>
		require('./media-feature-name-value-no-unknown/index.js'),
	)(),
	'media-feature-range-notation': importLazy(() =>
		require('./media-feature-range-notation/index.js'),
	)(),

	'media-query-no-invalid': importLazy(() => require('./media-query-no-invalid/index.js'))(),
	'named-grid-areas-no-invalid': importLazy(() =>
		require('./named-grid-areas-no-invalid/index.js'),
	)(),
	'no-descending-specificity': importLazy(() => require('./no-descending-specificity/index.js'))(),
	'no-duplicate-at-import-rules': importLazy(() =>
		require('./no-duplicate-at-import-rules/index.js'),
	)(),
	'no-duplicate-selectors': importLazy(() => require('./no-duplicate-selectors/index.js'))(),
	'no-empty-source': importLazy(() => require('./no-empty-source/index.js'))(),
	'no-invalid-double-slash-comments': importLazy(() =>
		require('./no-invalid-double-slash-comments/index.js'),
	)(),
	'no-invalid-position-at-import-rule': importLazy(() =>
		require('./no-invalid-position-at-import-rule/index.js'),
	)(),
	'no-irregular-whitespace': importLazy(() => require('./no-irregular-whitespace/index.js'))(),
	'no-unknown-animations': importLazy(() => require('./no-unknown-animations/index.js'))(),
	'no-unknown-custom-properties': importLazy(() =>
		require('./no-unknown-custom-properties/index.js'),
	)(),
	'number-max-precision': importLazy(() => require('./number-max-precision/index.js'))(),
	'property-allowed-list': importLazy(() => require('./property-allowed-list/index.js'))(),
	'property-disallowed-list': importLazy(() => require('./property-disallowed-list/index.js'))(),
	'property-no-unknown': importLazy(() => require('./property-no-unknown/index.js'))(),
	'property-no-vendor-prefix': importLazy(() => require('./property-no-vendor-prefix/index.js'))(),
	'rule-empty-line-before': importLazy(() => require('./rule-empty-line-before/index.js'))(),
	'rule-selector-property-disallowed-list': importLazy(() =>
		require('./rule-selector-property-disallowed-list/index.js'),
	)(),
	'selector-anb-no-unmatchable': importLazy(() =>
		require('./selector-anb-no-unmatchable/index.js'),
	)(),
	'selector-attribute-name-disallowed-list': importLazy(() =>
		require('./selector-attribute-name-disallowed-list/index.js'),
	)(),
	'selector-attribute-operator-allowed-list': importLazy(() =>
		require('./selector-attribute-operator-allowed-list/index.js'),
	)(),
	'selector-attribute-operator-disallowed-list': importLazy(() =>
		require('./selector-attribute-operator-disallowed-list/index.js'),
	)(),
	'selector-attribute-quotes': importLazy(() => require('./selector-attribute-quotes/index.js'))(),
	'selector-class-pattern': importLazy(() => require('./selector-class-pattern/index.js'))(),
	'selector-combinator-allowed-list': importLazy(() =>
		require('./selector-combinator-allowed-list/index.js'),
	)(),
	'selector-combinator-disallowed-list': importLazy(() =>
		require('./selector-combinator-disallowed-list/index.js'),
	)(),

	'selector-disallowed-list': importLazy(() => require('./selector-disallowed-list/index.js'))(),
	'selector-id-pattern': importLazy(() => require('./selector-id-pattern/index.js'))(),

	'selector-max-attribute': importLazy(() => require('./selector-max-attribute/index.js'))(),
	'selector-max-class': importLazy(() => require('./selector-max-class/index.js'))(),
	'selector-max-combinators': importLazy(() => require('./selector-max-combinators/index.js'))(),
	'selector-max-compound-selectors': importLazy(() =>
		require('./selector-max-compound-selectors/index.js'),
	)(),

	'selector-max-id': importLazy(() => require('./selector-max-id/index.js'))(),
	'selector-max-pseudo-class': importLazy(() => require('./selector-max-pseudo-class/index.js'))(),
	'selector-max-specificity': importLazy(() => require('./selector-max-specificity/index.js'))(),
	'selector-max-type': importLazy(() => require('./selector-max-type/index.js'))(),
	'selector-max-universal': importLazy(() => require('./selector-max-universal/index.js'))(),
	'selector-nested-pattern': importLazy(() => require('./selector-nested-pattern/index.js'))(),
	'selector-no-qualifying-type': importLazy(() =>
		require('./selector-no-qualifying-type/index.js'),
	)(),
	'selector-no-vendor-prefix': importLazy(() => require('./selector-no-vendor-prefix/index.js'))(),
	'selector-not-notation': importLazy(() => require('./selector-not-notation/index.js'))(),
	'selector-pseudo-class-allowed-list': importLazy(() =>
		require('./selector-pseudo-class-allowed-list/index.js'),
	)(),
	'selector-pseudo-class-disallowed-list': importLazy(() =>
		require('./selector-pseudo-class-disallowed-list/index.js'),
	)(),
	'selector-pseudo-class-no-unknown': importLazy(() =>
		require('./selector-pseudo-class-no-unknown/index.js'),
	)(),
	'selector-pseudo-element-allowed-list': importLazy(() =>
		require('./selector-pseudo-element-allowed-list/index.js'),
	)(),
	'selector-pseudo-element-colon-notation': importLazy(() =>
		require('./selector-pseudo-element-colon-notation/index.js'),
	)(),
	'selector-pseudo-element-disallowed-list': importLazy(() =>
		require('./selector-pseudo-element-disallowed-list/index.js'),
	)(),
	'selector-pseudo-element-no-unknown': importLazy(() =>
		require('./selector-pseudo-element-no-unknown/index.js'),
	)(),
	'selector-type-case': importLazy(() => require('./selector-type-case/index.js'))(),
	'selector-type-no-unknown': importLazy(() => require('./selector-type-no-unknown/index.js'))(),
	'shorthand-property-no-redundant-values': importLazy(() =>
		require('./shorthand-property-no-redundant-values/index.js'),
	)(),
	'string-no-newline': importLazy(() => require('./string-no-newline/index.js'))(),
	'time-min-milliseconds': importLazy(() => require('./time-min-milliseconds/index.js'))(),
	'unit-allowed-list': importLazy(() => require('./unit-allowed-list/index.js'))(),
	'unit-disallowed-list': importLazy(() => require('./unit-disallowed-list/index.js'))(),
	'unit-no-unknown': importLazy(() => require('./unit-no-unknown/index.js'))(),
	'value-keyword-case': importLazy(() => require('./value-keyword-case/index.js'))(),
	'value-no-vendor-prefix': importLazy(() => require('./value-no-vendor-prefix/index.js'))(),
};

export default rules;
