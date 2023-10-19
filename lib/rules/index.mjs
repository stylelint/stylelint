import { createRequire } from 'node:module';
// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
const require = createRequire(import.meta.url);

import importLazy from 'import-lazy';

/** @type {import('stylelint')['rules']} */
const rules = {
	'alpha-value-notation': importLazy(() => require('./alpha-value-notation/index.cjs'))(),
	'annotation-no-unknown': importLazy(() => require('./annotation-no-unknown/index.cjs'))(),
	'at-rule-allowed-list': importLazy(() => require('./at-rule-allowed-list/index.cjs'))(),
	'at-rule-disallowed-list': importLazy(() => require('./at-rule-disallowed-list/index.cjs'))(),
	'at-rule-empty-line-before': importLazy(() => require('./at-rule-empty-line-before/index.cjs'))(),
	'at-rule-no-unknown': importLazy(() => require('./at-rule-no-unknown/index.cjs'))(),
	'at-rule-no-vendor-prefix': importLazy(() => require('./at-rule-no-vendor-prefix/index.cjs'))(),
	'at-rule-property-required-list': importLazy(() =>
		require('./at-rule-property-required-list/index.cjs'),
	)(),
	'block-no-empty': importLazy(() => require('./block-no-empty/index.cjs'))(),
	'color-function-notation': importLazy(() => require('./color-function-notation/index.cjs'))(),
	'color-hex-alpha': importLazy(() => require('./color-hex-alpha/index.cjs'))(),
	'color-hex-length': importLazy(() => require('./color-hex-length/index.cjs'))(),
	'color-named': importLazy(() => require('./color-named/index.cjs'))(),
	'color-no-hex': importLazy(() => require('./color-no-hex/index.cjs'))(),
	'color-no-invalid-hex': importLazy(() => require('./color-no-invalid-hex/index.cjs'))(),
	'comment-empty-line-before': importLazy(() => require('./comment-empty-line-before/index.cjs'))(),
	'comment-no-empty': importLazy(() => require('./comment-no-empty/index.cjs'))(),
	'comment-pattern': importLazy(() => require('./comment-pattern/index.cjs'))(),
	'comment-whitespace-inside': importLazy(() => require('./comment-whitespace-inside/index.cjs'))(),
	'comment-word-disallowed-list': importLazy(() =>
		require('./comment-word-disallowed-list/index.cjs'),
	)(),
	'custom-media-pattern': importLazy(() => require('./custom-media-pattern/index.cjs'))(),
	'custom-property-empty-line-before': importLazy(() =>
		require('./custom-property-empty-line-before/index.cjs'),
	)(),
	'custom-property-no-missing-var-function': importLazy(() =>
		require('./custom-property-no-missing-var-function/index.cjs'),
	)(),
	'custom-property-pattern': importLazy(() => require('./custom-property-pattern/index.cjs'))(),
	'declaration-block-no-duplicate-custom-properties': importLazy(() =>
		require('./declaration-block-no-duplicate-custom-properties/index.cjs'),
	)(),
	'declaration-block-no-duplicate-properties': importLazy(() =>
		require('./declaration-block-no-duplicate-properties/index.cjs'),
	)(),
	'declaration-block-no-redundant-longhand-properties': importLazy(() =>
		require('./declaration-block-no-redundant-longhand-properties/index.cjs'),
	)(),
	'declaration-block-no-shorthand-property-overrides': importLazy(() =>
		require('./declaration-block-no-shorthand-property-overrides/index.cjs'),
	)(),
	'declaration-block-single-line-max-declarations': importLazy(() =>
		require('./declaration-block-single-line-max-declarations/index.cjs'),
	)(),
	'declaration-empty-line-before': importLazy(() =>
		require('./declaration-empty-line-before/index.cjs'),
	)(),
	'declaration-no-important': importLazy(() => require('./declaration-no-important/index.cjs'))(),
	'declaration-property-max-values': importLazy(() =>
		require('./declaration-property-max-values/index.cjs'),
	)(),
	'declaration-property-unit-allowed-list': importLazy(() =>
		require('./declaration-property-unit-allowed-list/index.cjs'),
	)(),
	'declaration-property-unit-disallowed-list': importLazy(() =>
		require('./declaration-property-unit-disallowed-list/index.cjs'),
	)(),
	'declaration-property-value-allowed-list': importLazy(() =>
		require('./declaration-property-value-allowed-list/index.cjs'),
	)(),
	'declaration-property-value-disallowed-list': importLazy(() =>
		require('./declaration-property-value-disallowed-list/index.cjs'),
	)(),
	'declaration-property-value-no-unknown': importLazy(() =>
		require('./declaration-property-value-no-unknown/index.cjs'),
	)(),
	'font-family-no-missing-generic-family-keyword': importLazy(() =>
		require('./font-family-no-missing-generic-family-keyword/index.cjs'),
	)(),
	'font-family-name-quotes': importLazy(() => require('./font-family-name-quotes/index.cjs'))(),
	'font-family-no-duplicate-names': importLazy(() =>
		require('./font-family-no-duplicate-names/index.cjs'),
	)(),
	'font-weight-notation': importLazy(() => require('./font-weight-notation/index.cjs'))(),
	'function-allowed-list': importLazy(() => require('./function-allowed-list/index.cjs'))(),
	'function-calc-no-unspaced-operator': importLazy(() =>
		require('./function-calc-no-unspaced-operator/index.cjs'),
	)(),

	'function-disallowed-list': importLazy(() => require('./function-disallowed-list/index.cjs'))(),
	'function-linear-gradient-no-nonstandard-direction': importLazy(() =>
		require('./function-linear-gradient-no-nonstandard-direction/index.cjs'),
	)(),

	'function-name-case': importLazy(() => require('./function-name-case/index.cjs'))(),
	'function-no-unknown': importLazy(() => require('./function-no-unknown/index.cjs'))(),

	'function-url-no-scheme-relative': importLazy(() =>
		require('./function-url-no-scheme-relative/index.cjs'),
	)(),
	'function-url-quotes': importLazy(() => require('./function-url-quotes/index.cjs'))(),
	'function-url-scheme-allowed-list': importLazy(() =>
		require('./function-url-scheme-allowed-list/index.cjs'),
	)(),
	'function-url-scheme-disallowed-list': importLazy(() =>
		require('./function-url-scheme-disallowed-list/index.cjs'),
	)(),

	'hue-degree-notation': importLazy(() => require('./hue-degree-notation/index.cjs'))(),
	'import-notation': importLazy(() => require('./import-notation/index.cjs'))(),
	'keyframe-block-no-duplicate-selectors': importLazy(() =>
		require('./keyframe-block-no-duplicate-selectors/index.cjs'),
	)(),
	'keyframe-declaration-no-important': importLazy(() =>
		require('./keyframe-declaration-no-important/index.cjs'),
	)(),
	'keyframe-selector-notation': importLazy(() =>
		require('./keyframe-selector-notation/index.cjs'),
	)(),
	'keyframes-name-pattern': importLazy(() => require('./keyframes-name-pattern/index.cjs'))(),
	'length-zero-no-unit': importLazy(() => require('./length-zero-no-unit/index.cjs'))(),
	'max-nesting-depth': importLazy(() => require('./max-nesting-depth/index.cjs'))(),
	'media-feature-name-allowed-list': importLazy(() =>
		require('./media-feature-name-allowed-list/index.cjs'),
	)(),
	'media-feature-name-disallowed-list': importLazy(() =>
		require('./media-feature-name-disallowed-list/index.cjs'),
	)(),
	'media-feature-name-no-unknown': importLazy(() =>
		require('./media-feature-name-no-unknown/index.cjs'),
	)(),
	'media-feature-name-no-vendor-prefix': importLazy(() =>
		require('./media-feature-name-no-vendor-prefix/index.cjs'),
	)(),
	'media-feature-name-unit-allowed-list': importLazy(() =>
		require('./media-feature-name-unit-allowed-list/index.cjs'),
	)(),
	'media-feature-name-value-allowed-list': importLazy(() =>
		require('./media-feature-name-value-allowed-list/index.cjs'),
	)(),
	'media-feature-name-value-no-unknown': importLazy(() =>
		require('./media-feature-name-value-no-unknown/index.cjs'),
	)(),
	'media-feature-range-notation': importLazy(() =>
		require('./media-feature-range-notation/index.cjs'),
	)(),

	'media-query-no-invalid': importLazy(() => require('./media-query-no-invalid/index.cjs'))(),
	'named-grid-areas-no-invalid': importLazy(() =>
		require('./named-grid-areas-no-invalid/index.cjs'),
	)(),
	'no-descending-specificity': importLazy(() => require('./no-descending-specificity/index.cjs'))(),
	'no-duplicate-at-import-rules': importLazy(() =>
		require('./no-duplicate-at-import-rules/index.cjs'),
	)(),
	'no-duplicate-selectors': importLazy(() => require('./no-duplicate-selectors/index.cjs'))(),
	'no-empty-source': importLazy(() => require('./no-empty-source/index.cjs'))(),
	'no-invalid-double-slash-comments': importLazy(() =>
		require('./no-invalid-double-slash-comments/index.cjs'),
	)(),
	'no-invalid-position-at-import-rule': importLazy(() =>
		require('./no-invalid-position-at-import-rule/index.cjs'),
	)(),
	'no-irregular-whitespace': importLazy(() => require('./no-irregular-whitespace/index.cjs'))(),
	'no-unknown-animations': importLazy(() => require('./no-unknown-animations/index.cjs'))(),
	'no-unknown-custom-properties': importLazy(() =>
		require('./no-unknown-custom-properties/index.cjs'),
	)(),
	'number-max-precision': importLazy(() => require('./number-max-precision/index.cjs'))(),
	'property-allowed-list': importLazy(() => require('./property-allowed-list/index.cjs'))(),
	'property-disallowed-list': importLazy(() => require('./property-disallowed-list/index.cjs'))(),
	'property-no-unknown': importLazy(() => require('./property-no-unknown/index.cjs'))(),
	'property-no-vendor-prefix': importLazy(() => require('./property-no-vendor-prefix/index.cjs'))(),
	'rule-empty-line-before': importLazy(() => require('./rule-empty-line-before/index.cjs'))(),
	'rule-selector-property-disallowed-list': importLazy(() =>
		require('./rule-selector-property-disallowed-list/index.cjs'),
	)(),
	'selector-anb-no-unmatchable': importLazy(() =>
		require('./selector-anb-no-unmatchable/index.cjs'),
	)(),
	'selector-attribute-name-disallowed-list': importLazy(() =>
		require('./selector-attribute-name-disallowed-list/index.cjs'),
	)(),
	'selector-attribute-operator-allowed-list': importLazy(() =>
		require('./selector-attribute-operator-allowed-list/index.cjs'),
	)(),
	'selector-attribute-operator-disallowed-list': importLazy(() =>
		require('./selector-attribute-operator-disallowed-list/index.cjs'),
	)(),
	'selector-attribute-quotes': importLazy(() => require('./selector-attribute-quotes/index.cjs'))(),
	'selector-class-pattern': importLazy(() => require('./selector-class-pattern/index.cjs'))(),
	'selector-combinator-allowed-list': importLazy(() =>
		require('./selector-combinator-allowed-list/index.cjs'),
	)(),
	'selector-combinator-disallowed-list': importLazy(() =>
		require('./selector-combinator-disallowed-list/index.cjs'),
	)(),

	'selector-disallowed-list': importLazy(() => require('./selector-disallowed-list/index.cjs'))(),
	'selector-id-pattern': importLazy(() => require('./selector-id-pattern/index.cjs'))(),

	'selector-max-attribute': importLazy(() => require('./selector-max-attribute/index.cjs'))(),
	'selector-max-class': importLazy(() => require('./selector-max-class/index.cjs'))(),
	'selector-max-combinators': importLazy(() => require('./selector-max-combinators/index.cjs'))(),
	'selector-max-compound-selectors': importLazy(() =>
		require('./selector-max-compound-selectors/index.cjs'),
	)(),

	'selector-max-id': importLazy(() => require('./selector-max-id/index.cjs'))(),
	'selector-max-pseudo-class': importLazy(() => require('./selector-max-pseudo-class/index.cjs'))(),
	'selector-max-specificity': importLazy(() => require('./selector-max-specificity/index.cjs'))(),
	'selector-max-type': importLazy(() => require('./selector-max-type/index.cjs'))(),
	'selector-max-universal': importLazy(() => require('./selector-max-universal/index.cjs'))(),
	'selector-nested-pattern': importLazy(() => require('./selector-nested-pattern/index.cjs'))(),
	'selector-no-qualifying-type': importLazy(() =>
		require('./selector-no-qualifying-type/index.cjs'),
	)(),
	'selector-no-vendor-prefix': importLazy(() => require('./selector-no-vendor-prefix/index.cjs'))(),
	'selector-not-notation': importLazy(() => require('./selector-not-notation/index.cjs'))(),
	'selector-pseudo-class-allowed-list': importLazy(() =>
		require('./selector-pseudo-class-allowed-list/index.cjs'),
	)(),
	'selector-pseudo-class-disallowed-list': importLazy(() =>
		require('./selector-pseudo-class-disallowed-list/index.cjs'),
	)(),
	'selector-pseudo-class-no-unknown': importLazy(() =>
		require('./selector-pseudo-class-no-unknown/index.cjs'),
	)(),
	'selector-pseudo-element-allowed-list': importLazy(() =>
		require('./selector-pseudo-element-allowed-list/index.cjs'),
	)(),
	'selector-pseudo-element-colon-notation': importLazy(() =>
		require('./selector-pseudo-element-colon-notation/index.cjs'),
	)(),
	'selector-pseudo-element-disallowed-list': importLazy(() =>
		require('./selector-pseudo-element-disallowed-list/index.cjs'),
	)(),
	'selector-pseudo-element-no-unknown': importLazy(() =>
		require('./selector-pseudo-element-no-unknown/index.cjs'),
	)(),
	'selector-type-case': importLazy(() => require('./selector-type-case/index.cjs'))(),
	'selector-type-no-unknown': importLazy(() => require('./selector-type-no-unknown/index.cjs'))(),
	'shorthand-property-no-redundant-values': importLazy(() =>
		require('./shorthand-property-no-redundant-values/index.cjs'),
	)(),
	'string-no-newline': importLazy(() => require('./string-no-newline/index.cjs'))(),
	'time-min-milliseconds': importLazy(() => require('./time-min-milliseconds/index.cjs'))(),
	'unit-allowed-list': importLazy(() => require('./unit-allowed-list/index.cjs'))(),
	'unit-disallowed-list': importLazy(() => require('./unit-disallowed-list/index.cjs'))(),
	'unit-no-unknown': importLazy(() => require('./unit-no-unknown/index.cjs'))(),
	'value-keyword-case': importLazy(() => require('./value-keyword-case/index.cjs'))(),
	'value-no-vendor-prefix': importLazy(() => require('./value-no-vendor-prefix/index.cjs'))(),
};

export default rules;
