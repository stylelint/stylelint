# Rules

Every rule is standalone and turned off by default. None of the rules have default values for their options.

## List of rules

Here are all the rules within stylelint, grouped by the [_thing_](http://apps.workflower.fi/vocabs/css/en) they apply to.

### String

* [`string-quotes`](../../src/rules/string-quotes/README.md): Specify single or double quotes around strings.

### Color

* [`color-hex-case`](../../src/rules/color-hex-case/README.md): Specify lowercase or uppercase for hex colors.
* [`color-hex-length`](../../src/rules/color-hex-length/README.md): Specify short or long notation for hex colors.
* [`color-no-hex`](../../src/rules/color-no-hex/README.md): Disallow hex colors.
* [`color-no-invalid-hex`](../../src/rules/color-no-invalid-hex/README.md): Disallow invalid hex colors.
* [`color-no-named`](../../src/rules/color-no-named/README.md): Disallow named colors.

### Number

* [`number-leading-zero`](../../src/rules/number-leading-zero/README.md): Require or disallow a leading zero for fractional numbers less than 1.
* [`number-max-precision`](../../src/rules/number-max-precision/README.md): Limit the number of decimal places allowed in numbers.
* [`number-no-trailing-zeros`](../../src/rules/number-no-trailing-zeros/README.md): Disallow trailing zeros within numbers.
* [`number-zero-length-no-unit`](../../src/rules/number-zero-length-no-unit/README.md): Disallow units for zero lengths.

### Function

* [`function-blacklist`](../../src/rules/function-blacklist/README.md): Specify a blacklist of disallowed functions.
* [`function-calc-no-unspaced-operator`](../../src/rules/function-calc-no-unspaced-operator/README.md): Disallow an unspaced operator within `calc` functions.
* [`function-comma-newline-after`](../../src/rules/function-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of functions.
* [`function-comma-newline-before`](../../src/rules/function-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of functions.
* [`function-comma-space-after`](../../src/rules/function-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of functions.
* [`function-comma-space-before`](../../src/rules/function-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of functions.
* [`function-linear-gradient-no-nonstandard-direction`](../../src/rules/function-linear-gradient-no-nonstandard-direction/README.md): Disallow direction values in `linear-gradient()` calls that are not valid according to the
[standard syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#Syntax).
* [`function-parentheses-newline-inside`](../../src/rules/function-parentheses-newline-inside/README.md): Require a newline or disallow whitespace on the inside of the parentheses of functions.
* [`function-parentheses-space-inside`](../../src/rules/function-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses of functions.
* [`function-space-after`](../../src/rules/function-space-after/README.md): Require a single space or disallow whitespace after functions.
* [`function-url-quotes`](../../src/rules/function-url-quotes/README.md): Specify single, double or no quotes for urls.
* [`function-whitelist`](../../src/rules/function-whitelist/README.md): Specify a whitelist of only allowed functions.

### Value

* [`value-no-vendor-prefix`](../../src/rules/value-no-vendor-prefix/README.md): Disallow vendor prefixes for values.

### Value list

* [`value-list-comma-newline-after`](../../src/rules/value-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of value lists.
* [`value-list-comma-newline-before`](../../src/rules/value-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of value lists.
* [`value-list-comma-space-after`](../../src/rules/value-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of value lists.
* [`value-list-comma-space-before`](../../src/rules/value-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of value lists.

### Unit

* [`unit-blacklist`](../../src/rules/unit-blacklist/README.md): Specify a blacklist of disallowed units.
* [`unit-whitelist`](../../src/rules/unit-whitelist/README.md): Specify a whitelist of allowed units.

### Property

* [`property-blacklist`](../../src/rules/property-blacklist/README.md): Specify a blacklist of disallowed properties.
* [`property-no-vendor-prefix`](../../src/rules/property-no-vendor-prefix/README.md): Disallow vendor prefixes for properties.
* [`property-unit-blacklist`](../../src/rules/property-unit-blacklist/README.md): Specify a blacklist of disallowed units for specfic properties.
* [`property-unit-whitelist`](../../src/rules/property-unit-whitelist/README.md): Specify a whitelist of disallowed units for specfic properties.
* [`property-whitelist`](../../src/rules/property-whitelist/README.md): Specify a whitelist of allowed properties.

### Custom property

* [`custom-property-no-outside-root`](../../src/rules/custom-property-no-outside-root/README.md): Disallow custom properties outside of `:root` selectors.
* [`custom-property-pattern`](../../src/rules/custom-property-pattern/README.md): Specify pattern of custom properties.

### Declaration

* [`declaration-bang-space-after`](../../src/rules/declaration-bang-space-after/README.md): Require a single space or disallow whitespace after the bang of declarations.
* [`declaration-bang-space-before`](../../src/rules/declaration-bang-space-before/README.md): Require a single space or disallow whitespace before the bang of declarations.
* [`declaration-colon-newline-after`](../../src/rules/declaration-colon-newline-after/README.md): Require a newline or disallow whitespace after the colon of declarations.
* [`declaration-colon-space-after`](../../src/rules/declaration-colon-space-after/README.md): Require a single space or disallow whitespace after the colon of declarations.
* [`declaration-colon-space-before`](../../src/rules/declaration-colon-space-before/README.md): Require a single space or disallow whitespace before the colon of declarations.
* [`declaration-no-important`](../../src/rules/declaration-no-important/README.md): Disallow `!important` within declarations.

### Declaration block

* [`declaration-block-semicolon-newline-after`](../../src/rules/declaration-block-semicolon-newline-after/README.md): Require a newline or disallow whitespace after the semicolons of declaration blocks.
* [`declaration-block-semicolon-newline-before`](../../src/rules/declaration-block-semicolon-newline-before/README.md): Require a newline or disallow whitespace before the semicolons of declaration blocks.
* [`declaration-block-semicolon-space-after`](../../src/rules/declaration-block-semicolon-space-after/README.md): Require a single space or disallow whitespace after the semicolons of declaration blocks.
* [`declaration-block-semicolon-space-before`](../../src/rules/declaration-block-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of declaration blocks.

### Block

* [`block-closing-brace-newline-after`](../../src/rules/block-closing-brace-newline-after/README.md): Require a newline or disallow whitespace after the closing brace of blocks.
* [`block-closing-brace-newline-before`](../../src/rules/block-closing-brace-newline-before/README.md): Require a newline or disallow whitespace before the closing brace of blocks.
* [`block-closing-brace-space-after`](../../src/rules/block-closing-brace-space-after/README.md): Require a single space or disallow whitespace after the closing brace of blocks.
* [`block-closing-brace-space-before`](../../src/rules/block-closing-brace-space-before/README.md): Require a single space or disallow whitespace before the closing brace of blocks.
* [`block-no-empty`](../../src/rules/block-no-empty/README.md): Disallow empty blocks.
* [`block-opening-brace-newline-after`](../../src/rules/block-opening-brace-newline-after/README.md): Require a newline after the opening brace of blocks.
* [`block-opening-brace-newline-before`](../../src/rules/block-opening-brace-newline-before/README.md): Require a newline or disallow whitespace before the opening brace of blocks.
* [`block-opening-brace-space-after`](../../src/rules/block-opening-brace-space-after/README.md): Require a single space or disallow whitespace after the opening brace of blocks.
* [`block-opening-brace-space-before`](../../src/rules/block-opening-brace-space-before/README.md): Require a single space or disallow whitespace before the opening brace of blocks.

### Selector

* [`selector-class-pattern`](../../src/rules/selector-class-pattern/README.md): Specify a pattern for class selectors.
* [`selector-combinator-space-after`](../../src/rules/selector-combinator-space-after/README.md): Require a single space or disallow whitespace after the combinators of selectors.
* [`selector-combinator-space-before`](../../src/rules/selector-combinator-space-before/README.md): Require a single space or disallow whitespace before the combinators of selectors.
* [`selector-id-pattern`](../../src/rules/selector-id-pattern/README.md): Specify a pattern for id selectors.
* [`selector-no-attribute`](../../src/rules/selector-no-attribute/README.md): Disallow attribute selectors.
* [`selector-no-combinator`](../../src/rules/selector-no-combinator/README.md): Disallow combinators in selectors.
* [`selector-no-id`](../../src/rules/selector-no-id/README.md): Disallow id selectors.
* [`selector-no-type`](../../src/rules/selector-no-type/README.md): Disallow type selectors.
* [`selector-no-universal`](../../src/rules/selector-no-universal/README.md): Disallow universal selectors.
* [`selector-no-vendor-prefix`](../../src/rules/selector-no-vendor-prefix/README.md): Disallow vendor prefixes for selectors.
* [`selector-pseudo-element-colon-notation`](../../src/rules/selector-pseudo-element-colon-notation/README.md): Specify single or double colon notation for applicable pseudo-elements.
* [`selector-root-no-composition`](../../src/rules/selector-root-no-composition/README.md): Disallow the composition of`:root` selectors.

### Selector list

* [`selector-list-comma-newline-after`](../../src/rules/selector-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of selector lists.
* [`selector-list-comma-newline-before`](../../src/rules/selector-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of selector lists.
* [`selector-list-comma-space-after`](../../src/rules/selector-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of selector lists.
* [`selector-list-comma-space-before`](../../src/rules/selector-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of selector lists.

### Rule

* [`rule-nested-empty-line-before`](../../src/rules/rule-nested-empty-line-before/README.md): Require or disallow an empty line before nested rules.
* [`rule-no-duplicate-properties`](../../src/rules/rule-no-duplicate-properties/README.md): Disallow duplicate properties within rules.
* [`rule-no-shorthand-property-overrides`](../../src/rules/rule-no-shorthand-property-overrides/README.md): Disallow shorthand properties that override related longhand properties.
* [`rule-no-single-line`](../../src/rules/rule-no-single-line/README.md): Disallow single-line rules.
* [`rule-non-nested-empty-line-before`](../../src/rules/rule-non-nested-empty-line-before/README.md): Require or disallow an empty line before non-nested rules.
* [`rule-properties-order`](../../src/rules/rule-properties-order/README.md): Specify the order of properties within rules.
* [`rule-single-line-max-declarations`](../../src/rules/rule-single-line-max-declarations/README.md): Limit the number of declaration within a single line rule.
* [`rule-trailing-semicolon`](../../src/rules/rule-trailing-semicolon/README.md): Require or disallow a trailing semicolon within rules.

### Root

* [`root-no-standard-properties`](../../src/rules/root-no-standard-properties/README.md): Disallow standard properties inside `:root` selectors.

### Media feature

* [`media-feature-colon-space-after`](../../src/rules/media-feature-colon-space-after/README.md): Require a single space or disallow whitespace after the colon in media features.
* [`media-feature-colon-space-before`](../../src/rules/media-feature-colon-space-before/README.md): Require a single space or disallow whitespace before the colon in media features.
* [`media-feature-name-no-vendor-prefix`](../../src/rules/media-feature-name-no-vendor-prefix/README.md): Disallow vendor prefixes for media feature names.
* [`media-feature-range-operator-space-after`](../../src/rules/media-feature-range-operator-space-after/README.md): Require a single space or disallow whitespace after the range operator in media features.
* [`media-feature-range-operator-space-before`](../../src/rules/media-feature-range-operator-space-before/README.md): Require a single space or disallow whitespace before the range operator in media features.

### Custom media

* [`custom-media-pattern`](../../src/rules/custom-media-pattern/README.md): Specify pattern of custom media query names.

### Media query

* [`media-query-parentheses-space-inside`](../../src/rules/media-query-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within media queries.

### Media query list

* [`media-query-list-comma-newline-after`](../../src/rules/media-query-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of media query lists.
* [`media-query-list-comma-newline-before`](../../src/rules/media-query-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of media query lists.
* [`media-query-list-comma-space-after`](../../src/rules/media-query-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of media query lists.
* [`media-query-list-comma-space-before`](../../src/rules/media-query-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of media query lists.

### At rule

* [`at-rule-empty-line-before`](../../src/rules/at-rule-empty-line-before/README.md): Require or disallow an empty line before @rules.
* [`at-rule-no-vendor-prefix`](../../src/rules/at-rule-no-vendor-prefix/README.md): Disallow vendor prefixes for @rules.

### Comment

* [`comment-empty-line-before`](../../src/rules/comment-empty-line-before/README.md): Require or disallow an empty line before comments.
* [`comment-space-inside`](../../src/rules/comment-space-inside/README.md): Require a single space or disallow whitespace on the inside of comment markers.

### General / Sheet

* [`indentation`](../../src/rules/indentation/README.md): Specify indentation.
* [`max-line-length`](../../src/rules/max-line-length/README.md): Limit the length of a line.
* [`max-empty-lines`](../../src/rules/max-empty-lines/README.md): Disallow more than a specified number of adjacent empty lines.
* [`no-eol-whitespace`](../../src/rules/no-eol-whitespace/README.md): Disallow end-of-line whitespace.
* [`no-missing-eof-newline`](../../src/rules/no-missing-eof-newline/README.md): Disallow missing end-of-file newline.

## About rule names

* Made of lowercase words separated by hyphens.
* Split into two parts:
  * The first describes what [_thing_](http://apps.workflower.fi/vocabs/css/en) the rule applies to.
  * The second describes what the rule is checking.

```
"number-leading-zero"
    ↑       ↑
the thing   what the rule is checking
```

* Except when the rule applies to the whole stylesheet:

```
"no-eol-whitespace"
"indentation"
     ↑
  what the rules are checking
```

### No rules

Most rules allow you to choose whether you want to require *or* disallow something.

For example, whether numbers *must* or *must not* have a leading zero:

* `number-leading-zero`: `string - "always"|"never"`
  * `"always"` - there *must always* be a leading zero.
  * `"never"` - there *must never* be a leading zero.

```css
    a { line-height: 0.5; }
/**                  ↑
 *   This leading zero */
```

However, some rules *just disallow* something. `*-no-*` is used to identify these rules.

For example, whether empty blocks should be disallowed:

* `block-no-empty` - blocks *must not* be empty.

```css
    a { }
/**    ↑
 *  Blocks like this */
```

Notice how, for a rule like this, it does not make sense to have an option to enforce the opposite i.e. that every block *must* be empty.

### Max rules

`*-max-*` is used when a rule is *setting a limit* to something.

For example, specifying the maximum number of digits after the "." in a number:

* `number-max-precision`: `int`

```css
    a { font-size: 1.333em; }
/**                 ↑
 * The maximum number of digits after this "." */
```

### Whitespace rules

Whitespace rules allow you to specify whether an empty line, a single space, a newline or no space must be used in some specific part of the stylesheet.

The whitespace rules combine two sets of keywords:

1. `before`, `after` and `inside` are used to specify where the whitespace (if any) is expected.
2. `empty-line`, `space` and `newline` are used to specify whether a single empty line, a single space, a single newline or no space is expected there.

For example, specifying if a single empty line or no space must come before all the comments in a stylesheet:

* `comment-empty-line-before`: `string` - `"always"|"never"`

```css
    a {}
                  ←
    /* comment */ ↑
                  ↑
/**               ↑
 *        This empty line  */
```

Additionally, some whitespace rule make use of another set of keywords:

1. `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` or `range-operator` are used if a specific piece of punctuation in the *thing* is being targetted.

For example, specifying if a single space or no space must come after a comma in a function:

* `function-comma-space-after`: `string` - `"always"|"never"`

```css
    a { transform: translate(1, 1) }
/**                           ↑
 *  The space after this commas */
```

The plural of the punctuation is used for `inside` rules. For example, specifying if a single space or no space must be inside the parentheses of a function:

* `function-parentheses-space-inside`: `string` - `"always"|"never"`

```css
    a { transform: translate( 1, 1 ); }
/**                         ↑      ↑
 * The space inside these two parentheses */
```
