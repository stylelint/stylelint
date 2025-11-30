# alpha-value-notation

Specify percentage or number notation for alpha-values.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.5) }
/**                        ↑
 *                         This notation */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"number"`

Alpha-values _must always_ use the number notation.

```json
{
  "alpha-value-notation": "number"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 50% }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 50%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 0.5 }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 0.5) }
```

### `"percentage"`

Alpha-values _must always_ use percentage notation.

```json
{
  "alpha-value-notation": "percentage"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 0.5 }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 0.5) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 50% }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 50%) }
```

## Optional secondary options

### `exceptProperties`

```json
{ "exceptProperties": ["array", "of", "properties", "/regex/"] }
```

Reverse the primary option for matching properties.

Given:

```json
{
  "alpha-value-notation": ["percentage", { "exceptProperties": ["opacity"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 50% }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 0.5) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 0.5 }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 50%) }
```
