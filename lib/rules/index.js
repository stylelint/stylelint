'use strict';

const importLazy = require('import-lazy');

/** @type {import('stylelint')['rules']} */
const rules = {
	'alpha-value-notation': importLazy(() => require('./alpha-value-notation'))(),
	'annotation-no-unknown': importLazy(() => require('./annotation-no-unknown'))(),
	'at-rule-allowed-list': importLazy(() => require('./at-rule-allowed-list'))(),
	'at-rule-disallowed-list': importLazy(() => require('./at-rule-disallowed-list'))(),
	'at-rule-empty-line-before': importLazy(() => require('./at-rule-empty-line-before'))(),
	'at-rule-no-unknown': importLazy(() => require('./at-rule-no-unknown'))(),
	'at-rule-no-vendor-prefix': importLazy(() => require('./at-rule-no-vendor-prefix'))(),
	'at-rule-property-required-list': importLazy(() => require('./at-rule-property-required-list'))(),
	'block-no-empty': importLazy(() => require('./block-no-empty'))(),
	'color-function-notation': importLazy(() => require('./color-function-notation'))(),
	'color-hex-alpha': importLazy(() => require('./color-hex-alpha'))(),
	'color-hex-length': importLazy(() => require('./color-hex-length'))(),
	'color-named': importLazy(() => require('./color-named'))(),
	'color-no-hex': importLazy(() => require('./color-no-hex'))(),
	'color-no-invalid-hex': importLazy(() => require('./color-no-invalid-hex'))(),
	'comment-empty-line-before': importLazy(() => require('./comment-empty-line-before'))(),
	'comment-no-empty': importLazy(() => require('./comment-no-empty'))(),
	'comment-pattern': importLazy(() => require('./comment-pattern'))(),
	'comment-whitespace-inside': importLazy(() => require('./comment-whitespace-inside'))(),
	'comment-word-disallowed-list': importLazy(() => require('./comment-word-disallowed-list'))(),
	'custom-media-pattern': importLazy(() => require('./custom-media-pattern'))(),
	'custom-property-empty-line-before': importLazy(() =>
		require('./custom-property-empty-line-before'),
	)(),
	'custom-property-no-missing-var-function': importLazy(() =>
		require('./custom-property-no-missing-var-function'),
	)(),
	'custom-property-pattern': importLazy(() => require('./custom-property-pattern'))(),
	'declaration-block-no-duplicate-custom-properties': importLazy(() =>
		require('./declaration-block-no-duplicate-custom-properties'),
	)(),
	'declaration-block-no-duplicate-properties': importLazy(() =>
		require('./declaration-block-no-duplicate-properties'),
	)(),
	'declaration-block-no-redundant-longhand-properties': importLazy(() =>
		require('./declaration-block-no-redundant-longhand-properties'),
	)(),
	'declaration-block-no-shorthand-property-overrides': importLazy(() =>
		require('./declaration-block-no-shorthand-property-overrides'),
	)(),
	'declaration-block-single-line-max-declarations': importLazy(() =>
		require('./declaration-block-single-line-max-declarations'),
	)(),
	'declaration-empty-line-before': importLazy(() => require('./declaration-empty-line-before'))(),
	'declaration-no-important': importLazy(() => require('./declaration-no-important'))(),
	'declaration-property-max-values': importLazy(() =>
		require('./declaration-property-max-values'),
	)(),
	'declaration-property-unit-allowed-list': importLazy(() =>
		require('./declaration-property-unit-allowed-list'),
	)(),
	'declaration-property-unit-disallowed-list': importLazy(() =>
		require('./declaration-property-unit-disallowed-list'),
	)(),
	'declaration-property-value-allowed-list': importLazy(() =>
		require('./declaration-property-value-allowed-list'),
	)(),
	'declaration-property-value-disallowed-list': importLazy(() =>
		require('./declaration-property-value-disallowed-list'),
	)(),
	'declaration-property-value-no-unknown': importLazy(() =>
		require('./declaration-property-value-no-unknown'),
	)(),
	'font-family-no-missing-generic-family-keyword': importLazy(() =>
		require('./font-family-no-missing-generic-family-keyword'),
	)(),
	'font-family-name-quotes': importLazy(() => require('./font-family-name-quotes'))(),
	'font-family-no-duplicate-names': importLazy(() => require('./font-family-no-duplicate-names'))(),
	'font-weight-notation': importLazy(() => require('./font-weight-notation'))(),
	'function-allowed-list': importLazy(() => require('./function-allowed-list'))(),
	'function-calc-no-unspaced-operator': importLazy(() =>
		require('./function-calc-no-unspaced-operator'),
	)(),

	'function-disallowed-list': importLazy(() => require('./function-disallowed-list'))(),
	'function-linear-gradient-no-nonstandard-direction': importLazy(() =>
		require('./function-linear-gradient-no-nonstandard-direction'),
	)(),

	'function-name-case': importLazy(() => require('./function-name-case'))(),
	'function-no-unknown': importLazy(() => require('./function-no-unknown'))(),

	'function-url-no-scheme-relative': importLazy(() =>
		require('./function-url-no-scheme-relative'),
	)(),
	'function-url-quotes': importLazy(() => require('./function-url-quotes'))(),
	'function-url-scheme-allowed-list': importLazy(() =>
		require('./function-url-scheme-allowed-list'),
	)(),
	'function-url-scheme-disallowed-list': importLazy(() =>
		require('./function-url-scheme-disallowed-list'),
	)(),

	'hue-degree-notation': importLazy(() => require('./hue-degree-notation'))(),
	'import-notation': importLazy(() => require('./import-notation'))(),
	'keyframe-block-no-duplicate-selectors': importLazy(() =>
		require('./keyframe-block-no-duplicate-selectors'),
	)(),
	'keyframe-declaration-no-important': importLazy(() =>
		require('./keyframe-declaration-no-important'),
	)(),
	'keyframe-selector-notation': importLazy(() => require('./keyframe-selector-notation'))(),
	'keyframes-name-pattern': importLazy(() => require('./keyframes-name-pattern'))(),
	'length-zero-no-unit': importLazy(() => require('./length-zero-no-unit'))(),
	'max-nesting-depth': importLazy(() => require('./max-nesting-depth'))(),
	'media-feature-name-allowed-list': importLazy(() =>
		require('./media-feature-name-allowed-list'),
	)(),
	'media-feature-name-disallowed-list': importLazy(() =>
		require('./media-feature-name-disallowed-list'),
	)(),
	'media-feature-name-no-unknown': importLazy(() => require('./media-feature-name-no-unknown'))(),
	'media-feature-name-no-vendor-prefix': importLazy(() =>
		require('./media-feature-name-no-vendor-prefix'),
	)(),
	'media-feature-name-unit-allowed-list': importLazy(() =>
		require('./media-feature-name-unit-allowed-list'),
	)(),
	'media-feature-name-value-allowed-list': importLazy(() =>
		require('./media-feature-name-value-allowed-list'),
	)(),
	'media-feature-name-value-no-unknown': importLazy(() =>
		require('./media-feature-name-value-no-unknown'),
	)(),
	'media-feature-range-notation': importLazy(() => require('./media-feature-range-notation'))(),

	'media-query-no-invalid': importLazy(() => require('./media-query-no-invalid'))(),
	'named-grid-areas-no-invalid': importLazy(() => require('./named-grid-areas-no-invalid'))(),
	'no-descending-specificity': importLazy(() => require('./no-descending-specificity'))(),
	'no-duplicate-at-import-rules': importLazy(() => require('./no-duplicate-at-import-rules'))(),
	'no-duplicate-selectors': importLazy(() => require('./no-duplicate-selectors'))(),
	'no-empty-source': importLazy(() => require('./no-empty-source'))(),
	'no-invalid-double-slash-comments': importLazy(() =>
		require('./no-invalid-double-slash-comments'),
	)(),
	'no-invalid-position-at-import-rule': importLazy(() =>
		require('./no-invalid-position-at-import-rule'),
	)(),
	'no-irregular-whitespace': importLazy(() => require('./no-irregular-whitespace'))(),
	'no-unknown-animations': importLazy(() => require('./no-unknown-animations'))(),
	'no-unknown-custom-properties': importLazy(() => require('./no-unknown-custom-properties'))(),
	'number-max-precision': importLazy(() => require('./number-max-precision'))(),
	'property-allowed-list': importLazy(() => require('./property-allowed-list'))(),
	'property-disallowed-list': importLazy(() => require('./property-disallowed-list'))(),
	'property-no-unknown': importLazy(() => require('./property-no-unknown'))(),
	'property-no-vendor-prefix': importLazy(() => require('./property-no-vendor-prefix'))(),
	'rule-empty-line-before': importLazy(() => require('./rule-empty-line-before'))(),
	'rule-selector-property-disallowed-list': importLazy(() =>
		require('./rule-selector-property-disallowed-list'),
	)(),
	'selector-anb-no-unmatchable': importLazy(() => require('./selector-anb-no-unmatchable'))(),
	'selector-attribute-name-disallowed-list': importLazy(() =>
		require('./selector-attribute-name-disallowed-list'),
	)(),
	'selector-attribute-operator-allowed-list': importLazy(() =>
		require('./selector-attribute-operator-allowed-list'),
	)(),
	'selector-attribute-operator-disallowed-list': importLazy(() =>
		require('./selector-attribute-operator-disallowed-list'),
	)(),
	'selector-attribute-quotes': importLazy(() => require('./selector-attribute-quotes'))(),
	'selector-class-pattern': importLazy(() => require('./selector-class-pattern'))(),
	'selector-combinator-allowed-list': importLazy(() =>
		require('./selector-combinator-allowed-list'),
	)(),
	'selector-combinator-disallowed-list': importLazy(() =>
		require('./selector-combinator-disallowed-list'),
	)(),

	'selector-disallowed-list': importLazy(() => require('./selector-disallowed-list'))(),
	'selector-id-pattern': importLazy(() => require('./selector-id-pattern'))(),

	'selector-max-attribute': importLazy(() => require('./selector-max-attribute'))(),
	'selector-max-class': importLazy(() => require('./selector-max-class'))(),
	'selector-max-combinators': importLazy(() => require('./selector-max-combinators'))(),
	'selector-max-compound-selectors': importLazy(() =>
		require('./selector-max-compound-selectors'),
	)(),

	'selector-max-id': importLazy(() => require('./selector-max-id'))(),
	'selector-max-pseudo-class': importLazy(() => require('./selector-max-pseudo-class'))(),
	'selector-max-specificity': importLazy(() => require('./selector-max-specificity'))(),
	'selector-max-type': importLazy(() => require('./selector-max-type'))(),
	'selector-max-universal': importLazy(() => require('./selector-max-universal'))(),
	'selector-nested-pattern': importLazy(() => require('./selector-nested-pattern'))(),
	'selector-no-qualifying-type': importLazy(() => require('./selector-no-qualifying-type'))(),
	'selector-no-vendor-prefix': importLazy(() => require('./selector-no-vendor-prefix'))(),
	'selector-not-notation': importLazy(() => require('./selector-not-notation'))(),
	'selector-pseudo-class-allowed-list': importLazy(() =>
		require('./selector-pseudo-class-allowed-list'),
	)(),
	'selector-pseudo-class-disallowed-list': importLazy(() =>
		require('./selector-pseudo-class-disallowed-list'),
	)(),
	'selector-pseudo-class-no-unknown': importLazy(() =>
		require('./selector-pseudo-class-no-unknown'),
	)(),
	'selector-pseudo-element-allowed-list': importLazy(() =>
		require('./selector-pseudo-element-allowed-list'),
	)(),
	'selector-pseudo-element-colon-notation': importLazy(() =>
		require('./selector-pseudo-element-colon-notation'),
	)(),
	'selector-pseudo-element-disallowed-list': importLazy(() =>
		require('./selector-pseudo-element-disallowed-list'),
	)(),
	'selector-pseudo-element-no-unknown': importLazy(() =>
		require('./selector-pseudo-element-no-unknown'),
	)(),
	'selector-type-case': importLazy(() => require('./selector-type-case'))(),
	'selector-type-no-unknown': importLazy(() => require('./selector-type-no-unknown'))(),
	'shorthand-property-no-redundant-values': importLazy(() =>
		require('./shorthand-property-no-redundant-values'),
	)(),
	'string-no-newline': importLazy(() => require('./string-no-newline'))(),
	'time-min-milliseconds': importLazy(() => require('./time-min-milliseconds'))(),
	'unit-allowed-list': importLazy(() => require('./unit-allowed-list'))(),
	'unit-disallowed-list': importLazy(() => require('./unit-disallowed-list'))(),
	'unit-no-unknown': importLazy(() => require('./unit-no-unknown'))(),
	'value-keyword-case': importLazy(() => require('./value-keyword-case'))(),
	'value-no-vendor-prefix': importLazy(() => require('./value-no-vendor-prefix'))(),
};

module.exports = rules;
