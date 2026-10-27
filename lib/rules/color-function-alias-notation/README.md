# color-function-alias-notation

Specify alias notation for color-functions.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.2) }
/**            ↑
 *             This notation */
```

You can use this rule to enforce a convention. `rgba()` and `hsla()` are [aliases of `rgb()` and `hsl()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/rgb), which accept an alpha value themselves.

Use:

- `"without-alpha"` to follow the specification, which keeps the aliases only for compatibility
- `"with-alpha"` for older browsers, which accept an alpha value only in `rgba()` and `hsla()`

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the color value and its expected notation.

## Options

### `"without-alpha"`

Applicable color-functions _must always_ use the without alpha notation.

```json
{
  "color-function-alias-notation": "without-alpha"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: rgba(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(270 60% 50% / 15%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(270 60% 50% / 15%) }
```

### `"with-alpha"`

Applicable color-functions _must always_ use with alpha notation.

```json
{
  "color-function-alias-notation": "with-alpha"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(270 60% 50% / 15%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: rgba(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(270 60% 50% / 15%) }
```
