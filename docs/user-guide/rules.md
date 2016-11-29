# Rules

Rules determine what the linter looks for and complains about. All the rules are turned off by default and none have default values for their options. The rules follow a consistent naming convention and have been designed to work in conjunction with one another, you can read more about this in the ["About rules"](about-rules.md) section.

In addition to these rules there are [plugins](plugins.md), which are rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases. Don't forget to look at the list of [plugins](plugins.md) for more ways to lint.

## List of rules

Here are all the rules within stylelint, grouped by the [*thing*](http://apps.workflower.fi/vocabs/css/en) they apply to.

### Color

-   [`color-hex-case`](../../lib/rules/color-hex-case/README.md): Specify lowercase or uppercase for hex colors.
-   [`color-hex-length`](../../lib/rules/color-hex-length/README.md): Specify short or long notation for hex colors.
-   [`color-named`](../../lib/rules/color-named/README.md): Require (where possible) or disallow named colors.
-   [`color-no-hex`](../../lib/rules/color-no-hex/README.md): Disallow hex colors.
-   [`color-no-invalid-hex`](../../lib/rules/color-no-invalid-hex/README.md): Disallow invalid hex colors.

### Font family

-   [`font-family-name-quotes`](../../lib/rules/font-family-name-quotes/README.md): Specify whether or not quotation marks should be used around font family names.
-   [`font-family-no-duplicate-names`](../../lib/rules/font-family-no-duplicate-names/README.md): Disallow duplicate font family names.

### Font weight

-   [`font-weight-notation`](../../lib/rules/font-weight-notation/README.md): Require numeric or named (where possible) `font-weight` values.

### Function

-   [`function-blacklist`](../../lib/rules/function-blacklist/README.md): Specify a blacklist of disallowed functions.
-   [`function-calc-no-unspaced-operator`](../../lib/rules/function-calc-no-unspaced-operator/README.md): Disallow an unspaced operator within `calc` functions.
-   [`function-comma-newline-after`](../../lib/rules/function-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of functions.
-   [`function-comma-newline-before`](../../lib/rules/function-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of functions.
-   [`function-comma-space-after`](../../lib/rules/function-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of functions.
-   [`function-comma-space-before`](../../lib/rules/function-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of functions.
-   [`function-linear-gradient-no-nonstandard-direction`](../../lib/rules/function-linear-gradient-no-nonstandard-direction/README.md): Disallow direction values in `linear-gradient()` calls that are not valid according to the [standard syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#Syntax).
-   [`function-max-empty-lines`](../../lib/rules/function-max-empty-lines/README.md): Limit the number of adjacent empty lines within functions.
-   [`function-name-case`](../../lib/rules/function-name-case/README.md): Specify lowercase or uppercase for function names.
-   [`function-parentheses-newline-inside`](../../lib/rules/function-parentheses-newline-inside/README.md): Require a newline or disallow whitespace on the inside of the parentheses of functions.
-   [`function-parentheses-space-inside`](../../lib/rules/function-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses of functions.
-   [`function-url-data-uris`](../../lib/rules/function-url-data-uris/README.md): Require or disallow data URIs for urls.
-   [`function-url-no-scheme-relative`](../../lib/rules/function-url-no-scheme-relative/README.md): Disallow scheme-relative urls.
-   [`function-url-quotes`](../../lib/rules/function-url-quotes/README.md): Require or disallow quotes for urls.
-   [`function-url-scheme-whitelist`](../../lib/rules/function-url-scheme-whitelist/README.md): Specify a whitelist of allowed url schemes.
-   [`function-whitelist`](../../lib/rules/function-whitelist/README.md): Specify a whitelist of allowed functions.
-   [`function-whitespace-after`](../../lib/rules/function-whitespace-after/README.md): Require or disallow whitespace after functions.

### Number

-   [`number-leading-zero`](../../lib/rules/number-leading-zero/README.md): Require or disallow a leading zero for fractional numbers less than 1.
-   [`number-max-precision`](../../lib/rules/number-max-precision/README.md): Limit the number of decimal places allowed in numbers.
-   [`number-no-trailing-zeros`](../../lib/rules/number-no-trailing-zeros/README.md): Disallow trailing zeros in numbers.

### String

-   [`string-no-newline`](../../lib/rules/string-no-newline/README.md): Disallow (unescaped) newlines in strings.
-   [`string-quotes`](../../lib/rules/string-quotes/README.md): Specify single or double quotes around strings.

### Length

-   [`length-zero-no-unit`](../../lib/rules/length-zero-no-unit/README.md): Disallow units for zero lengths.

### Time

-   [`time-no-imperceptible`](../../lib/rules/time-no-imperceptible/README.md): Disallow `animation` and `transition` less than or equal to 100ms.

### Unit

-   [`unit-blacklist`](../../lib/rules/unit-blacklist/README.md): Specify a blacklist of disallowed units.
-   [`unit-case`](../../lib/rules/unit-case/README.md): Specify lowercase or uppercase for units.
-   [`unit-no-unknown`](../../lib/rules/unit-no-unknown/README.md): Disallow unknown units.
-   [`unit-whitelist`](../../lib/rules/unit-whitelist/README.md): Specify a whitelist of allowed units.

### Value

-   [`value-keyword-case`](../../lib/rules/value-keyword-case/README.md): Specify lowercase or uppercase for keywords values.
-   [`value-no-vendor-prefix`](../../lib/rules/value-no-vendor-prefix/README.md): Disallow vendor prefixes for values.

### Value list

-   [`value-list-comma-newline-after`](../../lib/rules/value-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of value lists.
-   [`value-list-comma-newline-before`](../../lib/rules/value-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of value lists.
-   [`value-list-comma-space-after`](../../lib/rules/value-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of value lists.
-   [`value-list-comma-space-before`](../../lib/rules/value-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of value lists.
-   [`value-list-max-empty-lines`](../../lib/rules/value-list-max-empty-lines/README.md): Limit the number of adjacent empty lines within value lists.

### Custom property

-   [`custom-property-empty-line-before`](../../lib/rules/custom-property-empty-line-before/README.md): Require or disallow an empty line before custom properties.
-   [`custom-property-no-outside-root`](../../lib/rules/custom-property-no-outside-root/README.md): Disallow custom properties outside of `:root` rules.
-   [`custom-property-pattern`](../../lib/rules/custom-property-pattern/README.md): Specify a pattern for custom properties.

### Shorthand property

-   [`shorthand-property-no-redundant-values`](../../lib/rules/shorthand-property-no-redundant-values/README.md): Disallow redundant values in shorthand properties.

### Property

-   [`property-blacklist`](../../lib/rules/property-blacklist/README.md): Specify a blacklist of disallowed properties.
-   [`property-case`](../../lib/rules/property-case/README.md): Specify lowercase or uppercase for properties.
-   [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md): Disallow unknown properties.
-   [`property-no-vendor-prefix`](../../lib/rules/property-no-vendor-prefix/README.md): Disallow vendor prefixes for properties.
-   [`property-whitelist`](../../lib/rules/property-whitelist/README.md): Specify a whitelist of allowed properties.

### Keyframe declaration

-   [`keyframe-declaration-no-important`](../../lib/rules/keyframe-declaration-no-important/README.md): Disallow `!important` within keyframe declarations.

### Declaration

-   [`declaration-bang-space-after`](../../lib/rules/declaration-bang-space-after/README.md): Require a single space or disallow whitespace after the bang of declarations.
-   [`declaration-bang-space-before`](../../lib/rules/declaration-bang-space-before/README.md): Require a single space or disallow whitespace before the bang of declarations.
-   [`declaration-colon-newline-after`](../../lib/rules/declaration-colon-newline-after/README.md): Require a newline or disallow whitespace after the colon of declarations.
-   [`declaration-colon-space-after`](../../lib/rules/declaration-colon-space-after/README.md): Require a single space or disallow whitespace after the colon of declarations.
-   [`declaration-colon-space-before`](../../lib/rules/declaration-colon-space-before/README.md): Require a single space or disallow whitespace before the colon of declarations.
-   [`declaration-empty-line-before`](../../lib/rules/declaration-empty-line-before/README.md): Require or disallow an empty line before declarations.
-   [`declaration-no-important`](../../lib/rules/declaration-no-important/README.md): Disallow `!important` within declarations.
-   [`declaration-property-unit-blacklist`](../../lib/rules/declaration-property-unit-blacklist/README.md): Specify a blacklist of disallowed property and unit pairs within declarations.
-   [`declaration-property-unit-whitelist`](../../lib/rules/declaration-property-unit-whitelist/README.md): Specify a whitelist of allowed property and unit pairs within declarations.
-   [`declaration-property-value-blacklist`](../../lib/rules/declaration-property-value-blacklist/README.md): Specify a blacklist of disallowed property and value pairs within declarations.
-   [`declaration-property-value-whitelist`](../../lib/rules/declaration-property-value-whitelist/README.md): Specify a whitelist of allowed property and value pairs within declarations.

### Declaration block

-   [`declaration-block-no-duplicate-properties`](../../lib/rules/declaration-block-no-duplicate-properties/README.md): Disallow duplicate properties within declaration blocks.
-   [`declaration-block-no-ignored-properties`](../../lib/rules/declaration-block-no-ignored-properties/README.md): Disallow property values that are ignored due to another property value in the same rule.
-   [`declaration-block-no-redundant-longhand-properties`](../../lib/rules/declaration-block-no-redundant-longhand-properties/README.md): Disallow longhand properties that can be combined into one shorthand property.
-   [`declaration-block-no-shorthand-property-overrides`](../../lib/rules/declaration-block-no-shorthand-property-overrides/README.md): Disallow shorthand properties that override related longhand properties within declaration blocks.
-   [`declaration-block-properties-order`](../../lib/rules/declaration-block-properties-order/README.md): Specify the order of properties within declaration blocks.
-   [`declaration-block-semicolon-newline-after`](../../lib/rules/declaration-block-semicolon-newline-after/README.md): Require a newline or disallow whitespace after the semicolons of declaration blocks.
-   [`declaration-block-semicolon-newline-before`](../../lib/rules/declaration-block-semicolon-newline-before/README.md): Require a newline or disallow whitespace before the semicolons of declaration blocks.
-   [`declaration-block-semicolon-space-after`](../../lib/rules/declaration-block-semicolon-space-after/README.md): Require a single space or disallow whitespace after the semicolons of declaration blocks.
-   [`declaration-block-semicolon-space-before`](../../lib/rules/declaration-block-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of declaration blocks.
-   [`declaration-block-single-line-max-declarations`](../../lib/rules/declaration-block-single-line-max-declarations/README.md): Limit the number of declaration within single line declaration blocks.
-   [`declaration-block-trailing-semicolon`](../../lib/rules/declaration-block-trailing-semicolon/README.md): Require or disallow a trailing semicolon within declaration blocks.

### Block

-   [`block-closing-brace-empty-line-before`](../../lib/rules/block-closing-brace-empty-line-before/README.md): Require or disallow an empty line before the closing brace of blocks.
-   [`block-closing-brace-newline-after`](../../lib/rules/block-closing-brace-newline-after/README.md): Require a newline or disallow whitespace after the closing brace of blocks.
-   [`block-closing-brace-newline-before`](../../lib/rules/block-closing-brace-newline-before/README.md): Require a newline or disallow whitespace before the closing brace of blocks.
-   [`block-closing-brace-space-after`](../../lib/rules/block-closing-brace-space-after/README.md): Require a single space or disallow whitespace after the closing brace of blocks.
-   [`block-closing-brace-space-before`](../../lib/rules/block-closing-brace-space-before/README.md): Require a single space or disallow whitespace before the closing brace of blocks.
-   [`block-no-empty`](../../lib/rules/block-no-empty/README.md): Disallow empty blocks.
-   [`block-no-single-line`](../../lib/rules/block-no-single-line/README.md): Disallow single-line blocks.
-   [`block-opening-brace-newline-after`](../../lib/rules/block-opening-brace-newline-after/README.md): Require a newline after the opening brace of blocks.
-   [`block-opening-brace-newline-before`](../../lib/rules/block-opening-brace-newline-before/README.md): Require a newline or disallow whitespace before the opening brace of blocks.
-   [`block-opening-brace-space-after`](../../lib/rules/block-opening-brace-space-after/README.md): Require a single space or disallow whitespace after the opening brace of blocks.
-   [`block-opening-brace-space-before`](../../lib/rules/block-opening-brace-space-before/README.md): Require a single space or disallow whitespace before the opening brace of blocks.

### Selector

-   [`selector-attribute-brackets-space-inside`](../../lib/rules/selector-attribute-brackets-space-inside/README.md): Require a single space or disallow whitespace on the inside of the brackets within attribute selectors.
-   [`selector-attribute-operator-blacklist`](../../lib/rules/selector-attribute-operator-blacklist/README.md): Specify a blacklist of disallowed attribute operators.
-   [`selector-attribute-operator-space-after`](../../lib/rules/selector-attribute-operator-space-after/README.md): Require a single space or disallow whitespace after operators within attribute selectors.
-   [`selector-attribute-operator-space-before`](../../lib/rules/selector-attribute-operator-space-before/README.md): Require a single space or disallow whitespace before operators within attribute selectors.
-   [`selector-attribute-operator-whitelist`](../../lib/rules/selector-attribute-operator-whitelist/README.md): Specify a whitelist of allowed attribute operators.
-   [`selector-attribute-quotes`](../../lib/rules/selector-attribute-quotes/README.md): Require or disallow quotes for attribute values.
-   [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md): Specify a pattern for class selectors.
-   [`selector-combinator-space-after`](../../lib/rules/selector-combinator-space-after/README.md): Require a single space or disallow whitespace after the combinators of selectors.
-   [`selector-combinator-space-before`](../../lib/rules/selector-combinator-space-before/README.md): Require a single space or disallow whitespace before the combinators of selectors.
-   [`selector-descendant-combinator-no-non-space`](../../lib/rules/selector-descendant-combinator-no-non-space/README.md): Disallow non-space characters for descendant combinators of selectors.
-   [`selector-id-pattern`](../../lib/rules/selector-id-pattern/README.md): Specify a pattern for id selectors.
-   [`selector-max-compound-selectors`](../../lib/rules/selector-max-compound-selectors/README.md): Limit the number of compound selectors in a selector.
-   [`selector-max-specificity`](../../lib/rules/selector-max-specificity/README.md): Limit the specificity of selectors.
-   [`selector-nested-pattern`](../../lib/rules/selector-nested-pattern/README.md): Specify a pattern for the selectors of rules nested within rules.
-   [`selector-no-attribute`](../../lib/rules/selector-no-attribute/README.md): Disallow attribute selectors.
-   [`selector-no-combinator`](../../lib/rules/selector-no-combinator/README.md): Disallow combinators in selectors.
-   [`selector-no-empty`](../../lib/rules/selector-no-empty/README.md): Disallow empty selectors.
-   [`selector-no-id`](../../lib/rules/selector-no-id/README.md): Disallow id selectors.
-   [`selector-no-qualifying-type`](../../lib/rules/selector-no-qualifying-type/README.md): Disallow qualifying a selector by type.
-   [`selector-no-type`](../../lib/rules/selector-no-type/README.md): Disallow type selectors.
-   [`selector-no-universal`](../../lib/rules/selector-no-universal/README.md): Disallow the universal selector.
-   [`selector-no-vendor-prefix`](../../lib/rules/selector-no-vendor-prefix/README.md): Disallow vendor prefixes for selectors.
-   [`selector-pseudo-class-blacklist`](../../lib/rules/selector-pseudo-class-blacklist/README.md): Specify a blacklist of disallowed pseudo-class selectors.
-   [`selector-pseudo-class-case`](../../lib/rules/selector-pseudo-class-case/README.md): Specify lowercase or uppercase for pseudo-class selectors.
-   [`selector-pseudo-class-no-unknown`](../../lib/rules/selector-pseudo-class-no-unknown/README.md): Disallow unknown pseudo-class selectors.
-   [`selector-pseudo-class-parentheses-space-inside`](../../lib/rules/selector-pseudo-class-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors.
-   [`selector-pseudo-class-whitelist`](../../lib/rules/selector-pseudo-class-whitelist/README.md): Specify a whitelist of allowed pseudo-class selectors.
-   [`selector-pseudo-element-case`](../../lib/rules/selector-pseudo-element-case/README.md): Specify lowercase or uppercase for pseudo-element selectors.
-   [`selector-pseudo-element-colon-notation`](../../lib/rules/selector-pseudo-element-colon-notation/README.md): Specify single or double colon notation for applicable pseudo-elements.
-   [`selector-pseudo-element-no-unknown`](../../lib/rules/selector-pseudo-element-no-unknown/README.md): Disallow unknown pseudo-element selectors.
-   [`selector-root-no-composition`](../../lib/rules/selector-root-no-composition/README.md): Disallow the composition of `:root` in selectors.
-   [`selector-type-case`](../../lib/rules/selector-type-case/README.md): Specify lowercase or uppercase for type selector.
-   [`selector-type-no-unknown`](../../lib/rules/selector-type-no-unknown/README.md): Disallow unknown type selectors.
-   [`selector-max-empty-lines`](../../lib/rules/selector-max-empty-lines/README.md): Limit the number of adjacent empty lines within selectors.

### Selector list

-   [`selector-list-comma-newline-after`](../../lib/rules/selector-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of selector lists.
-   [`selector-list-comma-newline-before`](../../lib/rules/selector-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of selector lists.
-   [`selector-list-comma-space-after`](../../lib/rules/selector-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of selector lists.
-   [`selector-list-comma-space-before`](../../lib/rules/selector-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of selector lists.

### Root rule

-   [`root-no-standard-properties`](../../lib/rules/root-no-standard-properties/README.md): Disallow standard properties inside `:root` rules.

### Rule

-   [`rule-nested-empty-line-before`](../../lib/rules/rule-nested-empty-line-before/README.md): Require or disallow an empty line before nested rules.
-   [`rule-non-nested-empty-line-before`](../../lib/rules/rule-non-nested-empty-line-before/README.md): Require or disallow an empty line before non-nested rules.

### Media feature

-   [`media-feature-colon-space-after`](../../lib/rules/media-feature-colon-space-after/README.md): Require a single space or disallow whitespace after the colon in media features.
-   [`media-feature-colon-space-before`](../../lib/rules/media-feature-colon-space-before/README.md): Require a single space or disallow whitespace before the colon in media features.
-   [`media-feature-name-blacklist`](../../lib/rules/media-feature-name-blacklist/README.md): Specify a blacklist of disallowed media feature names.
-   [`media-feature-name-case`](../../lib/rules/media-feature-name-case/README.md): Specify lowercase or uppercase for media feature names.
-   [`media-feature-name-no-unknown`](../../lib/rules/media-feature-name-no-unknown/README.md): Disallow unknown media feature names.
-   [`media-feature-name-no-vendor-prefix`](../../lib/rules/media-feature-name-no-vendor-prefix/README.md): Disallow vendor prefixes for media feature names.
-   [`media-feature-name-whitelist`](../../lib/rules/media-feature-name-whitelist/README.md): Specify a whitelist of allowed media feature names.
-   [`media-feature-no-missing-punctuation`](../../lib/rules/media-feature-no-missing-punctuation/README.md): Disallow missing punctuation for non-boolean media features.
-   [`media-feature-parentheses-space-inside`](../../lib/rules/media-feature-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within media features.
-   [`media-feature-range-operator-space-after`](../../lib/rules/media-feature-range-operator-space-after/README.md): Require a single space or disallow whitespace after the range operator in media features.
-   [`media-feature-range-operator-space-before`](../../lib/rules/media-feature-range-operator-space-before/README.md): Require a single space or disallow whitespace before the range operator in media features.

### Custom media

-   [`custom-media-pattern`](../../lib/rules/custom-media-pattern/README.md): Specify a pattern for custom media query names.

### Media query list

-   [`media-query-list-comma-newline-after`](../../lib/rules/media-query-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of media query lists.
-   [`media-query-list-comma-newline-before`](../../lib/rules/media-query-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of media query lists.
-   [`media-query-list-comma-space-after`](../../lib/rules/media-query-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of media query lists.
-   [`media-query-list-comma-space-before`](../../lib/rules/media-query-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of media query lists.

### At-rule

-   [`at-rule-blacklist`](../../lib/rules/at-rule-blacklist/README.md): Specify a blacklist of disallowed at-rules.
-   [`at-rule-empty-line-before`](../../lib/rules/at-rule-empty-line-before/README.md): Require or disallow an empty line before at-rules.
-   [`at-rule-name-case`](../../lib/rules/at-rule-name-case/README.md): Specify lowercase or uppercase for at-rules names.
-   [`at-rule-name-newline-after`](../../lib/rules/at-rule-name-newline-after/README.md): Require a newline after at-rule names.
-   [`at-rule-name-space-after`](../../lib/rules/at-rule-name-space-after/README.md): Require a single space after at-rule names.
-   [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md): Disallow unknown at-rules.
-   [`at-rule-no-vendor-prefix`](../../lib/rules/at-rule-no-vendor-prefix/README.md): Disallow vendor prefixes for at-rules.
-   [`at-rule-semicolon-newline-after`](../../lib/rules/at-rule-semicolon-newline-after/README.md): Require a newline after the semicolon of at-rules.
-   [`at-rule-whitelist`](../../lib/rules/at-rule-whitelist/README.md): Specify a whitelist of allowed at-rules.

### `stylelint-disable` comment

-   [`stylelint-disable-reason`](../../lib/rules/stylelint-disable-reason/README.md): Require a reason comment before or after `stylelint-disable` comments.

### Comment

-   [`comment-empty-line-before`](../../lib/rules/comment-empty-line-before/README.md): Require or disallow an empty line before comments.
-   [`comment-no-empty`](../../lib/rules/comment-no-empty/README.md):  Disallow empty comments.
-   [`comment-whitespace-inside`](../../lib/rules/comment-whitespace-inside/README.md): Require or disallow whitespace on the inside of comment markers.
-   [`comment-word-blacklist`](../../lib/rules/comment-word-blacklist/README.md): Specify a blacklist of disallowed words within comments.

### General / Sheet

-   [`indentation`](../../lib/rules/indentation/README.md): Specify indentation.
-   [`max-empty-lines`](../../lib/rules/max-empty-lines/README.md): Limit the number of adjacent empty lines.
-   [`max-line-length`](../../lib/rules/max-line-length/README.md): Limit the length of a line.
-   [`max-nesting-depth`](../../lib/rules/max-nesting-depth/README.md): Limit the depth of nesting.
-   [`no-browser-hacks`](../../lib/rules/no-browser-hacks/README.md): Disallow browser hacks that are irrelevant to the browsers you are targeting.
-   [`no-descending-specificity`](../../lib/rules/no-descending-specificity/README.md): Disallow selectors of lower specificity from coming after overriding selectors of higher specificity.
-   [`no-duplicate-selectors`](../../lib/rules/no-duplicate-selectors/README.md): Disallow duplicate selectors.
-   [`no-empty-source`](../../lib/rules/no-empty-source/README.md): Disallow empty sources.
-   [`no-eol-whitespace`](../../lib/rules/no-eol-whitespace/README.md): Disallow end-of-line whitespace.
-   [`no-extra-semicolons`](../../lib/rules/no-extra-semicolons/README.md): Disallow extra semicolons.
-   [`no-indistinguishable-colors`](../../lib/rules/no-indistinguishable-colors/README.md): Disallow colors that are suspiciously close to being identical.
-   [`no-invalid-double-slash-comments`](../../lib/rules/no-invalid-double-slash-comments/README.md): Disallow double-slash comments (`//...`) which are not supported by CSS.
-   [`no-missing-end-of-source-newline`](../../lib/rules/no-missing-end-of-source-newline/README.md): Disallow missing end-of-source newlines.
-   [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md): Disallow animation names that do not correspond to a `@keyframes` declaration.
-   [`no-unsupported-browser-features`](../../lib/rules/no-unsupported-browser-features/README.md): Disallow features that are unsupported by the browsers that you are targeting.
