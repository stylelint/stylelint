# lightness-notation

Specify number or percentage notation for lightness.

<!-- prettier-ignore -->
```css
    a { color: oklch(85% 0.17 88) }
/**                  ↑
 *                   This notation */
```

This rule supports `oklch`, `oklab`, `lch` and `lab` functions.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"percentage"`

Lightness _must always_ use the percentage notation.

```json
{
  "lightness-notation": "percentage"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: oklch(0.85 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: oklab(0.86 0.2 154) }
```

<!-- prettier-ignore -->
```css
a { color: lch(85 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: lab(86 0.2 154) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: oklch(85% 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: oklab(86% 0.2 154) }
```

<!-- prettier-ignore -->
```css
a { color: lch(85% 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: lab(86% 0.2 154) }
```

### `"number"`

Lightness _must always_ use the number notation.

```json
{
  "lightness-notation": "number"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: oklch(85% 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: oklab(86% 0.2 154) }
```

<!-- prettier-ignore -->
```css
a { color: lch(85% 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: lab(86% 0.2 154) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: oklch(0.85 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: oklab(0.86 0.2 154) }
```

<!-- prettier-ignore -->
```css
a { color: lch(85 0.17 88) }
```

<!-- prettier-ignore -->
```css
a { color: lab(86 0.2 154) }
```
