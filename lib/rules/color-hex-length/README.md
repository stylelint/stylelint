# color-hex-length

Specify short or long notation for hex colors.

<!-- prettier-ignore -->
```css
a { color: #fff }
/**        ↑
 * This hex color */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

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
