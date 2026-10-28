# lightness-notation

Specify number or percentage notation for lightness.

<!-- prettier-ignore -->
```css
    a { color: oklch(85% 0.17 88) }
/**                  ↑
 *                   This notation */
```

Use this rule to enforce a convention. Lightness can be a number or a percentage. In `oklch()` and `oklab()` the [number runs from `0` to `1`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch#values), while in `lch()` and `lab()` it runs from `0` to `100`.

Choose:

- `"percentage"` for consistency across all four functions
- `"number"` to match [relative color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch#defining_relative_color_output_channel_components), where `l` is a number

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the lightness value and its expected notation.

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
