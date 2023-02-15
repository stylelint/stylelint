# color-hex-alpha

Require or disallow alpha channel for hex colors.

<!-- prettier-ignore -->
```css
a { color: #fffa }
/**            ↑
 * This alpha channel */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

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
