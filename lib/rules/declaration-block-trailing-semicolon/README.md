# declaration-block-trailing-semicolon

Require or disallow a trailing semicolon within declaration blocks.

```css
a { background: orange; color: pink; }
/**                                ↑
 *                    This semicolon */
```

The trailing semicolon is the *last* semicolon in a declaration block and it is optional.

This rule will ignore Less mixins, trailing `//` comments, and declaration blocks containing nested (at-)rules.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a trailing semicolon.

The following patterns are considered violations:

```css
a { color: pink }
```

```css
a { background: orange; color: pink }
```

```css
a { @include foo }
```

The following patterns are *not* considered violations:

```css
a { color: pink; }
```

```css
a { background: orange; color: pink; }
```

```css
a { @include foo; }
```

### `"never"`

There *must never* be a trailing semicolon.

The following patterns are considered violations:

```css
a { color: pink; }
```

```css
a { background: orange; color: pink; }
```

The following patterns are *not* considered violations:

```css
a { color: pink }
```

```css
a { background: orange; color: pink }
```
