# Vision

A linter for CSS and CSS-like languages that is:

-   Complete - with coverage of all standard CSS syntax.
-   Extensible - with multiple points of extension.
-   Configurable - with no defaults and plenty of options to tailor the linter.
-   Robust - with comprehensive test coverage and a wide range of fixtures.
-   Consistent - with conventions for behaviour, naming and documentation.
-   Performant - with tools to test and improve performance.

## Complete

Provide built-in rules for the following three areas:

-   [Possible errors](../user-guide/rules/list.md#possible-errors).
-   [Limit language features](../user-guide/rules/list.md#limit-language-features).
-   [Stylistic issues](../user-guide/rules/list.md#stylistic-issues).

### Possible errors

Provide rules to catch code that is valid but likely has unintended consequences e.g. duplicates and overrides.

### Limit language features

Provide rules to limit what language features can be used, including:

-   Enforcing a maximum specificity by limiting the specificity itself or the occurrence of different selector types e.g. class, ID, attribute etc.
-   Enforcing best practices _at the configuration level_ e.g. disallowing the `all` keyword for transitions as it is not performant.
-   Enforcing the use of a subset of features to improve consistency across a code base e.g. limiting what units are allowed (`px` or `rem` etc.)
-   Enforcing specific patterns for selectors and names (e.g. those of custom properties).

### Stylistic issues

Provide rules to enforce a diverse range of stylistic conventions, including:

-   Whitespace
-   Case
-   Quotes

## Extensible

Provide multiple points of extensions, including:

-   [Plugins](../developer-guide/plugins.md) - build community rules to support methodologies, toolsets, non-standard CSS features, or very specific use cases.
-   [Extendable configs](../user-guide/configuration.md#extends) - extend and share configurations.
-   [Formatters](../developer-guide/formatters.md) - format stylelint result objects.
-   [Custom syntax](../user-guide/usage/node-api.md#customsyntax) - use any PostCSS-compatible syntax module.

## Robust

Provide a robust tool with a [comprehensive test suite](../developer-guide/rules.md#write-tests), including:

-   High coverage, currently over 95%.
-   A wide range of fixtures for rules, currently over 10000.

## Consistent

Provide consistency throughout, including:

-   Consistent [names](../developer-guide/rules.md#naming-a-rule), [options](../developer-guide/rules.md#determining-options), [violation messages](../developer-guide/rules.md#determine-violation-messages), [documentation](../developer-guide/rules.md#write-the-readme) and [treatment](../developer-guide/rules.md#write-the-rule) of non-standard syntax within/of rules.
-   Consistent [requirements for inclusion](../developer-guide/rules.md#criteria-for-inclusion).

## Performant

Provide a fast tool, and the means to test and improve performance, including [benchmarking](../developer-guide/rules.md#improving-the-performance-of-a-rule) of an individual rule's performance.
