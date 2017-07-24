# Plugins

Plugins are rules and sets of rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases. Their *package* names are prefixed with "stylelint". Their *rule* names are namespaced so that they do not clash with stylelint's core rules.

-   [`stylelint-at-rule-no-children`](https://github.com/adityavm/stylelint-at-rule-no-children): Disallow block rule declarations inside at-rules (with a few exceptions).
-   [`stylelint-csstree-validator`](https://github.com/csstree/stylelint-validator): Validate CSS values to match W3C specs and browsers extensions.
-   [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value): Specify properties for which either a variable (`$sass`, `@less`, `var(--cssnext)`), function or custom CSS keyword (`inherit`, `none`, etc.) must be used for its value.
-   [`stylelint-declaration-use-variable`](https://github.com/sh-waqar/stylelint-declaration-use-variable): Specify properties for which a variable must be used for its value.
-   [`stylelint-images`](https://github.com/ramasilveyra/stylelint-images): Check your CSS images to improve the performance and avoid common mistakes (plugin pack).
-   [`stylelint-no-browser-hacks`](https://github.com/Slamdunk/stylelint-no-browser-hacks): Disallow browser hacks that are irrelevant to the browsers you are targeting; uses [stylehacks](https://github.com/ben-eb/stylehacks).
-   [`stylelint-no-unsupported-browser-features`](https://github.com/ismay/stylelint-no-unsupported-browser-features): Disallow features that are unsupported by the browsers that you are targeting.
-   [`stylelint-order`](https://github.com/hudochenkov/stylelint-order): Specify the ordering of things e.g. properties within declaration blocks (plugin pack).
-   [`stylelint-rscss`](https://github.com/rstacruz/stylelint-rscss): Validate [RSCSS](http://rscss.io) conventions.
-   [`stylelint-scss`](https://github.com/kristerkari/stylelint-scss): Enforce a wide variety of SCSS-syntax specific linting rules (plugin pack).
-   [`stylelint-selector-bem-pattern`](https://github.com/davidtheclark/stylelint-selector-bem-pattern): Specify a BEM pattern for selectors (incorporates [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter)).
-   [`stylelint-suitcss`](https://github.com/suitcss/stylelint-suitcss): A collection of stylelint plugins for SUIT CSS, including deprecated `:root` rules (plugin pack).
