# color-alias-function-notation

Specify functional notation for color-functions with or without alpha suffix.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.2) }
/**            ↑
 *             This notation */
```

Color functions `rgb()` and `hsl()` have aliases `rgba()` and `hsla()`. Those are exactly equivalent, and it's preferable to use the first variant without `a`. This rule helps keeping color function names consistent. 

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix the function name.

## Options

`string`: `"without-a"|"with-a"`

### `"without-a"`

Applicable color-functions _must always_ be `rgb()` or `hsl()`.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: rgba(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgba(12 122 231 / 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(270 60% 50% / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(.75turn 60% 70%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgb(12 122 231 / 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(270 60% 50% / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(.75turn 60% 70%) }
```

### `"with-a"`

Applicable color-functions _must always_ be `rgba()` or `hsla()`.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgb(12 122 231 / 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(270 60% 50% / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(.75turn 60% 70%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: rgba(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgba(12 122 231 / 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(270 60% 50% / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(.75turn 60% 70%) }
```
