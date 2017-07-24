# block-closing-brace-empty-line-before

Require or disallow an empty line before the closing brace of blocks.

```css
a {
  color: pink;
  /* ← */
} /* ↑ */
/**  ↑
 * This line */
```

## Options

`string`: `"always-multi-line"|"never"`

### `always-multi-line`

The following patterns are considered violations:

```css
a {
  color: pink;
}
```

The following patterns are *not* considered violations:

```css
a {
  color: pink;

}
```

```css
a { color: pink; }
```

### `never`

The following patterns are considered violations:

```css
a {
  color: pink;

}
```

The following patterns are *not* considered violations:

```css
a {
  color: pink;
}
```

```css
a { color: pink; }
```
