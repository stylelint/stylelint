# Errors & warnings

In addition to rule problems, Stylelint surfaces the following errors and warnings:

## CSS syntax error

The chosen [PostCSS syntax](usage/options.md#customsyntax) was unable to parse the source.

#Hints to solve:
-make sure CSS declarations are separated using a semicolon(;)
-make sure each declaration block starts with an opening curly brace({)and ends with a closing curly brace(})
-use correct syntax for CSS property names and values, ex: background-color: lightblue; not background color: light-blue;
-use correct syntax for class selectors(.) or id selectors(#)
-separating property name and the value with a colon
-typos

## Parse error

The chosen [PostCSS syntax](usage/options.md#customsyntax) successfully parsed, but one of the construct-specific parsers failed to parse either a media query, selector or value within that source.

The construct-specific parsers are:

- `postcss-media-query-parser`
- `postcss-selector-parser`
- `postcss-value-parser`

## Unknown rule error

There is an unknown rule in the [configuration object](configure.md).

## Deprecation warning

There is a deprecated rule in the [configuration object](configure.md).

## Invalid option warning

There is a misconfigured rule in the [configuration object](configure.md).
