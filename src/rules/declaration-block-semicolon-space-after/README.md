# declaration-block-semicolon-space-after

Require a single space or disallow whitespace after the semicolons of declaration blocks.

```css
a { color: pink; top: 0; }
/**            ↑
 * The space after this semicolon */
```

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space after the semicolon.

The following patterns are considered warnings:

```css
a { color: pink;top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

The following patterns are *not* considered warnings:

```css
a { color: pink;}
```

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

### `"never"`

There *must never* be whitespace after the semicolon.

The following patterns are considered warnings:

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

The following patterns are *not* considered warnings:

```css
a { color: pink;}
```

```css
a { color: pink; }
```

```css
a { color: pink;top: 0; }
```

### `"always-single-line"`

There *must always* be a single space after the semicolon in single-line declaration blocks.

The following patterns are considered warnings:

```css
a { color: pink;top: 0; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

### `"never-single-line"`

There *must never* be whitespace after the semicolon in single-line declaration blocks.

The following patterns are considered warnings:

```css
a { color: pink; top: 0; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink;top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```
