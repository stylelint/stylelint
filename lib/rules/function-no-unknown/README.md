# function-no-unknown

Disallow unknown functions.

<!-- prettier-ignore -->
```css
a { transform: unknown(1); }
/**            ↑
 * Functions like this */
```

This rule considers functions defined in the CSS Specifications to be known.

This rule ignores double-dashed custom functions, e.g. `--custom-function()`.

This rule overlaps with:

- [`at-rule-descriptor-value-no-unknown`](../at-rule-descriptor-value-no-unknown/README.md)
- [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md)

We recommend using these rules for CSS and this rule for CSS-like languages, such as SCSS and Less.

## Options

### `true`

```json
{
  "function-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: unknown(1); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a { transform: --custom-function(1); }
```

## Optional secondary options

### `ignoreFunctions`

```json
{ "ignoreFunctions": ["array", "of", "functions", "/regex/"] }
```

Ignore the specified functions.

Given:

```json
{
  "function-no-unknown": [true, { "ignoreFunctions": ["theme", "/^foo-/"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: theme(1); }
```

<!-- prettier-ignore -->
```css
a { transform: foo-func(1); }
```
