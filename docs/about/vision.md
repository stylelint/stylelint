# Vision

A linter for CSS and CSS-like languages that is:

- complete - coverage of all standard CSS syntax
- extensible - multiple points of extension
- configurable - no defaults and options to tailor the linter
- robust - comprehensive test coverage and a wide range of fixtures
- consistent - conventions for behavior, naming and documentation
- performant - tools to test and improve performance

## Complete

Provide built-in rules for standard CSS syntax that:

- [avoid errors](../user-guide/rules/list.md#avoid-errors)
- [enforce conventions](../user-guide/rules/list.md#enforce-conventions)

## Extensible

Provide multiple points of extensions, including:

- [custom syntaxes](../developer-guide/syntaxes.md) - use any PostCSS-compatible syntax to support other CSS-like languages and containers
- [extendable configs](../user-guide/configure.md#extends) - extend and share configurations
- [formatters](../developer-guide/formatters.md) - format Stylelint result objects
- [plugins](../developer-guide/plugins.md) - build community rules to support methodologies, toolsets, non-standard CSS features, other languages (like SCSS) or very specific use cases

## Robust

Provide a robust tool with a [comprehensive test suite](../developer-guide/rules.md#write-tests), including:

- high coverage, currently over 95%
- a wide range of fixtures for rules

## Consistent

Provide consistency throughout, including consistent [rules](../user-guide/rules/about.md).

## Performant

Provide a fast tool and the means to test and improve performance, including [benchmarking](../developer-guide/rules.md#improve-the-performance-of-a-rule) of an individual rule's performance.
