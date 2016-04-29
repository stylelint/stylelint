# Plugins

Plugins are rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases. Their names are prefixed with "stylelint".

## Methodologies

### Selector

- [`stylelint-selector-bem-pattern`](https://github.com/davidtheclark/stylelint-selector-bem-pattern): Specify a BEM pattern for selectors (incorporates [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter)).
- [`stylelint-selector-max-depth`](https://github.com/dryoma/stylelint-selector-max-depth): Limit selectors depth. In terms of this rule, selector depth is how many levels of HTML structure (not necesserily direct descendants) the selector is reflecting. For example, `.foo h3 + a > span` has the depth of 3: `.foo` is level 1, `a` (and `h3`, they are siblings) is level 2, and `span` is level 3.

## Non-standard syntax

### SCSS

#### Declaration

- [`stylelint-declaration-use-variable`](https://github.com/sh-waqar/stylelint-declaration-use-variable): Specify properties for which a SCSS variable must be used.
