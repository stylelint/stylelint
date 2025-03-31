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

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`string`: `"without-a"|"with-a"`

### `"without-a"`

Applicable color-functions _must always_ use the without "a" notation.

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

### `"with-a"`

Applicable color-functions _must always_ use with "a" notation.

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
