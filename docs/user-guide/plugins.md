# Plugins

Plugins are rules and sets of rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases. Their *package* names are prefixed with "stylelint". Their *rule* names are namespaced so that they do not clash with stylelint's core rules.

## Methodologies

- [`stylelint-selector-bem-pattern`](https://github.com/davidtheclark/stylelint-selector-bem-pattern): Specify a BEM pattern for selectors (incorporates [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter)).

## Non-standard syntax

### Packs

- [`stylelint-scss`](https://github.com/kristerkari/stylelint-scss): A collection of SCSS specific linting rules for stylelint.

### Individual rules

- [`stylelint-declaration-use-variable`](https://github.com/sh-waqar/stylelint-declaration-use-variable): Specify properties for which a SCSS variable must be used.

## Toolkits

### Primer

- [`stylelint-selector-no-utility`](https://github.com/primer/stylelint-selector-no-utility): Disallow Primer utility classes within complex selectors.
