# color-no-hex

Disallow hex colors.

```css
a { color: #333 }
/**        ↑
 * These hex colors */
```

The `--fix` option on the command line can automatically fix all of the problems reported by this rule if applicable. See the options below.

## Options

`boolean`: `true|false`

If `false`, the rule is disabled. If `true`, the rule is enabled, but no fix will be performed.

`string`: `rgb|rgba|hsl|hsla`

### `rgb` | `rgba`

`rgb` and `rgba` are the same. If the color format is an hex with transparency (Like #FFFFFFDC), the output will be in rgba format. Otherwise, it will be rgb. There's no way to force one or another.

### `hsl` | `hsla`

`hsl` and `hsla` are the same. If the color format is an hex with transparency (Like #FFFFFFDC), the output will be in hsla format. Otherwise, it will be hsl. There's no way to force one or another.

The following patterns are considered violations:

```css
a { color: #000; }
```

```css
a { color: #fff1aa; }
```

```css
a { color: #123456aa; }
```

Hex values that are not valid also cause violations:

```css
a { color: #foobar; }
```

```css
a { color: #0000000000000000; }
```

The following patterns are *not* considered violations:

```css
a { color: black; }
```

```css
a { color: rgb(0, 0, 0); }
```

```css
a { color: rgba(0, 0, 0, 1); }
```
