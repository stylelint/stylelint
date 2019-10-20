# block-opening-brace-empty-line-before

Require or disallow an empty line after the opening brace of blocks.

```css

/** This line
     ↓ */
a /* ↓ */
{ /* ↓ */
  /* ← */
  color: pink;
}
```

The `--fix` option on the [command line](../../../docs/user-guide/cli.md#autofixing-errors) can automatically fix all of the problems reported by this rule.

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
