# Errors & warnings

In addition to rule problems, Stylelint surfaces the following errors and warnings:

## CSS syntax error

The chosen [PostCSS syntax](usage/options.md#customSyntax) was unable to parse the source.

## Parse error

The chosen [PostCSS syntax](usage/options.md#customSyntax) successfully parsed, but one of the construct-specific parsers failed to parse either a media query, selector or value within that source.

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
