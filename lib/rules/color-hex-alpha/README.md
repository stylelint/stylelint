# color-hex-alpha

Require or disallow alpha channel for hex colors.

<!-- prettier-ignore -->
```css
a { color: #fffa }
/**            ↑
 * This alpha channel */
```

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
