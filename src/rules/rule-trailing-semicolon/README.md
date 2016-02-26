# rule-trailing-semicolon

**Deprecated: use the [`declaration-block-trailing-semicolon`](../declaration-block-trailing-semicolon/README.md) rule instead.**

Require or disallow a trailing semicolon within rules.

```css
a { background: orange; color: pink; }
/**                                ↑
 *                    This semicolon */
```

The trailing semicolon is the *last* semicolon in a rule and it is optional.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a trailing semicolon.

The following patterns are considered warnings:

```css
a { color: pink }
```

```css
a { background: orange; color: pink }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { background: orange; color: pink; }
```

### `"never"`

There *must never* be a trailing semicolon.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a { background: orange; color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink }
```

```css
a { background: orange; color: pink }
```
