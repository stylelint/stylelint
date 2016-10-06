# Plugins

Plugins are rules and sets of rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases. Their *package* names are prefixed with "stylelint". Their *rule* names are namespaced so that they do not clash with stylelint's core rules.

## Code style

-   [`stylelint-declaration-block-order`](https://github.com/hudochenkov/stylelint-declaration-block-order): Specify the order of groups of at-rules, nested rules, custom properties, declarations and dollar variables in declaration blocks.
-   [`stylelint-property-groups-structure`](https://github.com/hudochenkov/stylelint-property-groups-structure): Require or disallow an empty line before user-defined property groups and specify the order of the properties within these groups (incorporates the `declaration-block-properties-order` rule).

## Methodologies

-   [`stylelint-rscss`](https://github.com/rstacruz/stylelint-rscss): Validate [RSCSS](http://rscss.io) conventions.
-   [`stylelint-selector-bem-pattern`](https://github.com/davidtheclark/stylelint-selector-bem-pattern): Specify a BEM pattern for selectors (incorporates [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter)).

## Validators

-   [`stylelint-csstree-validator`](https://github.com/csstree/stylelint-validator): Validate CSS values to match W3C specs and browsers extensions.

## Non-standard syntax

### Individual rules

-   [`stylelint-declaration-use-variable`](https://github.com/sh-waqar/stylelint-declaration-use-variable): Specify properties for which a SCSS variable must be used.

### Packs

-   [`stylelint-scss`](https://github.com/kristerkari/stylelint-scss): A collection of SCSS specific linting rules for stylelint.

## Toolkits

### Primer

-   [`stylelint-selector-no-utility`](https://github.com/primer/stylelint-selector-no-utility): Disallow Primer utility classes within complex selectors.
