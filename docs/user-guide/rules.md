# Rules

There are over a hundred rules built into stylelint. They all focus on *standard css* and aim to be valuable to the majority of users. In addition to these rules there are [plugins](/docs/user-guide/plugins.md), which are rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases.

Every rule and plugin is standalone and turned off by default. None of the rules or plugins have default values for their options.

## List of rules

Here are all the rules within stylelint, grouped by the [*thing*](http://apps.workflower.fi/vocabs/css/en) they apply to.

Don't forget to look at the list of [plugins](/docs/user-guide/plugins.md) for more ways to lint.

### Color

- [`color-hex-case`](../../src/rules/color-hex-case/README.md): Specify lowercase or uppercase for hex colors.
- [`color-hex-length`](../../src/rules/color-hex-length/README.md): Specify short or long notation for hex colors.
- [`color-named`](../../src/rules/color-named/README.md): Require (where possible) or disallow named colors.
- [`color-no-hex`](../../src/rules/color-no-hex/README.md): Disallow hex colors.
- [`color-no-invalid-hex`](../../src/rules/color-no-invalid-hex/README.md): Disallow invalid hex colors.

### Font family

- [`font-family-name-quotes`](../../src/rules/font-family-name-quotes/README.md): Specify whether or not quotation marks should be used around font family names, and whether single or double.

### Font weight

- [`font-weight-notation`](../../src/rules/font-weight-notation/README.md): Require numeric or named (where possible) `font-weight` values.

### Function

- [`function-blacklist`](../../src/rules/function-blacklist/README.md): Specify a blacklist of disallowed functions.
- [`function-calc-no-unspaced-operator`](../../src/rules/function-calc-no-unspaced-operator/README.md): Disallow an unspaced operator within `calc` functions.
- [`function-comma-newline-after`](../../src/rules/function-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of functions.
- [`function-comma-newline-before`](../../src/rules/function-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of functions.
- [`function-comma-space-after`](../../src/rules/function-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of functions.
- [`function-comma-space-before`](../../src/rules/function-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of functions.
- [`function-linear-gradient-no-nonstandard-direction`](../../src/rules/function-linear-gradient-no-nonstandard-direction/README.md): Disallow direction values in `linear-gradient()` calls that are not valid according to the [standard syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#Syntax).
- [`function-parentheses-newline-inside`](../../src/rules/function-parentheses-newline-inside/README.md): Require a newline or disallow whitespace on the inside of the parentheses of functions.
- [`function-parentheses-space-inside`](../../src/rules/function-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses of functions.
- [`function-url-quotes`](../../src/rules/function-url-quotes/README.md): Specify single, double or no quotes for urls.
- [`function-whitelist`](../../src/rules/function-whitelist/README.md): Specify a whitelist of allowed functions.
- [`function-whitespace-after`](../../src/rules/function-whitespace-after/README.md): Require or disallow whitespace after functions.

### Number

- [`number-leading-zero`](../../src/rules/number-leading-zero/README.md): Require or disallow a leading zero for fractional numbers less than 1.
- [`number-max-precision`](../../src/rules/number-max-precision/README.md): Limit the number of decimal places allowed in numbers.
- [`number-no-trailing-zeros`](../../src/rules/number-no-trailing-zeros/README.md): Disallow trailing zeros in numbers.
- [`number-zero-length-no-unit`](../../src/rules/number-zero-length-no-unit/README.md): Disallow units for zero lengths.

### String

- [`string-no-newline`](../../src/rules/string-no-newline/README.md): Disallow (unescaped) newlines in strings.
- [`string-quotes`](../../src/rules/string-quotes/README.md): Specify single or double quotes around strings.

### Time

- [`time-no-imperceptible`](../../src/rules/time-no-imperceptible/README.md): Disallow `animation` and `transition` times under 100ms.

### Unit

- [`unit-blacklist`](../../src/rules/unit-blacklist/README.md): Specify a blacklist of disallowed units.
- [`unit-whitelist`](../../src/rules/unit-whitelist/README.md): Specify a whitelist of allowed units.

### Value

- [`value-no-vendor-prefix`](../../src/rules/value-no-vendor-prefix/README.md): Disallow vendor prefixes for values.

### Value list

- [`value-list-comma-newline-after`](../../src/rules/value-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of value lists.
- [`value-list-comma-newline-before`](../../src/rules/value-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of value lists.
- [`value-list-comma-space-after`](../../src/rules/value-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of value lists.
- [`value-list-comma-space-before`](../../src/rules/value-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of value lists.

### Custom property

- [`custom-property-no-outside-root`](../../src/rules/custom-property-no-outside-root/README.md): Disallow custom properties outside of `:root` rules.
- [`custom-property-pattern`](../../src/rules/custom-property-pattern/README.md): Specify a pattern for custom properties.

### Property

- [`property-blacklist`](../../src/rules/property-blacklist/README.md): Specify a blacklist of disallowed properties.
- [`property-no-vendor-prefix`](../../src/rules/property-no-vendor-prefix/README.md): Disallow vendor prefixes for properties.
- [`property-unit-blacklist`](../../src/rules/property-unit-blacklist/README.md): Specify a blacklist of disallowed units for specific properties.
- [`property-unit-whitelist`](../../src/rules/property-unit-whitelist/README.md): Specify a whitelist of allowed units for specific properties.
- [`property-value-blacklist`](../../src/rules/property-value-blacklist/README.md): Specify a blacklist of disallowed values for specific properties.
- [`property-value-whitelist`](../../src/rules/property-value-blacklist/README.md): Specify a whitelist of allowed values for specific properties.
- [`property-whitelist`](../../src/rules/property-whitelist/README.md): Specify a whitelist of allowed properties.

### Declaration

- [`declaration-bang-space-after`](../../src/rules/declaration-bang-space-after/README.md): Require a single space or disallow whitespace after the bang of declarations.
- [`declaration-bang-space-before`](../../src/rules/declaration-bang-space-before/README.md): Require a single space or disallow whitespace before the bang of declarations.
- [`declaration-colon-newline-after`](../../src/rules/declaration-colon-newline-after/README.md): Require a newline or disallow whitespace after the colon of declarations.
- [`declaration-colon-space-after`](../../src/rules/declaration-colon-space-after/README.md): Require a single space or disallow whitespace after the colon of declarations.
- [`declaration-colon-space-before`](../../src/rules/declaration-colon-space-before/README.md): Require a single space or disallow whitespace before the colon of declarations.
- [`declaration-no-important`](../../src/rules/declaration-no-important/README.md): Disallow `!important` within declarations.

### Declaration block

- [`declaration-block-no-duplicate-properties`](../../src/rules/declaration-block-no-duplicate-properties/README.md): Disallow duplicate properties within declaration blocks.
- [`declaration-block-no-shorthand-property-overrides`](../../src/rules/declaration-block-no-shorthand-property-overrides/README.md): Disallow shorthand properties that override related longhand properties within declaration blocks.
- [`declaration-block-properties-order`](../../src/rules/declaration-block-properties-order/README.md): Specify the order of properties within declaration blocks.
- [`declaration-block-semicolon-newline-after`](../../src/rules/declaration-block-semicolon-newline-after/README.md): Require a newline or disallow whitespace after the semicolons of declaration blocks.
- [`declaration-block-semicolon-newline-before`](../../src/rules/declaration-block-semicolon-newline-before/README.md): Require a newline or disallow whitespace before the semicolons of declaration blocks.
- [`declaration-block-semicolon-space-after`](../../src/rules/declaration-block-semicolon-space-after/README.md): Require a single space or disallow whitespace after the semicolons of declaration blocks.
- [`declaration-block-semicolon-space-before`](../../src/rules/declaration-block-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of declaration blocks.
- [`declaration-block-single-line-max-declarations`](../../src/rules/declaration-block-single-line-max-declarations/README.md): Limit the number of declaration within single line declaration blocks.
- [`declaration-block-trailing-semicolon`](../../src/rules/declaration-block-trailing-semicolon/README.md): Require or disallow a trailing semicolon within declaration blocks.

### Block

- [`block-closing-brace-newline-after`](../../src/rules/block-closing-brace-newline-after/README.md): Require a newline or disallow whitespace after the closing brace of blocks.
- [`block-closing-brace-newline-before`](../../src/rules/block-closing-brace-newline-before/README.md): Require a newline or disallow whitespace before the closing brace of blocks.
- [`block-closing-brace-space-after`](../../src/rules/block-closing-brace-space-after/README.md): Require a single space or disallow whitespace after the closing brace of blocks.
- [`block-closing-brace-space-before`](../../src/rules/block-closing-brace-space-before/README.md): Require a single space or disallow whitespace before the closing brace of blocks.
- [`block-no-empty`](../../src/rules/block-no-empty/README.md): Disallow empty blocks.
- [`block-no-single-line`](../../src/rules/block-no-single-line/README.md): Disallow single-line blocks.
- [`block-opening-brace-newline-after`](../../src/rules/block-opening-brace-newline-after/README.md): Require a newline after the opening brace of blocks.
- [`block-opening-brace-newline-before`](../../src/rules/block-opening-brace-newline-before/README.md): Require a newline or disallow whitespace before the opening brace of blocks.
- [`block-opening-brace-space-after`](../../src/rules/block-opening-brace-space-after/README.md): Require a single space or disallow whitespace after the opening brace of blocks.
- [`block-opening-brace-space-before`](../../src/rules/block-opening-brace-space-before/README.md): Require a single space or disallow whitespace before the opening brace of blocks.

### Selector

- [`selector-class-pattern`](../../src/rules/selector-class-pattern/README.md): Specify a pattern for class selectors.
- [`selector-combinator-space-after`](../../src/rules/selector-combinator-space-after/README.md): Require a single space or disallow whitespace after the combinators of selectors.
- [`selector-combinator-space-before`](../../src/rules/selector-combinator-space-before/README.md): Require a single space or disallow whitespace before the combinators of selectors.
- [`selector-id-pattern`](../../src/rules/selector-id-pattern/README.md): Specify a pattern for id selectors.
- [`selector-max-specificity`](../../src/rules/selector-max-specificity/README.md): Limit the specificity of selectors.
- [`selector-no-attribute`](../../src/rules/selector-no-attribute/README.md): Disallow attribute selectors.
- [`selector-no-combinator`](../../src/rules/selector-no-combinator/README.md): Disallow combinators in selectors.
- [`selector-no-id`](../../src/rules/selector-no-id/README.md): Disallow id selectors.
- [`selector-no-type`](../../src/rules/selector-no-type/README.md): Disallow type selectors.
- [`selector-no-universal`](../../src/rules/selector-no-universal/README.md): Disallow the universal selector.
- [`selector-no-vendor-prefix`](../../src/rules/selector-no-vendor-prefix/README.md): Disallow vendor prefixes for selectors.
- [`selector-pseudo-element-colon-notation`](../../src/rules/selector-pseudo-element-colon-notation/README.md): Specify single or double colon notation for applicable pseudo-elements.
- [`selector-root-no-composition`](../../src/rules/selector-root-no-composition/README.md): Disallow the composition of `:root` in selectors.

### Selector list

- [`selector-list-comma-newline-after`](../../src/rules/selector-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of selector lists.
- [`selector-list-comma-newline-before`](../../src/rules/selector-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of selector lists.
- [`selector-list-comma-space-after`](../../src/rules/selector-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of selector lists.
- [`selector-list-comma-space-before`](../../src/rules/selector-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of selector lists.

### Root rule

- [`root-no-standard-properties`](../../src/rules/root-no-standard-properties/README.md): Disallow standard properties inside `:root` rules.

### Rule

- [`rule-nested-empty-line-before`](../../src/rules/rule-nested-empty-line-before/README.md): Require or disallow an empty line before nested rules.
- [`rule-non-nested-empty-line-before`](../../src/rules/rule-non-nested-empty-line-before/README.md): Require or disallow an empty line before non-nested rules.

### Media feature

- [`media-feature-colon-space-after`](../../src/rules/media-feature-colon-space-after/README.md): Require a single space or disallow whitespace after the colon in media features.
- [`media-feature-colon-space-before`](../../src/rules/media-feature-colon-space-before/README.md): Require a single space or disallow whitespace before the colon in media features.
- [`media-feature-name-no-vendor-prefix`](../../src/rules/media-feature-name-no-vendor-prefix/README.md): Disallow vendor prefixes for media feature names.
- [`media-feature-no-missing-punctuation`](../../src/rules/media-feature-no-missing-punctuation/README.md): Disallow missing punctuation for non-boolean media features.
- [`media-feature-range-operator-space-after`](../../src/rules/media-feature-range-operator-space-after/README.md): Require a single space or disallow whitespace after the range operator in media features.
- [`media-feature-range-operator-space-before`](../../src/rules/media-feature-range-operator-space-before/README.md): Require a single space or disallow whitespace before the range operator in media features.

### Custom media

- [`custom-media-pattern`](../../src/rules/custom-media-pattern/README.md): Specify a pattern for custom media query names.

### Media query

- [`media-query-parentheses-space-inside`](../../src/rules/media-query-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within media queries.

### Media query list

- [`media-query-list-comma-newline-after`](../../src/rules/media-query-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of media query lists.
- [`media-query-list-comma-newline-before`](../../src/rules/media-query-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of media query lists.
- [`media-query-list-comma-space-after`](../../src/rules/media-query-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of media query lists.
- [`media-query-list-comma-space-before`](../../src/rules/media-query-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of media query lists.

### At rule

- [`at-rule-empty-line-before`](../../src/rules/at-rule-empty-line-before/README.md): Require or disallow an empty line before @rules.
- [`at-rule-no-vendor-prefix`](../../src/rules/at-rule-no-vendor-prefix/README.md): Disallow vendor prefixes for @rules.

### Comment

- [`comment-empty-line-before`](../../src/rules/comment-empty-line-before/README.md): Require or disallow an empty line before comments.
- [`comment-whitespace-inside`](../../src/rules/comment-whitespace-inside/README.md): Require or disallow whitespace on the inside of comment markers.

### General / Sheet

- [`indentation`](../../src/rules/indentation/README.md): Specify indentation.
- [`max-empty-lines`](../../src/rules/max-empty-lines/README.md): Limit the number of adjacent empty lines.
- [`max-line-length`](../../src/rules/max-line-length/README.md): Limit the length of a line.
- [`max-nesting-depth`](../../src/rules/max-nesting-depth/README.md): Limit the depth of nesting.
- [`no-browser-hacks`](../../src/rules/no-browser-hacks/README.md): Disallow browser hacks that are irrelevant to the browsers you are targeting.
- [`no-descending-specificity`](../../src/rules/no-descending-specificity/README.md): Disallow selectors of lower specificity from coming after overriding selectors of higher specificity.
- [`no-duplicate-selectors`](../../src/rules/no-duplicate-selectors/README.md): Disallow duplicate selectors.
- [`no-eol-whitespace`](../../src/rules/no-eol-whitespace/README.md): Disallow end-of-line whitespace.
- [`no-indistinguishable-colors`](../../src/rules/no-indistinguishable-colors/README.md): Disallow colors that are suspiciously close to being identical.
- [`no-invalid-double-slash-comments`](../../src/rules/no-invalid-double-slash-comments/README.md): Disallow double-slash comments (`//...`) which are not supported by CSS.
- [`no-missing-eof-newline`](../../src/rules/no-missing-eof-newline/README.md): Disallow missing end-of-file newline.
- [`no-unknown-animations`](../../src/rules/no-unknown-animations/README.md): Disallow animation names that do not correspond to a `@keyframes` declaration.
- [`no-unsupported-browser-features`](../../src/rules/no-unsupported-browser-features/README.md): Disallow features that are unsupported by the browsers that you are targeting.

## About rule names

- Made of lowercase words separated by hyphens.
- Split into two parts:

  - The first describes what [*thing*](http://apps.workflower.fi/vocabs/css/en) the rule applies to.
  - The second describes what the rule is checking.

```shell
"number-leading-zero"
    ↑       ↑
the thing   what the rule is checking
```

- Except when the rule applies to the whole stylesheet:

```shell
"no-eol-whitespace"
"indentation"
     ↑
  what the rules are checking
```

### No rules

Most rules allow you to choose whether you want to require *or- disallow something.

For example, whether numbers *must* or *must not* have a leading zero:

- `number-leading-zero`: `string - "always"|"never"`

  - `"always"` - there *must always* be a leading zero.
  - `"never"` - there *must never* be a leading zero.

```css
    a { line-height: 0.5; }
/**                  ↑
 *   This leading zero */
```

However, some rules *just disallow* something. `*-no-*` is used to identify these rules.

For example, whether empty blocks should be disallowed:

- `block-no-empty` - blocks *must not* be empty.

```css
    a { }
/**    ↑
 *  Blocks like this */
```

Notice how, for a rule like this, it does not make sense to have an option to enforce the opposite i.e. that every block *must* be empty.

### Max rules

`*-max-*` is used when a rule is *setting a limit* to something.

For example, specifying the maximum number of digits after the "." in a number:

- `number-max-precision`: `int`

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

- `comment-empty-line-before`: `string` - `"always"|"never"`

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

- `function-comma-space-after`: `string` - `"always"|"never"`

```css
    a { transform: translate(1, 1) }
/**                           ↑
 *  The space after this commas */
```

The plural of the punctuation is used for `inside` rules. For example, specifying if a single space or no space must be inside the parentheses of a function:

- `function-parentheses-space-inside`: `string` - `"always"|"never"`

```css
    a { transform: translate( 1, 1 ); }
/**                         ↑      ↑
 * The space inside these two parentheses */
```
