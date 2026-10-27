# color-hex-alpha

Require or disallow alpha channel for hex colors.

<!-- prettier-ignore -->
```css
a { color: #fffa }
/**            ↑
 * This alpha channel */
```

You can use this rule to enforce a convention. A [hex color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/hex-color) can carry its alpha as a fourth pair of digits, e.g. `#00000080`.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the hex color.

## Options

### `"always"`

```json
{
  "color-hex-alpha": "always"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #fff; }
```

<!-- prettier-ignore -->
```css
a { color: #ffffff; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: #fffa; }
```

<!-- prettier-ignore -->
```css
a { color: #ffffffaa; }
```

### `"never"`

```json
{
  "color-hex-alpha": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #fffa; }
```

<!-- prettier-ignore -->
```css
a { color: #ffffffaa; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: #fff; }
```

<!-- prettier-ignore -->
```css
a { color: #ffffff; }
```
