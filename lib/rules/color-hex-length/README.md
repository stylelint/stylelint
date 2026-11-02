# color-hex-length

Specify short or long notation for hex colors.

<!-- prettier-ignore -->
```css
a { color: #fff }
/**        ↑
 * This hex color */
```

Use this rule to enforce a convention. A [hex color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/hex-color) can be shortened when each pair of digits repeats, e.g. `#fff` for `#ffffff`.

Choose:

- `"short"` for brevity
- `"long"` to match colors copied from design tools

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the hex color and its expected notation.

## Options

### `"short"`

```json
{
  "color-hex-length": "short"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #ffffff; }
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
a { color: #fffa; }
```

<!-- prettier-ignore -->
```css
a { color: #a4a4a4; }
```

### `"long"`

```json
{
  "color-hex-length": "long"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #fff; }
```

<!-- prettier-ignore -->
```css
a { color: #fffa; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: #ffffff; }
```

<!-- prettier-ignore -->
```css
a { color: #ffffffaa; }
```
