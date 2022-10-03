# Rules

The built-in rules:

- apply to standard CSS syntax only
- are generally useful; not tied to idiosyncratic patterns
- have a clear and unambiguous finished state
- have a singular purpose; don't overlap with other rules

They help you:

- [avoid errors](#avoid-errors)
- [enforce non-stylistic conventions](#enforce-non-stylistic-conventions)
- [enforce stylistic conventions](#enforce-stylistic-conventions) (frozen)

We split rule names into two parts:

- the [_thing_](http://apps.workflower.fi/vocabs/css/en) the rule applies to
- what the rule is checking

If there is no first part, then the rule applies to the whole source.

```
shorthand-property-no-redundant-values
↑                  ↑
the thing          what the rule is checking

no-duplicate-selectors
↑
what the rule is checking (no first part)
```

## Avoid errors

You can avoid errors with these `no-*` rules.

### Duplicate

Disallow duplicates with these `*-no-duplicate` rules.

- [`declaration-block-no-duplicate-custom-properties`](../../lib/rules/declaration-block-no-duplicate-custom-properties/README.md): Disallow duplicate custom properties within declaration blocks.
- [`declaration-block-no-duplicate-properties`](../../lib/rules/declaration-block-no-duplicate-properties/README.md): Disallow duplicate properties within declaration blocks (Autofixable).
- [`font-family-no-duplicate-names`](../../lib/rules/font-family-no-duplicate-names/README.md): Disallow duplicate names within font families.
- [`keyframe-block-no-duplicate-selectors`](../../lib/rules/keyframe-block-no-duplicate-selectors/README.md): Disallow duplicate selectors within keyframe blocks.
- [`no-duplicate-at-import-rules`](../../lib/rules/no-duplicate-at-import-rules/README.md): Disallow duplicate `@import` rules.
- [`no-duplicate-selectors`](../../lib/rules/no-duplicate-selectors/README.md): Disallow duplicate selectors.

### Descending

Disallow descending things with these `*-no-descending` rules.

- [`no-descending-specificity`](../../lib/rules/no-descending-specificity/README.md): Disallow selectors of lower specificity from coming after overriding selectors of higher specificity.

### Empty

Disallow empty things with these `*-no-empty` rules.

- [`block-no-empty`](../../lib/rules/block-no-empty/README.md): Disallow empty blocks.
- [`comment-no-empty`](../../lib/rules/comment-no-empty/README.md): Disallow empty comments.
- [`no-empty-source`](../../lib/rules/no-empty-source/README.md): Disallow empty sources.

### Irregular

Disallow irregular things with these `*-no-irregular` rules.

- [`no-irregular-whitespace`](../../lib/rules/no-irregular-whitespace/README.md): Disallow irregular whitespace.

### Invalid

Disallow invalid syntax with these (sometimes implicit) `no-invalid` rules.

- [`color-no-invalid-hex`](../../lib/rules/color-no-invalid-hex/README.md): Disallow invalid hex colors.
- [`function-calc-no-unspaced-operator`](../../lib/rules/function-calc-no-unspaced-operator/README.md): Disallow invalid unspaced operator within `calc` functions (Autofixable).
- [`keyframe-declaration-no-important`](../../lib/rules/keyframe-declaration-no-important/README.md): Disallow invalid `!important` within keyframe declarations.
- [`named-grid-areas-no-invalid`](../../lib/rules/named-grid-areas-no-invalid/README.md): Disallow invalid named grid areas.
- [`no-invalid-double-slash-comments`](../../lib/rules/no-invalid-double-slash-comments/README.md): Disallow invalid double-slash comments.
- [`no-invalid-position-at-import-rule`](../../lib/rules/no-invalid-position-at-import-rule/README.md): Disallow invalid position `@import` rules.
- [`string-no-newline`](../../lib/rules/string-no-newline/README.md): Disallow invalid newlines within strings.

### Missing

Disallow missing things with these `*-no-missing` rules.

- [`custom-property-no-missing-var-function`](../../lib/rules/custom-property-no-missing-var-function/README.md): Disallow missing `var` function for custom properties.
- [`font-family-no-missing-generic-family-keyword`](../../lib/rules/font-family-no-missing-generic-family-keyword/README.md): Disallow missing generic family keyword within font families.

### Nonstandard

Disallow nonstandard things with these `*-no-nonstandard` rules.

- [`function-linear-gradient-no-nonstandard-direction`](../../lib/rules/function-linear-gradient-no-nonstandard-direction/README.md): Disallow non-standard direction values for linerar gradient functions.

### Overrides

Disallow overrides with these `*-no-overrides` rules.

- [`declaration-block-no-shorthand-property-overrides`](../../lib/rules/declaration-block-no-shorthand-property-overrides/README.md): Disallow shorthand properties that override related longhand properties.

### Unknown

Disallow unknown things with these `*-no-unknown` rules.

- [`annotation-no-unknown`](../../lib/rules/annotation-no-unknown/README.md): Disallow unknown annotations.
- [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md): Disallow unknown at-rules.
- [`function-no-unknown`](../../lib/rules/function-no-unknown/README.md): Disallow unknown functions.
- [`media-feature-name-no-unknown`](../../lib/rules/media-feature-name-no-unknown/README.md): Disallow unknown media feature names.
- [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md): Disallow unknown animations.
- [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md): Disallow unknown properties.
- [`selector-pseudo-class-no-unknown`](../../lib/rules/selector-pseudo-class-no-unknown/README.md): Disallow unknown pseudo-class selectors.
- [`selector-pseudo-element-no-unknown`](../../lib/rules/selector-pseudo-element-no-unknown/README.md): Disallow unknown pseudo-element selectors.
- [`selector-type-no-unknown`](../../lib/rules/selector-type-no-unknown/README.md): Disallow unknown type selectors.
- [`unit-no-unknown`](../../lib/rules/unit-no-unknown/README.md): Disallow unknown units.

## Enforce non-stylistic conventions

You can enforce non-stylistic conventions with these `no-*` and `*-list` rules. They are powerful rules for making your CSS consistent. You'll need to configure most of them to suit your needs.

### Allowed, disallowed & required

Allow, disallow or require things with these `*-allowed-list`, `*-disallowed-list`, `*-required-list` and `no-*` rules.

#### At-rule

- [`at-rule-allowed-list`](../../lib/rules/at-rule-allowed-list/README.md): Specify a list of allowed at-rules.
- [`at-rule-disallowed-list`](../../lib/rules/at-rule-disallowed-list/README.md): Specify a list of disallowed at-rules.
- [`at-rule-no-vendor-prefix`](../../lib/rules/at-rule-no-vendor-prefix/README.md): Disallow vendor prefixes for at-rules (Autofixable).
- [`at-rule-property-required-list`](../../lib/rules/at-rule-property-required-list/README.md): Specify a list of required properties for an at-rule.

#### Color

- [`color-hex-alpha`](../../lib/rules/color-hex-alpha/README.md): Require or disallow alpha channel for hex colors.
- [`color-named`](../../lib/rules/color-named/README.md): Require (where possible) or disallow named colors.
- [`color-no-hex`](../../lib/rules/color-no-hex/README.md): Disallow hex colors.

#### Comment

- [`comment-word-disallowed-list`](../../lib/rules/comment-word-disallowed-list/README.md): Specify a list of disallowed words within comments.

#### Declaration

- [`declaration-no-important`](../../lib/rules/declaration-no-important/README.md): Disallow `!important` within declarations.
- [`declaration-property-unit-allowed-list`](../../lib/rules/declaration-property-unit-allowed-list/README.md): Specify a list of allowed property and unit pairs within declarations.
- [`declaration-property-unit-disallowed-list`](../../lib/rules/declaration-property-unit-disallowed-list/README.md): Specify a list of disallowed property and unit pairs within declarations.
- [`declaration-property-value-allowed-list`](../../lib/rules/declaration-property-value-allowed-list/README.md): Specify a list of allowed property and value pairs within declarations.
- [`declaration-property-value-disallowed-list`](../../lib/rules/declaration-property-value-disallowed-list/README.md): Specify a list of disallowed property and value pairs within declarations.

#### Function

- [`function-allowed-list`](../../lib/rules/function-allowed-list/README.md): Specify a list of allowed functions.
- [`function-disallowed-list`](../../lib/rules/function-disallowed-list/README.md): Specify a list of disallowed functions.
- [`function-url-no-scheme-relative`](../../lib/rules/function-url-no-scheme-relative/README.md): Disallow scheme-relative urls.
- [`function-url-scheme-allowed-list`](../../lib/rules/function-url-scheme-allowed-list/README.md): Specify a list of allowed URL schemes.
- [`function-url-scheme-disallowed-list`](../../lib/rules/function-url-scheme-disallowed-list/README.md): Specify a list of disallowed URL schemes.

#### Length

- [`length-zero-no-unit`](../../lib/rules/length-zero-no-unit/README.md): Disallow units for zero lengths (Autofixable).

#### Media feature

- [`media-feature-name-allowed-list`](../../lib/rules/media-feature-name-allowed-list/README.md): Specify a list of allowed media feature names.
- [`media-feature-name-disallowed-list`](../../lib/rules/media-feature-name-disallowed-list/README.md): Specify a list of disallowed media feature names.
- [`media-feature-name-no-vendor-prefix`](../../lib/rules/media-feature-name-no-vendor-prefix/README.md): Disallow vendor prefixes for media feature names (Autofixable).
- [`media-feature-name-value-allowed-list`](../../lib/rules/media-feature-name-value-allowed-list/README.md): Specify a list of allowed media feature name and value pairs.

#### Property

- [`property-allowed-list`](../../lib/rules/property-allowed-list/README.md): Specify a list of allowed properties.
- [`property-disallowed-list`](../../lib/rules/property-disallowed-list/README.md): Specify a list of disallowed properties.
- [`property-no-vendor-prefix`](../../lib/rules/property-no-vendor-prefix/README.md): Disallow vendor prefixes for properties (Autofixable).

#### Rule

- [`rule-selector-property-disallowed-list`](../../lib/rules/rule-selector-property-disallowed-list/README.md): Specify a list of disallowed properties for selectors within rules.

#### Selector

- [`selector-attribute-name-disallowed-list`](../../lib/rules/selector-attribute-name-disallowed-list/README.md): Specify a list of disallowed attribute names.
- [`selector-attribute-operator-allowed-list`](../../lib/rules/selector-attribute-operator-allowed-list/README.md): Specify a list of allowed attribute operators.
- [`selector-attribute-operator-disallowed-list`](../../lib/rules/selector-attribute-operator-disallowed-list/README.md): Specify a list of disallowed attribute operators.
- [`selector-combinator-allowed-list`](../../lib/rules/selector-combinator-allowed-list/README.md): Specify a list of allowed combinators.
- [`selector-combinator-disallowed-list`](../../lib/rules/selector-combinator-disallowed-list/README.md): Specify a list of disallowed combinators.
- [`selector-disallowed-list`](../../lib/rules/selector-disallowed-list/README.md): Specify a list of disallowed selectors.
- [`selector-no-qualifying-type`](../../lib/rules/selector-no-qualifying-type/README.md): Disallow qualifying a selector by type.
- [`selector-no-vendor-prefix`](../../lib/rules/selector-no-vendor-prefix/README.md): Disallow vendor prefixes for selectors (Autofixable).
- [`selector-pseudo-class-allowed-list`](../../lib/rules/selector-pseudo-class-allowed-list/README.md): Specify a list of allowed pseudo-class selectors.
- [`selector-pseudo-class-disallowed-list`](../../lib/rules/selector-pseudo-class-disallowed-list/README.md): Specify a list of disallowed pseudo-class selectors.
- [`selector-pseudo-element-allowed-list`](../../lib/rules/selector-pseudo-element-allowed-list/README.md): Specify a list of allowed pseudo-element selectors.
- [`selector-pseudo-element-disallowed-list`](../../lib/rules/selector-pseudo-element-disallowed-list/README.md): Specify a list of disallowed pseudo-element selectors.

#### Unit

- [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md): Specify a list of allowed units.
- [`unit-disallowed-list`](../../lib/rules/unit-disallowed-list/README.md): Specify a list of disallowed units.

#### Value

- [`value-no-vendor-prefix`](../../lib/rules/value-no-vendor-prefix/README.md): Disallow vendor prefixes for values (Autofixable).

### Max & min

Apply limits with these `max-*` and `min-*` rules.

- [`declaration-block-single-line-max-declarations`](../../lib/rules/declaration-block-single-line-max-declarations/README.md): Limit the number of declarations within a single-line declaration block.
- [`declaration-property-max-values`](../../lib/rules/declaration-property-max-values/README.md): Limit the number of values for a list of properties within declarations.
- [`max-nesting-depth`](../../lib/rules/max-nesting-depth/README.md): Limit the depth of nesting.
- [`number-max-precision`](../../lib/rules/number-max-precision/README.md): Limit the number of decimal places allowed in numbers.
- [`selector-max-attribute`](../../lib/rules/selector-max-attribute/README.md): Limit the number of attribute selectors in a selector.
- [`selector-max-class`](../../lib/rules/selector-max-class/README.md): Limit the number of classes in a selector.
- [`selector-max-combinators`](../../lib/rules/selector-max-combinators/README.md): Limit the number of combinators in a selector.
- [`selector-max-compound-selectors`](../../lib/rules/selector-max-compound-selectors/README.md): Limit the number of compound selectors in a selector.
- [`selector-max-id`](../../lib/rules/selector-max-id/README.md): Limit the number of ID selectors in a selector.
- [`selector-max-pseudo-class`](../../lib/rules/selector-max-pseudo-class/README.md): Limit the number of pseudo-classes in a selector.
- [`selector-max-specificity`](../../lib/rules/selector-max-specificity/README.md): Limit the specificity of selectors.
- [`selector-max-type`](../../lib/rules/selector-max-type/README.md): Limit the number of type selectors in a selector.
- [`selector-max-universal`](../../lib/rules/selector-max-universal/README.md): Limit the number of universal selectors in a selector.
- [`time-min-milliseconds`](../../lib/rules/time-min-milliseconds/README.md): Limit the minimum number of milliseconds for time values.

### Notation

Enforce one representation of things that have multiple with these `*-notation` (sometimes implicit) rules.

- [`alpha-value-notation`](../../lib/rules/alpha-value-notation/README.md): Specify percentage or number notation for alpha-values (Autofixable).
- [`color-function-notation`](../../lib/rules/color-function-notation/README.md): Specify modern or legacy notation for color-functions (Autofixable).
- [`color-hex-length`](../../lib/rules/color-hex-length/README.md): Specify short or long notation for hex colors (Autofixable).
- [`font-weight-notation`](../../lib/rules/font-weight-notation/README.md): Specify numeric or named notation for font weights (Autofixable).
- [`hue-degree-notation`](../../lib/rules/hue-degree-notation/README.md): Specify number or angle notation for degree hues (Autofixable).
- [`import-notation`](../../lib/rules/import-notation/README.md): Specify string or URL notation for `@import` rules (Autofixable).
- [`keyframe-selector-notation`](../../lib/rules/keyframe-selector-notation/README.md): Specify keyword or percentage notation for keyframe selectors (Autofixable).
- [`selector-not-notation`](../../lib/rules/selector-not-notation/README.md): Specify simple or complex notation for `:not()` pseudo-class selectors (Autofixable).
- [`selector-pseudo-element-colon-notation`](../../lib/rules/selector-pseudo-element-colon-notation/README.md): Specify single or double colon notation for applicable pseudo-element selectors (Autofixable).

### Pattern

Enforce naming conventions with these `*-pattern` rules.

- [`comment-pattern`](../../lib/rules/comment-pattern/README.md): Specify a pattern for comments.
- [`custom-media-pattern`](../../lib/rules/custom-media-pattern/README.md): Specify a pattern for custom media query names.
- [`custom-property-pattern`](../../lib/rules/custom-property-pattern/README.md): Specify a pattern for custom properties.
- [`keyframes-name-pattern`](../../lib/rules/keyframes-name-pattern/README.md): Specify a pattern for keyframe names.
- [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md): Specify a pattern for class selectors.
- [`selector-id-pattern`](../../lib/rules/selector-id-pattern/README.md): Specify a pattern for ID selectors.
- [`selector-nested-pattern`](../../lib/rules/selector-nested-pattern/README.md): Specify a pattern for the selectors of rules nested within rules.

### Quotes

Require or disallow quotes with these `*-quotes` rules

- [`font-family-name-quotes`](../../lib/rules/font-family-name-quotes/README.md): Require or disallow quotes for font family names (Autofixable).
- [`function-url-quotes`](../../lib/rules/function-url-quotes/README.md): Require or disallow quotes for urls.
- [`selector-attribute-quotes`](../../lib/rules/selector-attribute-quotes/README.md): Require or disallow quotes for attribute values (Autofixable).

### Redundant

Disallow redundancy with these `no-redundant-*` rules.

- [`declaration-block-no-redundant-longhand-properties`](../../lib/rules/declaration-block-no-redundant-longhand-properties/README.md): Disallow redundant longhand properties within declaration-block.
- [`shorthand-property-no-redundant-values`](../../lib/rules/shorthand-property-no-redundant-values/README.md): Disallow redundant values within shorthand properties (Autofixable).

## Enforce stylistic conventions

We have frozen these rules — we won't fix bugs nor add options, and we will deprecate then remove them in future releases. We recommend you use a pretty printer (like Prettier) alongside Stylelint rather than these rules. If you prefer to use Stylelint to enforce stylistic consistency, you can [migrate the rules you need to a plugin](../developer-guide/plugins.md).

The whitespace rules allow you to enforce an empty line, a single space, a newline or no space in some specific part of the stylesheet.

The whitespace rules combine two sets of keywords:

- `before`, `after` and `inside` to specify where the whitespace (if any) is expected
- `empty-line`, `space` and `newline` to specify whether a single empty line, a single space, a single newline or no space is expected there

For example, specifying if a single empty line or no space must come before all the comments in a stylesheet:

- `comment-empty-line-before`: `string` - `"always"|"never"`

<!-- prettier-ignore -->
```css
a {}
              ←
/* comment */ ↑
              ↑
/**           ↑
 * This empty line  */
```

Additionally, some whitespace rules use an additional set of keywords:

- `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` or `range-operator` are used if a specific piece of punctuation in the _thing_ is being targeted

For example, specifying if a single space or no space must follow a comma in a function:

- `function-comma-space-after`: `string` - `"always"|"never"`

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1) }
/**                       ↑
 * The space after this commas */
```

The plural of the punctuation is used for `inside` rules. For example, specifying if a single space or no space must be inside the parentheses of a function:

- `function-parentheses-space-inside`: `string` - `"always"|"never"`

<!-- prettier-ignore -->
```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 * The space inside these two parentheses */
```

### Not handled by pretty printers

#### Value

- [`value-keyword-case`](../../lib/rules/value-keyword-case/README.md): Specify lowercase or uppercase for keywords values (Autofixable).

#### Function

- [`function-name-case`](../../lib/rules/function-name-case/README.md): Specify lowercase or uppercase for function names (Autofixable).

#### Custom property

- [`custom-property-empty-line-before`](../../lib/rules/custom-property-empty-line-before/README.md): Require or disallow an empty line before custom properties (Autofixable).

#### Selector

- [`selector-type-case`](../../lib/rules/selector-type-case/README.md): Specify lowercase or uppercase for type selectors (Autofixable).

#### Rule

- [`rule-empty-line-before`](../../lib/rules/rule-empty-line-before/README.md): Require or disallow an empty line before rules (Autofixable).

#### At-rule

- [`at-rule-empty-line-before`](../../lib/rules/at-rule-empty-line-before/README.md): Require or disallow an empty line before at-rules (Autofixable).

#### Comment

- [`comment-empty-line-before`](../../lib/rules/comment-empty-line-before/README.md): Require or disallow an empty line before comments (Autofixable).
- [`comment-whitespace-inside`](../../lib/rules/comment-whitespace-inside/README.md): Require or disallow whitespace on the inside of comment markers (Autofixable).

### Handled by pretty printers

#### Color

- [`color-hex-case`](../../lib/rules/color-hex-case/README.md): Specify lowercase or uppercase for hex colors (Autofixable).

#### Function

- [`function-comma-newline-after`](../../lib/rules/function-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of functions (Autofixable).
- [`function-comma-newline-before`](../../lib/rules/function-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of functions (Autofixable).
- [`function-comma-space-after`](../../lib/rules/function-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of functions (Autofixable).
- [`function-comma-space-before`](../../lib/rules/function-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of functions (Autofixable).
- [`function-max-empty-lines`](../../lib/rules/function-max-empty-lines/README.md): Limit the number of adjacent empty lines within functions (Autofixable).
- [`function-parentheses-newline-inside`](../../lib/rules/function-parentheses-newline-inside/README.md): Require a newline or disallow whitespace on the inside of the parentheses of functions (Autofixable).
- [`function-parentheses-space-inside`](../../lib/rules/function-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses of functions (Autofixable).
- [`function-whitespace-after`](../../lib/rules/function-whitespace-after/README.md): Require or disallow whitespace after functions (Autofixable).

#### Number

- [`number-leading-zero`](../../lib/rules/number-leading-zero/README.md): Require or disallow a leading zero for fractional numbers less than 1 (Autofixable).
- [`number-no-trailing-zeros`](../../lib/rules/number-no-trailing-zeros/README.md): Disallow trailing zeros in numbers (Autofixable).

#### String

- [`string-quotes`](../../lib/rules/string-quotes/README.md): Specify single or double quotes around strings (Autofixable).

#### Unit

- [`unit-case`](../../lib/rules/unit-case/README.md): Specify lowercase or uppercase for units (Autofixable).

#### Value list

- [`value-list-comma-newline-after`](../../lib/rules/value-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of value lists (Autofixable).
- [`value-list-comma-newline-before`](../../lib/rules/value-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of value lists.
- [`value-list-comma-space-after`](../../lib/rules/value-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of value lists (Autofixable).
- [`value-list-comma-space-before`](../../lib/rules/value-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of value lists (Autofixable).
- [`value-list-max-empty-lines`](../../lib/rules/value-list-max-empty-lines/README.md): Limit the number of adjacent empty lines within value lists (Autofixable).

#### Property

- [`property-case`](../../lib/rules/property-case/README.md): Specify lowercase or uppercase for properties (Autofixable).

#### Declaration

- [`declaration-bang-space-after`](../../lib/rules/declaration-bang-space-after/README.md): Require a single space or disallow whitespace after the bang of declarations (Autofixable).
- [`declaration-bang-space-before`](../../lib/rules/declaration-bang-space-before/README.md): Require a single space or disallow whitespace before the bang of declarations (Autofixable).
- [`declaration-colon-newline-after`](../../lib/rules/declaration-colon-newline-after/README.md): Require a newline or disallow whitespace after the colon of declarations (Autofixable).
- [`declaration-colon-space-after`](../../lib/rules/declaration-colon-space-after/README.md): Require a single space or disallow whitespace after the colon of declarations (Autofixable).
- [`declaration-colon-space-before`](../../lib/rules/declaration-colon-space-before/README.md): Require a single space or disallow whitespace before the colon of declarations (Autofixable).
- [`declaration-empty-line-before`](../../lib/rules/declaration-empty-line-before/README.md): Require or disallow an empty line before declarations (Autofixable).

#### Declaration block

- [`declaration-block-semicolon-newline-after`](../../lib/rules/declaration-block-semicolon-newline-after/README.md): Require a newline or disallow whitespace after the semicolons of declaration blocks (Autofixable).
- [`declaration-block-semicolon-newline-before`](../../lib/rules/declaration-block-semicolon-newline-before/README.md): Require a newline or disallow whitespace before the semicolons of declaration blocks.
- [`declaration-block-semicolon-space-after`](../../lib/rules/declaration-block-semicolon-space-after/README.md): Require a single space or disallow whitespace after the semicolons of declaration blocks (Autofixable).
- [`declaration-block-semicolon-space-before`](../../lib/rules/declaration-block-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of declaration blocks (Autofixable).
- [`declaration-block-trailing-semicolon`](../../lib/rules/declaration-block-trailing-semicolon/README.md): Require or disallow a trailing semicolon within declaration blocks (Autofixable).

#### Block

- [`block-closing-brace-empty-line-before`](../../lib/rules/block-closing-brace-empty-line-before/README.md): Require or disallow an empty line before the closing brace of blocks (Autofixable).
- [`block-closing-brace-newline-after`](../../lib/rules/block-closing-brace-newline-after/README.md): Require a newline or disallow whitespace after the closing brace of blocks (Autofixable).
- [`block-closing-brace-newline-before`](../../lib/rules/block-closing-brace-newline-before/README.md): Require a newline or disallow whitespace before the closing brace of blocks (Autofixable).
- [`block-closing-brace-space-after`](../../lib/rules/block-closing-brace-space-after/README.md): Require a single space or disallow whitespace after the closing brace of blocks.
- [`block-closing-brace-space-before`](../../lib/rules/block-closing-brace-space-before/README.md): Require a single space or disallow whitespace before the closing brace of blocks (Autofixable).
- [`block-opening-brace-newline-after`](../../lib/rules/block-opening-brace-newline-after/README.md): Require a newline after the opening brace of blocks (Autofixable).
- [`block-opening-brace-newline-before`](../../lib/rules/block-opening-brace-newline-before/README.md): Require a newline or disallow whitespace before the opening brace of blocks (Autofixable).
- [`block-opening-brace-space-after`](../../lib/rules/block-opening-brace-space-after/README.md): Require a single space or disallow whitespace after the opening brace of blocks (Autofixable).
- [`block-opening-brace-space-before`](../../lib/rules/block-opening-brace-space-before/README.md): Require a single space or disallow whitespace before the opening brace of blocks (Autofixable).

#### Selector

- [`selector-attribute-brackets-space-inside`](../../lib/rules/selector-attribute-brackets-space-inside/README.md): Require a single space or disallow whitespace on the inside of the brackets within attribute selectors (Autofixable).
- [`selector-attribute-operator-space-after`](../../lib/rules/selector-attribute-operator-space-after/README.md): Require a single space or disallow whitespace after operators within attribute selectors (Autofixable).
- [`selector-attribute-operator-space-before`](../../lib/rules/selector-attribute-operator-space-before/README.md): Require a single space or disallow whitespace before operators within attribute selectors (Autofixable).
- [`selector-combinator-space-after`](../../lib/rules/selector-combinator-space-after/README.md): Require a single space or disallow whitespace after the combinators of selectors (Autofixable).
- [`selector-combinator-space-before`](../../lib/rules/selector-combinator-space-before/README.md): Require a single space or disallow whitespace before the combinators of selectors (Autofixable).
- [`selector-descendant-combinator-no-non-space`](../../lib/rules/selector-descendant-combinator-no-non-space/README.md): Disallow non-space characters for descendant combinators of selectors (Autofixable).
- [`selector-max-empty-lines`](../../lib/rules/selector-max-empty-lines/README.md): Limit the number of adjacent empty lines within selectors (Autofixable).
- [`selector-pseudo-class-case`](../../lib/rules/selector-pseudo-class-case/README.md): Specify lowercase or uppercase for pseudo-class selectors (Autofixable).
- [`selector-pseudo-class-parentheses-space-inside`](../../lib/rules/selector-pseudo-class-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors (Autofixable).
- [`selector-pseudo-element-case`](../../lib/rules/selector-pseudo-element-case/README.md): Specify lowercase or uppercase for pseudo-element selectors (Autofixable).

#### Selector list

- [`selector-list-comma-newline-after`](../../lib/rules/selector-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of selector lists (Autofixable).
- [`selector-list-comma-newline-before`](../../lib/rules/selector-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of selector lists (Autofixable).
- [`selector-list-comma-space-after`](../../lib/rules/selector-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of selector lists (Autofixable).
- [`selector-list-comma-space-before`](../../lib/rules/selector-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of selector lists (Autofixable).

#### Media feature

- [`media-feature-colon-space-after`](../../lib/rules/media-feature-colon-space-after/README.md): Require a single space or disallow whitespace after the colon in media features (Autofixable).
- [`media-feature-colon-space-before`](../../lib/rules/media-feature-colon-space-before/README.md): Require a single space or disallow whitespace before the colon in media features (Autofixable).
- [`media-feature-name-case`](../../lib/rules/media-feature-name-case/README.md): Specify lowercase or uppercase for media feature names (Autofixable).
- [`media-feature-parentheses-space-inside`](../../lib/rules/media-feature-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within media features (Autofixable).
- [`media-feature-range-operator-space-after`](../../lib/rules/media-feature-range-operator-space-after/README.md): Require a single space or disallow whitespace after the range operator in media features (Autofixable).
- [`media-feature-range-operator-space-before`](../../lib/rules/media-feature-range-operator-space-before/README.md): Require a single space or disallow whitespace before the range operator in media features (Autofixable).

#### Media query list

- [`media-query-list-comma-newline-after`](../../lib/rules/media-query-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of media query lists (Autofixable).
- [`media-query-list-comma-newline-before`](../../lib/rules/media-query-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of media query lists.
- [`media-query-list-comma-space-after`](../../lib/rules/media-query-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of media query lists (Autofixable).
- [`media-query-list-comma-space-before`](../../lib/rules/media-query-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of media query lists (Autofixable).

#### At-rule

- [`at-rule-name-case`](../../lib/rules/at-rule-name-case/README.md): Specify lowercase or uppercase for at-rules names (Autofixable).
- [`at-rule-name-newline-after`](../../lib/rules/at-rule-name-newline-after/README.md): Require a newline after at-rule names.
- [`at-rule-name-space-after`](../../lib/rules/at-rule-name-space-after/README.md): Require a single space after at-rule names (Autofixable).
- [`at-rule-semicolon-newline-after`](../../lib/rules/at-rule-semicolon-newline-after/README.md): Require a newline after the semicolon of at-rules (Autofixable).
- [`at-rule-semicolon-space-before`](../../lib/rules/at-rule-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of at-rules.

#### General / Sheet

- [`indentation`](../../lib/rules/indentation/README.md): Specify indentation (Autofixable).
- [`linebreaks`](../../lib/rules/linebreaks/README.md): Specify unix or windows linebreaks (Autofixable).
- [`max-empty-lines`](../../lib/rules/max-empty-lines/README.md): Limit the number of adjacent empty lines (Autofixable).
- [`max-line-length`](../../lib/rules/max-line-length/README.md): Limit the length of a line.
- [`no-empty-first-line`](../../lib/rules/no-empty-first-line/README.md): Disallow empty first lines (Autofixable).
- [`no-eol-whitespace`](../../lib/rules/no-eol-whitespace/README.md): Disallow end-of-line whitespace (Autofixable).
- [`no-extra-semicolons`](../../lib/rules/no-extra-semicolons/README.md): Disallow extra semicolons (Autofixable).
- [`no-missing-end-of-source-newline`](../../lib/rules/no-missing-end-of-source-newline/README.md): Disallow missing end-of-source newlines (Autofixable).
- [`unicode-bom`](../../lib/rules/unicode-bom/README.md): Require or disallow Unicode BOM.
