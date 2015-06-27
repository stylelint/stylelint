# declaration-block-semicolon-newline-after

Require a newline or disallow whitespace after the semicolons of declaration blocks.

```css
    a {
      color: pink;
      top: 0;    ↑
    }            ↑
/**              ↑
 * The newline after this semicolon */
```

End-of-line comments are allowed one space after the semicolon.

```css
a {
  color: pink; /* something to say */
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

The following patterns are *not* considered warnings:

```css
a {
  color: pink;
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
