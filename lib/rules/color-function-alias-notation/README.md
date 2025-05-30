# color-function-alias-notation

Specify alias notation for color-functions.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.2) }
/**            ↑
 *             This notation */
```

Color functions `rgb()` and `hsl()` have aliases `rgba()` and `hsla()`. Those are exactly equivalent, and [it's preferable](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb) to use the first variant without `a`.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

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
