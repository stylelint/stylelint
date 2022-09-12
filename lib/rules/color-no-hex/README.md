# color-no-hex

Disallow hex colors.

<!-- prettier-ignore -->
```css
a { color: #333 }
/**        ↑
 * This hex color */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #000; }
```

<!-- prettier-ignore -->
```css
a { color: #fff1aa; }
```

<!-- prettier-ignore -->
```css
a { color: #123456aa; }
```

Hex values that are not valid also cause problems:

<!-- prettier-ignore -->
```css
a { color: #foobar; }
```

<!-- prettier-ignore -->
```css
a { color: #0000000000000000; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: black; }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0, 0, 0); }
```

<!-- prettier-ignore -->
```css
a { color: rgba(0, 0, 0, 1); }
```
