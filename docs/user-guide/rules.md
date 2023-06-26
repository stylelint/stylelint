# Rules

There are over one hundred built-in rules to help you:

- [avoid errors](#avoid-errors)
- [enforce conventions](#enforce-conventions)

We turn on most of the rules in our [standard config](https://www.npmjs.com/package/stylelint-config-standard) (✅) and many can be autofixed (🔧).

## Avoid errors

You can avoid errors with these `no` rules.

### Descending

Disallow descending things with these `no-descending` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`no-descending-specificity`](../../lib/rules/no-descending-specificity/README.md)<br/>Disallow selectors of lower specificity from coming after overriding selectors of higher specificity. | ✅ | |
<!-- prettier-ignore-end -->

### Duplicate

Disallow duplicates with these `no-duplicate` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`declaration-block-no-duplicate-custom-properties`](../../lib/rules/declaration-block-no-duplicate-custom-properties/README.md)<br/>Disallow duplicate custom properties within declaration blocks. | ✅ | |
| [`declaration-block-no-duplicate-properties`](../../lib/rules/declaration-block-no-duplicate-properties/README.md)<br/>Disallow duplicate properties within declaration blocks. | ✅ | 🔧 |
| [`font-family-no-duplicate-names`](../../lib/rules/font-family-no-duplicate-names/README.md)<br/>Disallow duplicate names within font families. | ✅ | 🔧 |
| [`keyframe-block-no-duplicate-selectors`](../../lib/rules/keyframe-block-no-duplicate-selectors/README.md)<br/>Disallow duplicate selectors within keyframe blocks. | ✅ | |
| [`no-duplicate-at-import-rules`](../../lib/rules/no-duplicate-at-import-rules/README.md)<br/>Disallow duplicate `@import` rules. | ✅ | |
| [`no-duplicate-selectors`](../../lib/rules/no-duplicate-selectors/README.md)<br/>Disallow duplicate selectors. | ✅ | |
<!-- prettier-ignore-end -->

### Empty

Disallow empty things with these `no-empty` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`block-no-empty`](../../lib/rules/block-no-empty/README.md)<br/>Disallow empty blocks. | ✅ | |
| [`comment-no-empty`](../../lib/rules/comment-no-empty/README.md)<br/>Disallow empty comments. | ✅ | |
| [`no-empty-source`](../../lib/rules/no-empty-source/README.md)<br/>Disallow empty sources. | ✅ | |
<!-- prettier-ignore-end -->

### Invalid

Disallow invalid syntax with these (sometimes implicit) `no-invalid` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`color-no-invalid-hex`](../../lib/rules/color-no-invalid-hex/README.md)<br/>Disallow invalid hex colors. | ✅ | |
| [`function-calc-no-unspaced-operator`](../../lib/rules/function-calc-no-unspaced-operator/README.md)<br/>Disallow invalid unspaced operator within `calc` functions. | ✅ | 🔧 |
| [`keyframe-declaration-no-important`](../../lib/rules/keyframe-declaration-no-important/README.md)<br/>Disallow invalid `!important` within keyframe declarations. | ✅ | |
| [`media-query-no-invalid`](../../lib/rules/media-query-no-invalid/README.md)<br/>Disallow invalid media queries. | | |
| [`named-grid-areas-no-invalid`](../../lib/rules/named-grid-areas-no-invalid/README.md)<br/>Disallow invalid named grid areas. | ✅ | |
| [`no-invalid-double-slash-comments`](../../lib/rules/no-invalid-double-slash-comments/README.md)<br/>Disallow invalid double-slash comments. | ✅ | |
| [`no-invalid-position-at-import-rule`](../../lib/rules/no-invalid-position-at-import-rule/README.md)<br/>Disallow invalid position `@import` rules. | ✅ | |
| [`string-no-newline`](../../lib/rules/string-no-newline/README.md)<br/>Disallow invalid newlines within strings. | ✅ | |
<!-- prettier-ignore-end -->

### Irregular

Disallow irregular things with these `no-irregular` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`no-irregular-whitespace`](../../lib/rules/no-irregular-whitespace/README.md)<br/>Disallow irregular whitespace. | ✅ | |
<!-- prettier-ignore-end -->

### Missing

Disallow missing things with these `no-missing` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`custom-property-no-missing-var-function`](../../lib/rules/custom-property-no-missing-var-function/README.md)<br/>Disallow missing `var` function for custom properties. | ✅ | |
| [`font-family-no-missing-generic-family-keyword`](../../lib/rules/font-family-no-missing-generic-family-keyword/README.md)<br/>Disallow a missing generic family keyword within font families. | ✅ | |
<!-- prettier-ignore-end -->

### Non-standard

Disallow non-standard things with these `no-nonstandard` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`function-linear-gradient-no-nonstandard-direction`](../../lib/rules/function-linear-gradient-no-nonstandard-direction/README.md)<br/>Disallow non-standard direction values for linear gradient functions. | ✅ | |
<!-- prettier-ignore-end -->

### Overrides

Disallow overrides with these `no-overrides` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`declaration-block-no-shorthand-property-overrides`](../../lib/rules/declaration-block-no-shorthand-property-overrides/README.md)<br/>Disallow shorthand properties that override related longhand properties. | ✅ | |
<!-- prettier-ignore-end -->

### Unmatchable

Disallow unmatchable things with these `no-unmatchable` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`selector-anb-no-unmatchable`](../../lib/rules/selector-anb-no-unmatchable/README.md)<br/>Disallow unmatchable An+B selectors. | ✅ | |
<!-- prettier-ignore-end -->

### Unknown

Disallow unknown things with these `no-unknown` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`annotation-no-unknown`](../../lib/rules/annotation-no-unknown/README.md)<br/>Disallow unknown annotations. | ✅ | |
| [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md)<br/>Disallow unknown at-rules. | ✅ | |
| [`declaration-property-value-no-unknown`](../../lib/rules/declaration-property-value-no-unknown/README.md)<br/>Disallow unknown values for properties within declarations. | | |
| [`function-no-unknown`](../../lib/rules/function-no-unknown/README.md)<br/>Disallow unknown functions. | ✅ | |
| [`media-feature-name-no-unknown`](../../lib/rules/media-feature-name-no-unknown/README.md)<br/>Disallow unknown media feature names. | ✅ | |
| [`media-feature-name-value-no-unknown`](../../lib/rules/media-feature-name-value-no-unknown/README.md)<br/>Disallow unknown values for media features. | | |
| [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md)<br/>Disallow unknown animations. | | |
| [`no-unknown-custom-properties`](../../lib/rules/no-unknown-custom-properties/README.md)<br/>Disallow unknown custom properties. | | |
| [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md)<br/>Disallow unknown properties. | ✅ | |
| [`selector-pseudo-class-no-unknown`](../../lib/rules/selector-pseudo-class-no-unknown/README.md)<br/>Disallow unknown pseudo-class selectors. | ✅ | |
| [`selector-pseudo-element-no-unknown`](../../lib/rules/selector-pseudo-element-no-unknown/README.md)<br/>Disallow unknown pseudo-element selectors. | ✅ | |
| [`selector-type-no-unknown`](../../lib/rules/selector-type-no-unknown/README.md)<br/>Disallow unknown type selectors. | ✅ | |
| [`unit-no-unknown`](../../lib/rules/unit-no-unknown/README.md)<br/>Disallow unknown units. | ✅ | |
<!-- prettier-ignore-end -->

## Enforce conventions

You can enforce conventions with these `no` and `list` rules. They are powerful rules for making your code consistent. You'll need to configure most of them to suit your needs.

### Allowed, disallowed & required

Allow, disallow or require things with these `allowed-list`, `disallowed-list`, `required-list` and `no` rules.

#### At-rule

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`at-rule-allowed-list`](../../lib/rules/at-rule-allowed-list/README.md)<br/>Specify a list of allowed at-rules. | | |
| [`at-rule-disallowed-list`](../../lib/rules/at-rule-disallowed-list/README.md)<br/>Specify a list of disallowed at-rules. | | |
| [`at-rule-no-vendor-prefix`](../../lib/rules/at-rule-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for at-rules. | ✅ | 🔧 |
| [`at-rule-property-required-list`](../../lib/rules/at-rule-property-required-list/README.md)<br/>Specify a list of required properties for an at-rule. | | |
<!-- prettier-ignore-end -->

#### Color

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`color-hex-alpha`](../../lib/rules/color-hex-alpha/README.md)<br/>Require or disallow alpha channel for hex colors. | | |
| [`color-named`](../../lib/rules/color-named/README.md)<br/>Require (where possible) or disallow named colors. | | |
| [`color-no-hex`](../../lib/rules/color-no-hex/README.md)<br/>Disallow hex colors. | | |
<!-- prettier-ignore-end -->

#### Comment

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`comment-word-disallowed-list`](../../lib/rules/comment-word-disallowed-list/README.md)<br/>Specify a list of disallowed words within comments. | | |
<!-- prettier-ignore-end -->

#### Declaration

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`declaration-no-important`](../../lib/rules/declaration-no-important/README.md)<br/>Disallow `!important` within declarations. | | |
| [`declaration-property-unit-allowed-list`](../../lib/rules/declaration-property-unit-allowed-list/README.md)<br/>Specify a list of allowed property and unit pairs within declarations. | | |
| [`declaration-property-unit-disallowed-list`](../../lib/rules/declaration-property-unit-disallowed-list/README.md)<br/>Specify a list of disallowed property and unit pairs within declarations. | | |
| [`declaration-property-value-allowed-list`](../../lib/rules/declaration-property-value-allowed-list/README.md)<br/>Specify a list of allowed property and value pairs within declarations. | | |
| [`declaration-property-value-disallowed-list`](../../lib/rules/declaration-property-value-disallowed-list/README.md)<br/>Specify a list of disallowed property and value pairs within declarations. | | |
<!-- prettier-ignore-end -->

#### Function

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`function-allowed-list`](../../lib/rules/function-allowed-list/README.md)<br/>Specify a list of allowed functions. | | |
| [`function-disallowed-list`](../../lib/rules/function-disallowed-list/README.md)<br/>Specify a list of disallowed functions. | | |
| [`function-url-no-scheme-relative`](../../lib/rules/function-url-no-scheme-relative/README.md)<br/>Disallow scheme-relative URLs. | | |
| [`function-url-scheme-allowed-list`](../../lib/rules/function-url-scheme-allowed-list/README.md)<br/>Specify a list of allowed URL schemes. | | |
| [`function-url-scheme-disallowed-list`](../../lib/rules/function-url-scheme-disallowed-list/README.md)<br/>Specify a list of disallowed URL schemes. | | |
<!-- prettier-ignore-end -->

#### Length

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`length-zero-no-unit`](../../lib/rules/length-zero-no-unit/README.md)<br/>Disallow units for zero lengths. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

#### Media feature

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`media-feature-name-allowed-list`](../../lib/rules/media-feature-name-allowed-list/README.md)<br/>Specify a list of allowed media feature names. | | |
| [`media-feature-name-disallowed-list`](../../lib/rules/media-feature-name-disallowed-list/README.md)<br/>Specify a list of disallowed media feature names. | | |
| [`media-feature-name-no-vendor-prefix`](../../lib/rules/media-feature-name-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for media feature names. | ✅ | 🔧 |
| [`media-feature-name-unit-allowed-list`](../../lib/rules/media-feature-name-unit-allowed-list/README.md)<br/>Specify a list of allowed name and unit pairs within media features. | | |
| [`media-feature-name-value-allowed-list`](../../lib/rules/media-feature-name-value-allowed-list/README.md)<br/>Specify a list of allowed media feature name and value pairs. | | |
<!-- prettier-ignore-end -->

#### Property

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`property-allowed-list`](../../lib/rules/property-allowed-list/README.md)<br/>Specify a list of allowed properties. | | |
| [`property-disallowed-list`](../../lib/rules/property-disallowed-list/README.md)<br/>Specify a list of disallowed properties. | | |
| [`property-no-vendor-prefix`](../../lib/rules/property-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for properties. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

#### Rule

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`rule-selector-property-disallowed-list`](../../lib/rules/rule-selector-property-disallowed-list/README.md)<br/>Specify a list of disallowed properties for selectors within rules. | | |
<!-- prettier-ignore-end -->

#### Selector

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`selector-attribute-name-disallowed-list`](../../lib/rules/selector-attribute-name-disallowed-list/README.md)<br/>Specify a list of disallowed attribute names. | | |
| [`selector-attribute-operator-allowed-list`](../../lib/rules/selector-attribute-operator-allowed-list/README.md)<br/>Specify a list of allowed attribute operators. | | |
| [`selector-attribute-operator-disallowed-list`](../../lib/rules/selector-attribute-operator-disallowed-list/README.md)<br/>Specify a list of disallowed attribute operators. | | |
| [`selector-combinator-allowed-list`](../../lib/rules/selector-combinator-allowed-list/README.md)<br/>Specify a list of allowed combinators. | | |
| [`selector-combinator-disallowed-list`](../../lib/rules/selector-combinator-disallowed-list/README.md)<br/>Specify a list of disallowed combinators. | | |
| [`selector-disallowed-list`](../../lib/rules/selector-disallowed-list/README.md)<br/>Specify a list of disallowed selectors. | | |
| [`selector-no-qualifying-type`](../../lib/rules/selector-no-qualifying-type/README.md)<br/>Disallow qualifying a selector by type. | | |
| [`selector-no-vendor-prefix`](../../lib/rules/selector-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for selectors. | ✅ | 🔧 |
| [`selector-pseudo-class-allowed-list`](../../lib/rules/selector-pseudo-class-allowed-list/README.md)<br/>Specify a list of allowed pseudo-class selectors. | | |
| [`selector-pseudo-class-disallowed-list`](../../lib/rules/selector-pseudo-class-disallowed-list/README.md)<br/>Specify a list of disallowed pseudo-class selectors. | | |
| [`selector-pseudo-element-allowed-list`](../../lib/rules/selector-pseudo-element-allowed-list/README.md)<br/>Specify a list of allowed pseudo-element selectors. | | |
| [`selector-pseudo-element-disallowed-list`](../../lib/rules/selector-pseudo-element-disallowed-list/README.md)<br/>Specify a list of disallowed pseudo-element selectors. | | |
<!-- prettier-ignore-end -->

#### Unit

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md)<br/>Specify a list of allowed units. | | |
| [`unit-disallowed-list`](../../lib/rules/unit-disallowed-list/README.md)<br/>Specify a list of disallowed units. | | |
<!-- prettier-ignore-end -->

#### Value

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`value-no-vendor-prefix`](../../lib/rules/value-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for values. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

### Case

Specify lowercase or uppercase for words with these `case` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`function-name-case`](../../lib/rules/function-name-case/README.md)<br/>Specify lowercase or uppercase for function names. | ✅ | 🔧 |
| [`selector-type-case`](../../lib/rules/selector-type-case/README.md)<br/>Specify lowercase or uppercase for type selectors. | ✅ | 🔧 |
| [`value-keyword-case`](../../lib/rules/value-keyword-case/README.md)<br/>Specify lowercase or uppercase for keywords values. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

### Empty lines

Enforce or disallow empty lines before constructs with these `empty-line-before` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`at-rule-empty-line-before`](../../lib/rules/at-rule-empty-line-before/README.md)<br/>Require or disallow an empty line before at-rules. | ✅ | 🔧 |
| [`comment-empty-line-before`](../../lib/rules/comment-empty-line-before/README.md)<br/>Require or disallow an empty line before comments. | ✅ | 🔧 |
| [`custom-property-empty-line-before`](../../lib/rules/custom-property-empty-line-before/README.md)<br/>Require or disallow an empty line before custom properties. | ✅ | 🔧 |
| [`declaration-empty-line-before`](../../lib/rules/declaration-empty-line-before/README.md)<br/>Require or disallow an empty line before declarations. | ✅ | 🔧 |
| [`rule-empty-line-before`](../../lib/rules/rule-empty-line-before/README.md)<br/>Require or disallow an empty line before rules. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

### Max & min

Apply limits with these `max` and `min` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`declaration-block-single-line-max-declarations`](../../lib/rules/declaration-block-single-line-max-declarations/README.md)<br/>Limit the number of declarations within a single-line declaration block. | | ✅ | |
| [`declaration-property-max-values`](../../lib/rules/declaration-property-max-values/README.md)<br/>Limit the number of values for a list of properties within declarations. | | |
| [`max-nesting-depth`](../../lib/rules/max-nesting-depth/README.md)<br/>Limit the depth of nesting. | | |
| [`number-max-precision`](../../lib/rules/number-max-precision/README.md)<br/>Limit the number of decimal places allowed in numbers. | | ✅ | |
| [`selector-max-attribute`](../../lib/rules/selector-max-attribute/README.md)<br/>Limit the number of attribute selectors in a selector. | | |
| [`selector-max-class`](../../lib/rules/selector-max-class/README.md)<br/>Limit the number of classes in a selector. | | |
| [`selector-max-combinators`](../../lib/rules/selector-max-combinators/README.md)<br/>Limit the number of combinators in a selector. | | |
| [`selector-max-compound-selectors`](../../lib/rules/selector-max-compound-selectors/README.md)<br/>Limit the number of compound selectors in a selector. | | |
| [`selector-max-id`](../../lib/rules/selector-max-id/README.md)<br/>Limit the number of ID selectors in a selector. | | |
| [`selector-max-pseudo-class`](../../lib/rules/selector-max-pseudo-class/README.md)<br/>Limit the number of pseudo-classes in a selector. | | |
| [`selector-max-specificity`](../../lib/rules/selector-max-specificity/README.md)<br/>Limit the specificity of selectors. | | |
| [`selector-max-type`](../../lib/rules/selector-max-type/README.md)<br/>Limit the number of type selectors in a selector. | | |
| [`selector-max-universal`](../../lib/rules/selector-max-universal/README.md)<br/>Limit the number of universal selectors in a selector. | | |
| [`time-min-milliseconds`](../../lib/rules/time-min-milliseconds/README.md)<br/>Limit the minimum number of milliseconds for time values. | | |
<!-- prettier-ignore-end -->

### Notation

Enforce one representation of things that have multiple with these `notation` (sometimes implicit) rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`alpha-value-notation`](../../lib/rules/alpha-value-notation/README.md)<br/>Specify percentage or number notation for alpha-values. | ✅ | 🔧 |
| [`color-function-notation`](../../lib/rules/color-function-notation/README.md)<br/>Specify modern or legacy notation for color-functions. | ✅ | 🔧 |
| [`color-hex-length`](../../lib/rules/color-hex-length/README.md)<br/>Specify short or long notation for hex colors. | ✅ | 🔧 |
| [`font-weight-notation`](../../lib/rules/font-weight-notation/README.md)<br/>Specify numeric or named notation for font weights. | | 🔧 |
| [`hue-degree-notation`](../../lib/rules/hue-degree-notation/README.md)<br/>Specify number or angle notation for degree hues. | ✅ | 🔧 |
| [`import-notation`](../../lib/rules/import-notation/README.md)<br/>Specify string or URL notation for `@import` rules. | ✅ | 🔧 |
| [`keyframe-selector-notation`](../../lib/rules/keyframe-selector-notation/README.md)<br/>Specify keyword or percentage notation for keyframe selectors. | ✅ | 🔧 |
| [`media-feature-range-notation`](../../lib/rules/media-feature-range-notation/README.md)<br/>Specify context or prefix notation for media feature ranges. | ✅ | 🔧 |
| [`selector-not-notation`](../../lib/rules/selector-not-notation/README.md)<br/>Specify simple or complex notation for `:not()` pseudo-class selectors. | ✅ | 🔧 |
| [`selector-pseudo-element-colon-notation`](../../lib/rules/selector-pseudo-element-colon-notation/README.md)<br/>Specify single or double colon notation for applicable pseudo-element selectors. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

### Pattern

Enforce naming conventions with these `pattern` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`comment-pattern`](../../lib/rules/comment-pattern/README.md)<br/>Specify a pattern for comments. | | |
| [`custom-media-pattern`](../../lib/rules/custom-media-pattern/README.md)<br/>Specify a pattern for custom media query names. | | ✅ | |
| [`custom-property-pattern`](../../lib/rules/custom-property-pattern/README.md)<br/>Specify a pattern for custom properties. | | ✅ | |
| [`keyframes-name-pattern`](../../lib/rules/keyframes-name-pattern/README.md)<br/>Specify a pattern for keyframe names. | | ✅ | |
| [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md)<br/>Specify a pattern for class selectors. | | ✅ | |
| [`selector-id-pattern`](../../lib/rules/selector-id-pattern/README.md)<br/>Specify a pattern for ID selectors. | | ✅ | |
| [`selector-nested-pattern`](../../lib/rules/selector-nested-pattern/README.md)<br/>Specify a pattern for the selectors of rules nested within rules. | | |
<!-- prettier-ignore-end -->

### Quotes

Require or disallow quotes with these `quotes` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`font-family-name-quotes`](../../lib/rules/font-family-name-quotes/README.md)<br/>Require or disallow quotes for font family names. | ✅ | 🔧 |
| [`function-url-quotes`](../../lib/rules/function-url-quotes/README.md)<br/>Require or disallow quotes for urls. | ✅ | 🔧 |
| [`selector-attribute-quotes`](../../lib/rules/selector-attribute-quotes/README.md)<br/>Require or disallow quotes for attribute values. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

### Redundant

Disallow redundancy with these `no-redundant` rules.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`declaration-block-no-redundant-longhand-properties`](../../lib/rules/declaration-block-no-redundant-longhand-properties/README.md)<br/>Disallow redundant longhand properties within declaration-block. | ✅ | 🔧 |
| [`shorthand-property-no-redundant-values`](../../lib/rules/shorthand-property-no-redundant-values/README.md)<br/>Disallow redundant values within shorthand properties. | ✅ | 🔧 |
<!-- prettier-ignore-end -->

### Whitespace inside

Require or disallow whitespace on the inside with this `whitespace-inside` rule.

<!-- prettier-ignore-start -->
| | | |
| :-- | :-: | :-: |
| [`comment-whitespace-inside`](../../lib/rules/comment-whitespace-inside/README.md)<br/>Require or disallow whitespace on the inside of comment markers. | ✅ | 🔧 |
<!-- prettier-ignore-end -->
