# declaration-block-semicolon-newline-after

Require a newline or disallow whitespace after the semicolons of declaration blocks.

```css
a {
  color: pink;
  top: 0;    ↑
}            ↑
/**          ↑
 * The newline after this semicolon */
```

This rule allows an end-of-line comment followed by a newline. For example,

```css
a {
  color: pink; /* end-of-line comment */
  top: 0;
}
```

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the semicolon.

The following patterns are considered warnings:

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink; /* end-of-line comment
    containing a newline */
  top: 0;
}
```

The following patterns are *not* considered warnings:

```css
a {
  color: pink;
  top: 0;
}
```

```css
a {
  color: pink; /* end-of-line comment */
  top: 0;
}
```

### `"always-multi-line"`

There *must always* be a newline after the semicolon in multi-line rules.

The following patterns are considered warnings:

```css
a {
  color: pink; top: 0;
}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

### `"never-multi-line"`

There *must never* be whitespace after the semicolon in multi-line rules.

The following patterns are considered warnings:

```css
a {
  color: pink;
  top: 0;
}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink
  ; top: 0;
}
```
