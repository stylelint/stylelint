# Errors

In addition to rule violations, stylelint surfaces the following errors and warnings:

# CSS Syntax Error (CssSyntaxError)

The chosen [PostCSS syntax](../about/syntaxes.md) was unable to parse the source.

# Parse Error

The chosen [PostCSS syntax](../about/syntaxes.md) successfully parsed, but one of the construct-specific parsers failed to parse either a media query, selector or value within that source.

The construct-specific parsers are:

-   `postcss-media-query-parser`
-   `postcss-selector-parser`
-   `postcss-value-parser`

# Unknown Rule Error

There is an unknown rule in the [configuration object](configure.md).

# Deprecation Warning

There is a deprecated rule in the [configuration object](configure.md).

# Invalid Option Warning

There is a misconfigured rule in the [configuration object](configure.md).
