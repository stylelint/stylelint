# Rules

There are over one hundred built-in rules to help you:

- [avoid errors](#avoid-errors)
- [enforce conventions](#enforce-conventions)

Many of them are turned on in our [recommended](https://www.npmjs.com/package/stylelint-config-recommended) and [standard](https://www.npmjs.com/package/stylelint-config-standard) configs.

- ⭐️ - [Recommended](https://www.npmjs.com/package/stylelint-config-recommended)
- 💅 - [Standard](https://www.npmjs.com/package/stylelint-config-standard)
- 🔧 - Autofixable

## Avoid errors

You can avoid errors with these `no` rules.

### Descending

Disallow descending things with these `no-descending` rules.

| Rule                                                                                                                                                                                         | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`no-descending-specificity`](../../lib/rules/no-descending-specificity/README.md)<br/>Disallow selectors of lower specificity from coming after overriding selectors of higher specificity. | ⭐️ | 💅  |     |

### Duplicate

Disallow duplicates with these `no-duplicate` rules.

| Rule                                                                                                                                                                                                 | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-block-no-duplicate-custom-properties`](../../lib/rules/declaration-block-no-duplicate-custom-properties/README.md)<br/>Disallow duplicate custom properties within declaration blocks. | ⭐️ | 💅  |     |
| [`declaration-block-no-duplicate-properties`](../../lib/rules/declaration-block-no-duplicate-properties/README.md)<br/>Disallow duplicate properties within declaration blocks.                      | ⭐️ | 💅  | 🔧  |
| [`font-family-no-duplicate-names`](../../lib/rules/font-family-no-duplicate-names/README.md)<br/>Disallow duplicate names within font families.                                                      | ⭐️ | 💅  | 🔧  |
| [`keyframe-block-no-duplicate-selectors`](../../lib/rules/keyframe-block-no-duplicate-selectors/README.md)<br/>Disallow duplicate selectors within keyframe blocks.                                  | ⭐️ | 💅  |     |
| [`no-duplicate-at-import-rules`](../../lib/rules/no-duplicate-at-import-rules/README.md)<br/>Disallow duplicate `@import` rules.                                                                     | ⭐️ | 💅  |     |
| [`no-duplicate-selectors`](../../lib/rules/no-duplicate-selectors/README.md)<br/>Disallow duplicate selectors.                                                                                       | ⭐️ | 💅  |     |

### Empty

Disallow empty things with these `no-empty` rules.

| Rule                                                                                          | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`block-no-empty`](../../lib/rules/block-no-empty/README.md)<br/>Disallow empty blocks.       | ⭐️ | 💅  |     |
| [`comment-no-empty`](../../lib/rules/comment-no-empty/README.md)<br/>Disallow empty comments. | ⭐️ | 💅  |     |
| [`no-empty-source`](../../lib/rules/no-empty-source/README.md)<br/>Disallow empty sources.    | ⭐️ | 💅  |     |

### Invalid

Disallow invalid syntax with these (sometimes implicit) `no-invalid` rules.

| Rule                                                                                                                                                                 | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`color-no-invalid-hex`](../../lib/rules/color-no-invalid-hex/README.md)<br/>Disallow invalid hex colors.                                                            | ⭐️ | 💅  |     |
| [`function-calc-no-unspaced-operator`](../../lib/rules/function-calc-no-unspaced-operator/README.md)<br/>Disallow invalid unspaced operator within `calc` functions. | ⭐️ | 💅  | 🔧  |
| [`keyframe-declaration-no-important`](../../lib/rules/keyframe-declaration-no-important/README.md)<br/>Disallow invalid `!important` within keyframe declarations.   | ⭐️ | 💅  |     |
| [`named-grid-areas-no-invalid`](../../lib/rules/named-grid-areas-no-invalid/README.md)<br/>Disallow invalid named grid areas.                                        | ⭐️ | 💅  |     |
| [`no-invalid-double-slash-comments`](../../lib/rules/no-invalid-double-slash-comments/README.md)<br/>Disallow invalid double-slash comments.                         | ⭐️ | 💅  |     |
| [`no-invalid-position-at-import-rule`](../../lib/rules/no-invalid-position-at-import-rule/README.md)<br/>Disallow invalid position `@import` rules.                  | ⭐️ | 💅  |     |
| [`string-no-newline`](../../lib/rules/string-no-newline/README.md)<br/>Disallow invalid newlines within strings.                                                     | ⭐️ | 💅  |     |

### Irregular

Disallow irregular things with these `no-irregular` rules.

| Rule                                                                                                              | ⭐️ | 💅  | 🔧  |
| ----------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`no-irregular-whitespace`](../../lib/rules/no-irregular-whitespace/README.md)<br/>Disallow irregular whitespace. | ⭐️ | 💅  |     |

### Missing

Disallow missing things with these `no-missing` rules.

| Rule                                                                                                                                                                                           | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`custom-property-no-missing-var-function`](../../lib/rules/custom-property-no-missing-var-function/README.md)<br/>Disallow missing `var` function for custom properties.                      | ⭐️ | 💅  |     |
| [`font-family-no-missing-generic-family-keyword`](../../lib/rules/font-family-no-missing-generic-family-keyword/README.md)<br/>Disallow a missing generic family keyword within font families. | ⭐️ | 💅  |     |

### Non-standard

Disallow non-standard things with these `no-nonstandard` rules.

| Rule                                                                                                                                                                                                         | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`function-linear-gradient-no-nonstandard-direction`](../../lib/rules/function-linear-gradient-no-nonstandard-direction/README.md)<br/>Disallow non-standard direction values for linear gradient functions. | ⭐️ | 💅  |     |

### Overrides

Disallow overrides with these `no-overrides` rules.

| Rule                                                                                                                                                                                                            | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-block-no-shorthand-property-overrides`](../../lib/rules/declaration-block-no-shorthand-property-overrides/README.md)<br/>Disallow shorthand properties that override related longhand properties. | ⭐️ | 💅  |     |

### Unmatchable

Disallow unmatchable things with these `no-unmatchable` rules.

| Rule                                                                                                                            | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`selector-anb-no-unmatchable`](../../lib/rules/selector-anb-no-unmatchable/README.md)<br/>Disallow unmatchable An+B selectors. | ⭐️ | 💅  |     |

### Unknown

Disallow unknown things with these `no-unknown` rules.

| Rule                                                                                                                                                                       | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`annotation-no-unknown`](../../lib/rules/annotation-no-unknown/README.md)<br/>Disallow unknown annotations.                                                               | ⭐️ | 💅  |     |
| [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md)<br/>Disallow unknown at-rules.                                                                        | ⭐️ | 💅  |     |
| [`declaration-property-value-no-unknown`](../../lib/rules/declaration-property-value-no-unknown/README.md)<br/>Disallow unknown values for properties within declarations. |     |     |     |
| [`function-no-unknown`](../../lib/rules/function-no-unknown/README.md)<br/>Disallow unknown functions.                                                                     | ⭐️ | 💅  |     |
| [`media-feature-name-no-unknown`](../../lib/rules/media-feature-name-no-unknown/README.md)<br/>Disallow unknown media feature names.                                       | ⭐️ | 💅  |     |
| [`media-feature-name-value-no-unknown`](../../lib/rules/media-feature-name-value-no-unknown/README.md)<br/>Disallow unknown values for media features.                     |     |     |     |
| [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md)<br/>Disallow unknown animations.                                                                |     |     |     |
| [`no-unknown-custom-properties`](../../lib/rules/no-unknown-custom-properties/README.md)<br/>Disallow unknown custom properties.                                           |     |     |     |
| [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md)<br/>Disallow unknown properties.                                                                    | ⭐️ | 💅  |     |
| [`selector-pseudo-class-no-unknown`](../../lib/rules/selector-pseudo-class-no-unknown/README.md)<br/>Disallow unknown pseudo-class selectors.                              | ⭐️ | 💅  |     |
| [`selector-pseudo-element-no-unknown`](../../lib/rules/selector-pseudo-element-no-unknown/README.md)<br/>Disallow unknown pseudo-element selectors.                        | ⭐️ | 💅  |     |
| [`selector-type-no-unknown`](../../lib/rules/selector-type-no-unknown/README.md)<br/>Disallow unknown type selectors.                                                      | ⭐️ | 💅  |     |
| [`unit-no-unknown`](../../lib/rules/unit-no-unknown/README.md)<br/>Disallow unknown units.                                                                                 | ⭐️ | 💅  |     |

## Enforce conventions

You can enforce conventions with these `no` and `list` rules. They are powerful rules for making your code consistent. You'll need to configure most of them to suit your needs.

### Allowed, disallowed & required

Allow, disallow or require things with these `allowed-list`, `disallowed-list`, `required-list` and `no` rules.

#### At-rule

| Rule                                                                                                                                                   | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`at-rule-allowed-list`](../../lib/rules/at-rule-allowed-list/README.md)<br/>Specify a list of allowed at-rules.                                       |     |     |     |
| [`at-rule-disallowed-list`](../../lib/rules/at-rule-disallowed-list/README.md)<br/>Specify a list of disallowed at-rules.                              |     |     |     |
| [`at-rule-no-vendor-prefix`](../../lib/rules/at-rule-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for at-rules.                            |     | 💅  | 🔧  |
| [`at-rule-property-required-list`](../../lib/rules/at-rule-property-required-list/README.md)<br/>Specify a list of required properties for an at-rule. |     |     |     |

#### Color

| Rule                                                                                                                 | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`color-hex-alpha`](../../lib/rules/color-hex-alpha/README.md)<br/>Require or disallow alpha channel for hex colors. |     |     |     |
| [`color-named`](../../lib/rules/color-named/README.md)<br/>Require (where possible) or disallow named colors.        |     |     |     |
| [`color-no-hex`](../../lib/rules/color-no-hex/README.md)<br/>Disallow hex colors.                                    |     |     |     |

#### Comment

| Rule                                                                                                                                             | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`comment-word-disallowed-list`](../../lib/rules/comment-word-disallowed-list/README.md)<br/>Specify a list of disallowed words within comments. |     |     |     |

#### Declaration

| Rule                                                                                                                                                                                                | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-no-important`](../../lib/rules/declaration-no-important/README.md)<br/>Disallow `!important` within declarations.                                                                     |     |     |     |
| [`declaration-property-unit-allowed-list`](../../lib/rules/declaration-property-unit-allowed-list/README.md)<br/>Specify a list of allowed property and unit pairs within declarations.             |     |     |     |
| [`declaration-property-unit-disallowed-list`](../../lib/rules/declaration-property-unit-disallowed-list/README.md)<br/>Specify a list of disallowed property and unit pairs within declarations.    |     |     |     |
| [`declaration-property-value-allowed-list`](../../lib/rules/declaration-property-value-allowed-list/README.md)<br/>Specify a list of allowed property and value pairs within declarations.          |     |     |     |
| [`declaration-property-value-disallowed-list`](../../lib/rules/declaration-property-value-disallowed-list/README.md)<br/>Specify a list of disallowed property and value pairs within declarations. |     |     |     |

#### Function

| Rule                                                                                                                                                 | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`function-allowed-list`](../../lib/rules/function-allowed-list/README.md)<br/>Specify a list of allowed functions.                                  |     |     |     |
| [`function-disallowed-list`](../../lib/rules/function-disallowed-list/README.md)<br/>Specify a list of disallowed functions.                         |     |     |     |
| [`function-url-no-scheme-relative`](../../lib/rules/function-url-no-scheme-relative/README.md)<br/>Disallow scheme-relative URLs.                    |     |     |     |
| [`function-url-scheme-allowed-list`](../../lib/rules/function-url-scheme-allowed-list/README.md)<br/>Specify a list of allowed URL schemes.          |     |     |     |
| [`function-url-scheme-disallowed-list`](../../lib/rules/function-url-scheme-disallowed-list/README.md)<br/>Specify a list of disallowed URL schemes. |     |     |     |

#### Length

| Rule                                                                                                        | ⭐️ | 💅  | 🔧  |
| ----------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`length-zero-no-unit`](../../lib/rules/length-zero-no-unit/README.md)<br/>Disallow units for zero lengths. |     | 💅  | 🔧  |

#### Media feature

| Rule                                                                                                                                                                              | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`media-feature-name-allowed-list`](../../lib/rules/media-feature-name-allowed-list/README.md)<br/>Specify a list of allowed media feature names.                                 |     |     |     |
| [`media-feature-name-disallowed-list`](../../lib/rules/media-feature-name-disallowed-list/README.md)<br/>Specify a list of disallowed media feature names.                        |     |     |     |
| [`media-feature-name-no-vendor-prefix`](../../lib/rules/media-feature-name-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for media feature names.                      |     | 💅  | 🔧  |
| [`media-feature-name-unit-allowed-list`](../../lib/rules/media-feature-name-unit-allowed-list/README.md)<br/>Specify a list of allowed name and unit pairs within media features. |     |     |     |
| [`media-feature-name-value-allowed-list`](../../lib/rules/media-feature-name-value-allowed-list/README.md)<br/>Specify a list of allowed media feature name and value pairs.      |     |     |     |

#### Property

| Rule                                                                                                                            | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`property-allowed-list`](../../lib/rules/property-allowed-list/README.md)<br/>Specify a list of allowed properties.            |     |     |     |
| [`property-disallowed-list`](../../lib/rules/property-disallowed-list/README.md)<br/>Specify a list of disallowed properties.   |     |     |     |
| [`property-no-vendor-prefix`](../../lib/rules/property-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for properties. |     | 💅  | 🔧  |

#### Rule

| Rule                                                                                                                                                                                 | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`rule-selector-property-disallowed-list`](../../lib/rules/rule-selector-property-disallowed-list/README.md)<br/>Specify a list of disallowed properties for selectors within rules. |     |     |     |

#### Selector

| Rule                                                                                                                                                                         | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`selector-attribute-name-disallowed-list`](../../lib/rules/selector-attribute-name-disallowed-list/README.md)<br/>Specify a list of disallowed attribute names.             |     |     |     |
| [`selector-attribute-operator-allowed-list`](../../lib/rules/selector-attribute-operator-allowed-list/README.md)<br/>Specify a list of allowed attribute operators.          |     |     |     |
| [`selector-attribute-operator-disallowed-list`](../../lib/rules/selector-attribute-operator-disallowed-list/README.md)<br/>Specify a list of disallowed attribute operators. |     |     |     |
| [`selector-combinator-allowed-list`](../../lib/rules/selector-combinator-allowed-list/README.md)<br/>Specify a list of allowed combinators.                                  |     |     |     |
| [`selector-combinator-disallowed-list`](../../lib/rules/selector-combinator-disallowed-list/README.md)<br/>Specify a list of disallowed combinators.                         |     |     |     |
| [`selector-disallowed-list`](../../lib/rules/selector-disallowed-list/README.md)<br/>Specify a list of disallowed selectors.                                                 |     |     |     |
| [`selector-no-qualifying-type`](../../lib/rules/selector-no-qualifying-type/README.md)<br/>Disallow qualifying a selector by type.                                           |     |     |     |
| [`selector-no-vendor-prefix`](../../lib/rules/selector-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for selectors.                                               |     | 💅  | 🔧  |
| [`selector-pseudo-class-allowed-list`](../../lib/rules/selector-pseudo-class-allowed-list/README.md)<br/>Specify a list of allowed pseudo-class selectors.                   |     |     |     |
| [`selector-pseudo-class-disallowed-list`](../../lib/rules/selector-pseudo-class-disallowed-list/README.md)<br/>Specify a list of disallowed pseudo-class selectors.          |     |     |     |
| [`selector-pseudo-element-allowed-list`](../../lib/rules/selector-pseudo-element-allowed-list/README.md)<br/>Specify a list of allowed pseudo-element selectors.             |     |     |     |
| [`selector-pseudo-element-disallowed-list`](../../lib/rules/selector-pseudo-element-disallowed-list/README.md)<br/>Specify a list of disallowed pseudo-element selectors.    |     |     |     |

#### Unit

| Rule                                                                                                             | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md)<br/>Specify a list of allowed units.          |     |     |     |
| [`unit-disallowed-list`](../../lib/rules/unit-disallowed-list/README.md)<br/>Specify a list of disallowed units. |     |     |     |

#### Value

| Rule                                                                                                                  | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`value-no-vendor-prefix`](../../lib/rules/value-no-vendor-prefix/README.md)<br/>Disallow vendor prefixes for values. |     | 💅  | 🔧  |

### Case

Specify lowercase or uppercase for words.

| Rule                                                                                                                         | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`function-name-case`](../../lib/rules/function-name-case/README.md)<br/>Specify lowercase or uppercase for function names.  |     | 💅  | 🔧  |
| [`selector-type-case`](../../lib/rules/selector-type-case/README.md)<br/>Specify lowercase or uppercase for type selectors.  |     | 💅  | 🔧  |
| [`value-keyword-case`](../../lib/rules/value-keyword-case/README.md)<br/>Specify lowercase or uppercase for keywords values. |     | 💅  | 🔧  |

### Empty lines

| Rule                                                                                                                                                               | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`at-rule-empty-line-before`](../../lib/rules/at-rule-empty-line-before/README.md)<br/>Require or disallow an empty line before at-rules.                          |     | 💅  | 🔧  |
| [`comment-empty-line-before`](../../lib/rules/comment-empty-line-before/README.md)<br/>Require or disallow an empty line before comments.                          |     | 💅  | 🔧  |
| [`custom-property-empty-line-before`](../../lib/rules/custom-property-empty-line-before/README.md)<br/>Require or disallow an empty line before custom properties. |     | 💅  | 🔧  |
| [`declaration-empty-line-before`](../../lib/rules/declaration-empty-line-before/README.md)<br/>Require or disallow an empty line before declarations.              |     | 💅  | 🔧  |
| [`rule-empty-line-before`](../../lib/rules/rule-empty-line-before/README.md)<br/>Require or disallow an empty line before rules.                                   |     | 💅  | 🔧  |

### Max & min

Apply limits with these `max` and `min` rules.

| Rule                                                                                                                                                                                                      | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-block-single-line-max-declarations`](../../lib/rules/declaration-block-single-line-max-declarations/README.md)<br/>Limit the number of declarations within a single-line declaration block. |     | 💅  |     |
| [`declaration-property-max-values`](../../lib/rules/declaration-property-max-values/README.md)<br/>Limit the number of values for a list of properties within declarations.                               |     |     |     |
| [`max-nesting-depth`](../../lib/rules/max-nesting-depth/README.md)<br/>Limit the depth of nesting.                                                                                                        |     |     |     |
| [`number-max-precision`](../../lib/rules/number-max-precision/README.md)<br/>Limit the number of decimal places allowed in numbers.                                                                       |     | 💅  |     |
| [`selector-max-attribute`](../../lib/rules/selector-max-attribute/README.md)<br/>Limit the number of attribute selectors in a selector.                                                                   |     |     |     |
| [`selector-max-class`](../../lib/rules/selector-max-class/README.md)<br/>Limit the number of classes in a selector.                                                                                       |     |     |     |
| [`selector-max-combinators`](../../lib/rules/selector-max-combinators/README.md)<br/>Limit the number of combinators in a selector.                                                                       |     |     |     |
| [`selector-max-compound-selectors`](../../lib/rules/selector-max-compound-selectors/README.md)<br/>Limit the number of compound selectors in a selector.                                                  |     |     |     |
| [`selector-max-id`](../../lib/rules/selector-max-id/README.md)<br/>Limit the number of ID selectors in a selector.                                                                                        |     |     |     |
| [`selector-max-pseudo-class`](../../lib/rules/selector-max-pseudo-class/README.md)<br/>Limit the number of pseudo-classes in a selector.                                                                  |     |     |     |
| [`selector-max-specificity`](../../lib/rules/selector-max-specificity/README.md)<br/>Limit the specificity of selectors.                                                                                  |     |     |     |
| [`selector-max-type`](../../lib/rules/selector-max-type/README.md)<br/>Limit the number of type selectors in a selector.                                                                                  |     |     |     |
| [`selector-max-universal`](../../lib/rules/selector-max-universal/README.md)<br/>Limit the number of universal selectors in a selector.                                                                   |     |     |     |
| [`time-min-milliseconds`](../../lib/rules/time-min-milliseconds/README.md)<br/>Limit the minimum number of milliseconds for time values.                                                                  |     |     |     |

### Notation

Enforce one representation of things that have multiple with these `notation` (sometimes implicit) rules.

| Rule                                                                                                                                                                                              | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`alpha-value-notation`](../../lib/rules/alpha-value-notation/README.md)<br/>Specify percentage or number notation for alpha-values.                                                              |     | 💅  | 🔧  |
| [`color-function-notation`](../../lib/rules/color-function-notation/README.md)<br/>Specify modern or legacy notation for color-functions.                                                         |     | 💅  | 🔧  |
| [`color-hex-length`](../../lib/rules/color-hex-length/README.md)<br/>Specify short or long notation for hex colors.                                                                               |     | 💅  | 🔧  |
| [`font-weight-notation`](../../lib/rules/font-weight-notation/README.md)<br/>Specify numeric or named notation for font weights.                                                                  |     |     | 🔧  |
| [`hue-degree-notation`](../../lib/rules/hue-degree-notation/README.md)<br/>Specify number or angle notation for degree hues.                                                                      |     | 💅  | 🔧  |
| [`import-notation`](../../lib/rules/import-notation/README.md)<br/>Specify string or URL notation for `@import` rules.                                                                            |     | 💅  | 🔧  |
| [`keyframe-selector-notation`](../../lib/rules/keyframe-selector-notation/README.md)<br/>Specify keyword or percentage notation for keyframe selectors.                                           |     | 💅  | 🔧  |
| [`media-feature-range-notation`](../../lib/rules/media-feature-range-notation/README.md)<br/>Specify context or prefix notation for media feature ranges.                                         |     | 💅  | 🔧  |
| [`selector-not-notation`](../../lib/rules/selector-not-notation/README.md)<br/>Specify simple or complex notation for `:not()` pseudo-class selectors.                                            |     | 💅  | 🔧  |
| [`selector-pseudo-element-colon-notation`](../../lib/rules/selector-pseudo-element-colon-notation/README.md)<br/>Specify single or double colon notation for applicable pseudo-element selectors. |     | 💅  | 🔧  |

### Pattern

Enforce naming conventions with these `pattern` rules.

| Rule                                                                                                                                                 | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`comment-pattern`](../../lib/rules/comment-pattern/README.md)<br/>Specify a pattern for comments.                                                   |     |     |     |
| [`custom-media-pattern`](../../lib/rules/custom-media-pattern/README.md)<br/>Specify a pattern for custom media query names.                         |     | 💅  |     |
| [`custom-property-pattern`](../../lib/rules/custom-property-pattern/README.md)<br/>Specify a pattern for custom properties.                          |     | 💅  |     |
| [`keyframes-name-pattern`](../../lib/rules/keyframes-name-pattern/README.md)<br/>Specify a pattern for keyframe names.                               |     | 💅  |     |
| [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md)<br/>Specify a pattern for class selectors.                              |     | 💅  |     |
| [`selector-id-pattern`](../../lib/rules/selector-id-pattern/README.md)<br/>Specify a pattern for ID selectors.                                       |     | 💅  |     |
| [`selector-nested-pattern`](../../lib/rules/selector-nested-pattern/README.md)<br/>Specify a pattern for the selectors of rules nested within rules. |     |     |     |

### Quotes

Require or disallow quotes with these `quotes` rules.

| Rule                                                                                                                                    | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`font-family-name-quotes`](../../lib/rules/font-family-name-quotes/README.md)<br/>Require or disallow quotes for font family names.    |     | 💅  | 🔧  |
| [`function-url-quotes`](../../lib/rules/function-url-quotes/README.md)<br/>Require or disallow quotes for urls.                         |     | 💅  | 🔧  |
| [`selector-attribute-quotes`](../../lib/rules/selector-attribute-quotes/README.md)<br/>Require or disallow quotes for attribute values. |     | 💅  | 🔧  |

### Redundant

Disallow redundancy with these `no-redundant` rules.

| Rule                                                                                                                                                                                                      | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-block-no-redundant-longhand-properties`](../../lib/rules/declaration-block-no-redundant-longhand-properties/README.md)<br/>Disallow redundant longhand properties within declaration-block. |     | 💅  | 🔧  |
| [`shorthand-property-no-redundant-values`](../../lib/rules/shorthand-property-no-redundant-values/README.md)<br/>Disallow redundant values within shorthand properties.                                   |     | 💅  | 🔧  |

### Whitespace inside

Require or disallow whitespace on the inside.

| Rule                                                                                                                                                    | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`comment-whitespace-inside`](../../lib/rules/comment-whitespace-inside/README.md)<br/>Require or disallow whitespace on the inside of comment markers. |     | 💅  | 🔧  |

## Deprecated

These rules are deprecated — we won't fix bugs nor add options, and we will remove them in the next major release. We recommend you use a pretty printer (like Prettier) alongside Stylelint rather than these rules.

### Color

| Rule                                                                                                            | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`color-hex-case`](../../lib/rules/color-hex-case/README.md)<br/>Specify lowercase or uppercase for hex colors. |     |     | 🔧  |

### Function

| Rule                                                                                                                                                                                                | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`function-comma-newline-after`](../../lib/rules/function-comma-newline-after/README.md)<br/>Require a newline or disallow whitespace after the commas of functions.                                |     |     | 🔧  |
| [`function-comma-newline-before`](../../lib/rules/function-comma-newline-before/README.md)<br/>Require a newline or disallow whitespace before the commas of functions.                             |     |     | 🔧  |
| [`function-comma-space-after`](../../lib/rules/function-comma-space-after/README.md)<br/>Require a single space or disallow whitespace after the commas of functions.                               |     |     | 🔧  |
| [`function-comma-space-before`](../../lib/rules/function-comma-space-before/README.md)<br/>Require a single space or disallow whitespace before the commas of functions.                            |     |     | 🔧  |
| [`function-max-empty-lines`](../../lib/rules/function-max-empty-lines/README.md)<br/>Limit the number of adjacent empty lines within functions.                                                     |     |     | 🔧  |
| [`function-parentheses-newline-inside`](../../lib/rules/function-parentheses-newline-inside/README.md)<br/>Require a newline or disallow whitespace on the inside of the parentheses of functions.  |     |     | 🔧  |
| [`function-parentheses-space-inside`](../../lib/rules/function-parentheses-space-inside/README.md)<br/>Require a single space or disallow whitespace on the inside of the parentheses of functions. |     |     | 🔧  |
| [`function-whitespace-after`](../../lib/rules/function-whitespace-after/README.md)<br/>Require or disallow whitespace after functions.                                                              |     |     | 🔧  |

### Number

| Rule                                                                                                                                              | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`number-leading-zero`](../../lib/rules/number-leading-zero/README.md)<br/>Require or disallow a leading zero for fractional numbers less than 1. |     |     | 🔧  |
| [`number-no-trailing-zeros`](../../lib/rules/number-no-trailing-zeros/README.md)<br/>Disallow trailing zeros in numbers.                          |     |     | 🔧  |

### String

| Rule                                                                                                           | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`string-quotes`](../../lib/rules/string-quotes/README.md)<br/>Specify single or double quotes around strings. |     |     | 🔧  |

### Unit

| Rule                                                                                             | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`unit-case`](../../lib/rules/unit-case/README.md)<br/>Specify lowercase or uppercase for units. |     |     | 🔧  |

### Value list

| Rule                                                                                                                                                                           | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`value-list-comma-newline-after`](../../lib/rules/value-list-comma-newline-after/README.md)<br/>Require a newline or disallow whitespace after the commas of value lists.     |     |     | 🔧  |
| [`value-list-comma-newline-before`](../../lib/rules/value-list-comma-newline-before/README.md)<br/>Require a newline or disallow whitespace before the commas of value lists.  |     |     |     |
| [`value-list-comma-space-after`](../../lib/rules/value-list-comma-space-after/README.md)<br/>Require a single space or disallow whitespace after the commas of value lists.    |     |     | 🔧  |
| [`value-list-comma-space-before`](../../lib/rules/value-list-comma-space-before/README.md)<br/>Require a single space or disallow whitespace before the commas of value lists. |     |     | 🔧  |
| [`value-list-max-empty-lines`](../../lib/rules/value-list-max-empty-lines/README.md)<br/>Limit the number of adjacent empty lines within value lists.                          |     |     | 🔧  |

### Property

| Rule                                                                                                          | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`property-case`](../../lib/rules/property-case/README.md)<br/>Specify lowercase or uppercase for properties. |     |     | 🔧  |

### Declaration

| Rule                                                                                                                                                                             | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-bang-space-after`](../../lib/rules/declaration-bang-space-after/README.md)<br/>Require a single space or disallow whitespace after the bang of declarations.       |     |     | 🔧  |
| [`declaration-bang-space-before`](../../lib/rules/declaration-bang-space-before/README.md)<br/>Require a single space or disallow whitespace before the bang of declarations.    |     |     | 🔧  |
| [`declaration-colon-newline-after`](../../lib/rules/declaration-colon-newline-after/README.md)<br/>Require a newline or disallow whitespace after the colon of declarations.     |     |     | 🔧  |
| [`declaration-colon-space-after`](../../lib/rules/declaration-colon-space-after/README.md)<br/>Require a single space or disallow whitespace after the colon of declarations.    |     |     | 🔧  |
| [`declaration-colon-space-before`](../../lib/rules/declaration-colon-space-before/README.md)<br/>Require a single space or disallow whitespace before the colon of declarations. |     |     | 🔧  |

### Declaration block

| Rule                                                                                                                                                                                                            | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`declaration-block-semicolon-newline-after`](../../lib/rules/declaration-block-semicolon-newline-after/README.md)<br/>Require a newline or disallow whitespace after the semicolons of declaration blocks.     |     |     | 🔧  |
| [`declaration-block-semicolon-newline-before`](../../lib/rules/declaration-block-semicolon-newline-before/README.md)<br/>Require a newline or disallow whitespace before the semicolons of declaration blocks.  |     |     |     |
| [`declaration-block-semicolon-space-after`](../../lib/rules/declaration-block-semicolon-space-after/README.md)<br/>Require a single space or disallow whitespace after the semicolons of declaration blocks.    |     |     | 🔧  |
| [`declaration-block-semicolon-space-before`](../../lib/rules/declaration-block-semicolon-space-before/README.md)<br/>Require a single space or disallow whitespace before the semicolons of declaration blocks. |     |     | 🔧  |
| [`declaration-block-trailing-semicolon`](../../lib/rules/declaration-block-trailing-semicolon/README.md)<br/>Require or disallow a trailing semicolon within declaration blocks.                                |     |     | 🔧  |

### Block

| Rule                                                                                                                                                                                   | ⭐️ | 💅  | 🔧  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`block-closing-brace-empty-line-before`](../../lib/rules/block-closing-brace-empty-line-before/README.md)<br/>Require or disallow an empty line before the closing brace of blocks.   |     |     | 🔧  |
| [`block-closing-brace-newline-after`](../../lib/rules/block-closing-brace-newline-after/README.md)<br/>Require a newline or disallow whitespace after the closing brace of blocks.     |     |     | 🔧  |
| [`block-closing-brace-newline-before`](../../lib/rules/block-closing-brace-newline-before/README.md)<br/>Require a newline or disallow whitespace before the closing brace of blocks.  |     |     | 🔧  |
| [`block-closing-brace-space-after`](../../lib/rules/block-closing-brace-space-after/README.md)<br/>Require a single space or disallow whitespace after the closing brace of blocks.    |     |     |     |
| [`block-closing-brace-space-before`](../../lib/rules/block-closing-brace-space-before/README.md)<br/>Require a single space or disallow whitespace before the closing brace of blocks. |     |     | 🔧  |
| [`block-opening-brace-newline-after`](../../lib/rules/block-opening-brace-newline-after/README.md)<br/>Require a newline after the opening brace of blocks.                            |     |     | 🔧  |
| [`block-opening-brace-newline-before`](../../lib/rules/block-opening-brace-newline-before/README.md)<br/>Require a newline or disallow whitespace before the opening brace of blocks.  |     |     | 🔧  |
| [`block-opening-brace-space-after`](../../lib/rules/block-opening-brace-space-after/README.md)<br/>Require a single space or disallow whitespace after the opening brace of blocks.    |     |     | 🔧  |
| [`block-opening-brace-space-before`](../../lib/rules/block-opening-brace-space-before/README.md)<br/>Require a single space or disallow whitespace before the opening brace of blocks. |     |     | 🔧  |

### Selector

| Rule                                                                                                                                                                                                                                           | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`selector-attribute-brackets-space-inside`](../../lib/rules/selector-attribute-brackets-space-inside/README.md)<br/>Require a single space or disallow whitespace on the inside of the brackets within attribute selectors.                   |     |     | 🔧  |
| [`selector-attribute-operator-space-after`](../../lib/rules/selector-attribute-operator-space-after/README.md)<br/>Require a single space or disallow whitespace after operators within attribute selectors.                                   |     |     | 🔧  |
| [`selector-attribute-operator-space-before`](../../lib/rules/selector-attribute-operator-space-before/README.md)<br/>Require a single space or disallow whitespace before operators within attribute selectors.                                |     |     | 🔧  |
| [`selector-combinator-space-after`](../../lib/rules/selector-combinator-space-after/README.md)<br/>Require a single space or disallow whitespace after the combinators of selectors.                                                           |     |     | 🔧  |
| [`selector-combinator-space-before`](../../lib/rules/selector-combinator-space-before/README.md)<br/>Require a single space or disallow whitespace before the combinators of selectors.                                                        |     |     | 🔧  |
| [`selector-descendant-combinator-no-non-space`](../../lib/rules/selector-descendant-combinator-no-non-space/README.md)<br/>Disallow non-space characters for descendant combinators of selectors.                                              |     |     | 🔧  |
| [`selector-max-empty-lines`](../../lib/rules/selector-max-empty-lines/README.md)<br/>Limit the number of adjacent empty lines within selectors.                                                                                                |     |     | 🔧  |
| [`selector-pseudo-class-case`](../../lib/rules/selector-pseudo-class-case/README.md)<br/>Specify lowercase or uppercase for pseudo-class selectors.                                                                                            |     |     | 🔧  |
| [`selector-pseudo-class-parentheses-space-inside`](../../lib/rules/selector-pseudo-class-parentheses-space-inside/README.md)<br/>Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors. |     |     | 🔧  |
| [`selector-pseudo-element-case`](../../lib/rules/selector-pseudo-element-case/README.md)<br/>Specify lowercase or uppercase for pseudo-element selectors.                                                                                      |     |     | 🔧  |

### Selector list

| Rule                                                                                                                                                                                    | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`selector-list-comma-newline-after`](../../lib/rules/selector-list-comma-newline-after/README.md)<br/>Require a newline or disallow whitespace after the commas of selector lists.     |     |     | 🔧  |
| [`selector-list-comma-newline-before`](../../lib/rules/selector-list-comma-newline-before/README.md)<br/>Require a newline or disallow whitespace before the commas of selector lists.  |     |     | 🔧  |
| [`selector-list-comma-space-after`](../../lib/rules/selector-list-comma-space-after/README.md)<br/>Require a single space or disallow whitespace after the commas of selector lists.    |     |     | 🔧  |
| [`selector-list-comma-space-before`](../../lib/rules/selector-list-comma-space-before/README.md)<br/>Require a single space or disallow whitespace before the commas of selector lists. |     |     | 🔧  |

### Media feature

| Rule                                                                                                                                                                                                                   | ⭐️ | 💅  | 🔧  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`media-feature-colon-space-after`](../../lib/rules/media-feature-colon-space-after/README.md)<br/>Require a single space or disallow whitespace after the colon in media features.                                    |     |     | 🔧  |
| [`media-feature-colon-space-before`](../../lib/rules/media-feature-colon-space-before/README.md)<br/>Require a single space or disallow whitespace before the colon in media features.                                 |     |     | 🔧  |
| [`media-feature-name-case`](../../lib/rules/media-feature-name-case/README.md)<br/>Specify lowercase or uppercase for media feature names.                                                                             |     |     | 🔧  |
| [`media-feature-parentheses-space-inside`](../../lib/rules/media-feature-parentheses-space-inside/README.md)<br/>Require a single space or disallow whitespace on the inside of the parentheses within media features. |     |     | 🔧  |
| [`media-feature-range-operator-space-after`](../../lib/rules/media-feature-range-operator-space-after/README.md)<br/>Require a single space or disallow whitespace after the range operator in media features.         |     |     | 🔧  |
| [`media-feature-range-operator-space-before`](../../lib/rules/media-feature-range-operator-space-before/README.md)<br/>Require a single space or disallow whitespace before the range operator in media features.      |     |     | 🔧  |

### Media query list

| Rule                                                                                                                                                                                             | ⭐️ | 💅  | 🔧  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | :-: | :-: |
| [`media-query-list-comma-newline-after`](../../lib/rules/media-query-list-comma-newline-after/README.md)<br/>Require a newline or disallow whitespace after the commas of media query lists.     |     |     | 🔧  |
| [`media-query-list-comma-newline-before`](../../lib/rules/media-query-list-comma-newline-before/README.md)<br/>Require a newline or disallow whitespace before the commas of media query lists.  |     |     |     |
| [`media-query-list-comma-space-after`](../../lib/rules/media-query-list-comma-space-after/README.md)<br/>Require a single space or disallow whitespace after the commas of media query lists.    |     |     | 🔧  |
| [`media-query-list-comma-space-before`](../../lib/rules/media-query-list-comma-space-before/README.md)<br/>Require a single space or disallow whitespace before the commas of media query lists. |     |     | 🔧  |

### At-rule

| Rule                                                                                                                                                                              | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`at-rule-name-case`](../../lib/rules/at-rule-name-case/README.md)<br/>Specify lowercase or uppercase for at-rules names.                                                         |     |     | 🔧  |
| [`at-rule-name-newline-after`](../../lib/rules/at-rule-name-newline-after/README.md)<br/>Require a newline after at-rule names.                                                   |     |     |     |
| [`at-rule-name-space-after`](../../lib/rules/at-rule-name-space-after/README.md)<br/>Require a single space after at-rule names.                                                  |     |     | 🔧  |
| [`at-rule-semicolon-newline-after`](../../lib/rules/at-rule-semicolon-newline-after/README.md)<br/>Require a newline after the semicolon of at-rules.                             |     |     | 🔧  |
| [`at-rule-semicolon-space-before`](../../lib/rules/at-rule-semicolon-space-before/README.md)<br/>Require a single space or disallow whitespace before the semicolons of at-rules. |     |     |     |

### General / Sheet

| Rule                                                                                                                                          | ⭐️ | 💅  | 🔧  |
| --------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: | :-: |
| [`indentation`](../../lib/rules/indentation/README.md)<br/>Specify indentation.                                                               |     |     | 🔧  |
| [`linebreaks`](../../lib/rules/linebreaks/README.md)<br/>Specify unix or windows linebreaks.                                                  |     |     | 🔧  |
| [`max-empty-lines`](../../lib/rules/max-empty-lines/README.md)<br/>Limit the number of adjacent empty lines.                                  |     |     | 🔧  |
| [`max-line-length`](../../lib/rules/max-line-length/README.md)<br/>Limit the length of a line.                                                |     |     |     |
| [`no-empty-first-line`](../../lib/rules/no-empty-first-line/README.md)<br/>Disallow empty first lines.                                        |     |     | 🔧  |
| [`no-eol-whitespace`](../../lib/rules/no-eol-whitespace/README.md)<br/>Disallow end-of-line whitespace.                                       |     |     | 🔧  |
| [`no-extra-semicolons`](../../lib/rules/no-extra-semicolons/README.md)<br/>Disallow extra semicolons.                                         |     |     | 🔧  |
| [`no-missing-end-of-source-newline`](../../lib/rules/no-missing-end-of-source-newline/README.md)<br/>Disallow missing end-of-source newlines. |     |     | 🔧  |
| [`unicode-bom`](../../lib/rules/unicode-bom/README.md)<br/>Require or disallow Unicode BOM.                                                   |     |     |     |
