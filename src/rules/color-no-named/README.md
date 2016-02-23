# color-no-named

**Deprecated: use the [`color-named`](../color-named/README.md) rule with the [`"never"`](../color-named/README.md#never) option instead.**

Disallow named colors.

```css
a { color: black }
/**        ↑
 * These named colors */
```

The following patterns are considered warnings:

```css
a { color: black; }
```

```css
a { color: rebeccapurple; }
```

The following patterns are *not* considered warnings:

```css
a { color: #000; }
```

```css
a { color: rgb(0, 0, 0); }
```

```css
a { color: var(--foo-color-white); }
```

```scss
a { color: $blue; }
```
